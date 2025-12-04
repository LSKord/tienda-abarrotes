import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/Password";
import { Card } from "primereact/card";
import { loginUser } from "../services/apiService";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Message } from "primereact/message";

const Login = () => {
  const {login} = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorLabel,setErrorLabel] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
  })

  const logUser = async() =>{
    setLoading(true);
    setErrorLabel("");
    try {
      const response = await loginUser({Usuario:username,Password:password});
      if (response.role == "Administrador"||response.role == "Vendedor") {
        login(response.accessToken,response.refreshToken,response.user,response.username);
        navigate("/inventory");
      } else {
        setErrorLabel("El usuario no tiene los permisos necesarios");
      }
    } catch (e) {
      console.error(e);
      setErrorLabel("Las credenciales son invalidas");
    } finally {
      setLoading(false);
    }
  }

  const header = (
    <div className="flex justify-content-center mt-3">
      <img
        alt="login image"
        src="https://img.freepik.com/vector-premium/ilustracion-plana-mini-tienda_847361-516.jpg"
        className="w-6rem h-6rem border-circle object-cover"
      />
    </div>
  );

  return (
    <div className="flex justify-content-center align-items-center min-h-screen">
      <Card
        title={<h3 className="text-center m-0">Bienvenido</h3>}
        subTitle={<p className="text-center m-0">Ingresa con tu cuenta</p>}
        header={header}
        className="w-3 shadow-3"
      >
        <label htmlFor="userText" className="font-semibold">
          Usuario
        </label>
        <div className="p-inputgroup flex-1 pt-1 pb-3">
          <span className="p-inputgroup-addon">
            <i className="pi pi-user"></i>
          </span>
          <InputText
            id="userText"
            placeholder="Ingrese su usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled = {loading}
          />
        </div>
        <label htmlFor="passwordText" className="font-semibold">
          Contraseña
        </label>
        <div className="p-inputgroup flex-1 pt-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-lock"></i>
          </span>
          <Password
            id="passwordText"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            feedback={false}
            disabled = {loading}
          />
          
        </div>
        {errorLabel && (
          <div className="flex justify-content-center mt-2">
            <Message severity="error" text={errorLabel} className="w-auto text-center"/>
          </div>
        )}
        <Button label="Ingresar" loading={loading} className="mt-3 w-full" onClick={logUser}/>
      </Card>
    </div>
  );
};

export default Login;
