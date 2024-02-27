import React, { useState, useEffect ,createContext } from 'react';
import { Global } from '../helpers/Global';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState({});
    const [counters, setCounters] = useState({});
    const [loading, setLoading] = useState(true);


    useEffect(() => {
      authUser();
    }, [])

    const authUser = async() => {
      // Sacar datos del usuario identificado del localstorage
      const token = localStorage.getItem("token");
      const user =  localStorage.getItem("user");

      // Comprobar si tengo el token y el user
      if(!token || !user){
        setLoading(false);
        return false
      }

      // Transformar los datos aun objeto de javascript
      const userObj = JSON.parse(user);
      const userId = userObj.id; 

      // Peticion ajax al backend que compruebe el token y
      // que me devuelva todos los datos de usuario
      const request = await fetch(Global.url + "user/profile/" + userId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      });

      const data = await request.json();

      // // Peticion para los contadores
      const requestCounter = await fetch(Global.url + "user/counter/" + userId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      });
      const dataCounter = await requestCounter.json();


      // Setear el estado de auth
      setAuth(data.user);
      setCounters(dataCounter);
      setLoading(false);

    }

  return (<AuthContext.Provider 
            value= {{
                auth,
                setAuth,
                counters,
                setCounters,
                loading
            }}
        >
    {children}
  </AuthContext.Provider>)
}


export default AuthContext;