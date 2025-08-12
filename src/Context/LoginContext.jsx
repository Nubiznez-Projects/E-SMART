import { createContext, useContext, useState } from "react";

const LoginContext = createContext();

export const LoginProvider = ({children}) => {
      
  const [loginID, setLoginID] = useState();
  const [ownerID, setOwnerID] = useState();
  const [roleType, setRoleType] = useState();
  const [loginUser, setLoginUser] = useState();
  const [token, setToken] = useState();


  return(
    <LoginContext.Provider 
    value={{loginID, setLoginID, ownerID, setOwnerID, roleType, setRoleType, loginUser, setLoginUser, token, setToken}}
    >
        {children}
    </LoginContext.Provider>
  )
}


export const useLoginContext = () => useContext(LoginContext);