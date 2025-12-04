import { useContext } from "react";
import { UsersContext } from "../contexts/usersContext"; 

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers debe usarse dentro de un UsersProvider");
  }
  return context;
};
