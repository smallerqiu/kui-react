import type { ValueType } from "../const/types";

export const getValueWithType = (checked: boolean, vType: ValueType): boolean | number | string => {
  let value: boolean | number | string = checked;
  switch (vType) {
    case "string":
      value = checked ? "1" : "0";
      break;
    case "number":
      value = checked ? 1 : 0;
      break;
    case "boolean":
      value = checked ? true : false;
      break;
  }
  return value;
};
