import { useState, useEffect, useRef } from "react";
import { AuthContext } from "../contexts/authContext";
import { isTokenExpired } from "../utils/tokenExpire";
import { refreshToken } from "../services/apiService";

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading,setLoading] = useState(false);
  const timeOutRef = useRef<number|null>(null);

  const login = (token: string, refreshToken: string,user:number,username:string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("tokenTime", Date.now().toString());
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", user.toString());
    localStorage.setItem("username", username);
    setToken(token);
    scheduleRefresh();
  };

  const refresh = async() => {
    const savedRefreshToken = localStorage.getItem("refreshToken");
    if (!savedRefreshToken) return logout();
    setLoading(true);
    try{
      const response = await refreshToken(savedRefreshToken)
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("tokenTime", Date.now().toString());
      localStorage.setItem("refreshToken", response.refreshToken);
      setToken(response.accessToken);
      console.log("token refrescado automaticamente");
      scheduleRefresh();
    } catch (error){
      console.error("error al refrescar token",error);
      logout();
    } finally {
      setLoading(false);
    }
  } 

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenTime");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    setToken(null);
    if (timeOutRef.current) clearTimeout(timeOutRef.current);
  };

  const scheduleRefresh = () => {
    if (timeOutRef.current) clearTimeout(timeOutRef.current);
    const interval = 28*60*1000;
    timeOutRef.current =  setTimeout(()=>{
      refresh();
    },interval);
  }

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken && !isTokenExpired()) {
      setToken(savedToken);
      scheduleRefresh();
    } else {
      refresh();
    }

    return () => {
      if (timeOutRef.current) clearTimeout(timeOutRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout,loading }}>
      {children}
    </AuthContext.Provider>
  );
};
