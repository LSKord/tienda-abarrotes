import { useEffect, useState } from "react";
import type { UserModel } from "../models/userModel"; 
import { getUsers } from "../services/apiService"; 
import { UsersContext } from "../contexts/usersContext"; 
import { useAuth } from "../hooks/useAuth";

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {token,loading} = useAuth();
  const [users, setUsers] = useState<UserModel[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const fetchData = async () => {
    if (!token) return;
    if (loading) return;
    setLoadingUsers(true);
    try {
      const data = await getUsers(token);
      setUsers(data);
    } catch (error) {
      console.error("Error al obtener productos", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <UsersContext.Provider value={{ users , loadingUsers, refreshUsers:fetchData}}>
      {children}
    </UsersContext.Provider>
  );
};