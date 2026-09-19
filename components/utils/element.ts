export function isNotEmpty(str: unknown) {
  return str !== "" && str !== undefined && str !== null;
}
export function isEmpty(str: unknown) {
  return (
    str === "" ||
    str === undefined ||
    str === null ||
    (typeof str === "string" || Array.isArray(str) ? str.length === 0 : false)
  );
}
