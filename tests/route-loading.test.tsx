import { act, render } from "@testing-library/react";
import { lazy, startTransition, Suspense } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import loading from "../components/loading";
import { withRouteLoading } from "../src/utils/route-loading";

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
};
afterEach(async () => {
  await act(async () => loading.destroy());
});

describe("route loading progress", () => {
  it("shows progress while a transition retains the previous page without mounting its fallback", async () => {
    const request = deferred<{ default: () => React.ReactNode }>();
    const Page = lazy(withRouteLoading(() => request.promise));
    const { rerender, queryByText } = render(
      <Suspense fallback={<div>Fallback</div>}>
        <div>Previous</div>
      </Suspense>,
    );
    await act(async () => {
      startTransition(() =>
        rerender(
          <Suspense fallback={<div>Fallback</div>}>
            <Page />
          </Suspense>,
        ),
      );
    });
    expect(queryByText("Previous")).not.toBeNull();
    expect(queryByText("Fallback")).toBeNull();
    expect((document.querySelector(".k-loading-line") as HTMLElement)?.style.width).toBe("5%");
    await act(async () => request.resolve({ default: () => <div>Loaded</div> }));
    expect(queryByText("Loaded")).not.toBeNull();
    expect((document.querySelector(".k-loading-line") as HTMLElement)?.style.width).toBe("100%");
  });

  it("finishes only after overlapping imports settle, including a rejected import", async () => {
    const start = vi.spyOn(loading, "start").mockImplementation(() => {});
    const finish = vi.spyOn(loading, "finish").mockImplementation(() => {});
    const first = deferred<string>();
    const second = deferred<string>();
    const a = withRouteLoading(() => first.promise)();
    const b = withRouteLoading(() => second.promise)();
    const rejected = expect(b).rejects.toThrow("Failed import");
    await Promise.resolve();
    expect(start).toHaveBeenCalledTimes(1);
    first.resolve("ok");
    await a;
    expect(finish).not.toHaveBeenCalled();
    second.reject(new Error("Failed import"));
    await rejected;
    expect(finish).toHaveBeenCalledTimes(1);
  });
});
