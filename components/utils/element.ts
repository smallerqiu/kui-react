export function isNotEmpty(str: any) {
  return str !== "" && str !== undefined && str !== null;
}
export function isEmpty(str: any) {
  return str === "" || str === undefined || str === null || str.length === 0;
}
