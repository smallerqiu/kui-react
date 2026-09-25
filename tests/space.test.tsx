import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import Space from "../components/space";

it("wraps only when explicitly enabled", () => {
  const view = render(<Space><button>A</button><button>B</button></Space>);
  const root = () => view.container.firstElementChild!;
  expect(root().classList.contains("k-space-wrap")).toBe(false);
  view.rerender(<Space compact><button>A</button><button>B</button></Space>);
  expect(root().classList.contains("k-space-wrap")).toBe(false);
  expect(root().firstElementChild!.classList.contains("k-space-first-item")).toBe(true);
  view.rerender(<Space compact wrap><button>A</button><button>B</button></Space>);
  expect(root().classList.contains("k-space-wrap")).toBe(true);
  view.rerender(<Space wrap={false}><button>A</button><button>B</button></Space>);
  expect(root().classList.contains("k-space-wrap")).toBe(false);
  view.rerender(<Space><button>A</button><button>B</button></Space>);
  expect(root().classList.contains("k-space-wrap")).toBe(false);
});
