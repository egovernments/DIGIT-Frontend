import { createGlobalState } from "./createState";

export const useDrawerState = createGlobalState("drawer", {
  isOpen:false,
  content:"",
  clickedFrom:""
});
