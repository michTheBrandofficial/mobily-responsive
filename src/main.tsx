import { render } from "nixix";
import "./index.css";
import View from "./view";

/* @module-refresh */
const root = document.querySelector<HTMLBodyElement>("body");
const Mount = () => {
  render(() => <View />, root!);
  return 0;
};

Mount();
export default Mount;
