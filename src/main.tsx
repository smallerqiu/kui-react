import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../components/styles/index.less";
import App from "./App";
import "./assets/css/demo.less";
import "./assets/css/index.less";

createRoot(document.getElementById("app")!).render(<StrictMode><App /></StrictMode>);
