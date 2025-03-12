import { useContext } from "react";
import { DataContext } from "@/context/supplier-context";

const useDataContext = () => {
  return useContext(DataContext);
};

export default useDataContext;
