import * as components from "./components";
export * from "./components";

export const version = (import.meta as any).env?.version as string;

export { components };

export default { version };
