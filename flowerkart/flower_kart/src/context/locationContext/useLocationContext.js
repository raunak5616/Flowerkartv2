import { useContext } from "react";
import { LocationContext } from "./location.context";

export const useLocationContext = () => {
  return useContext(LocationContext);
};
