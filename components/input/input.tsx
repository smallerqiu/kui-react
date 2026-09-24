import React from "react";
import { createFormFieldComponent } from "../form/field-context";
import InputBase, { type InputProps, type InputRef } from "./input-base";

export type { InputProps, InputRef } from "./input-base";

const Input = React.forwardRef<InputRef, InputProps>((props, ref) => (
  <InputBase {...props} ref={ref} stylePrefix="input" controls={undefined} />
));
Input.displayName = "Input";

export default createFormFieldComponent(Input);
