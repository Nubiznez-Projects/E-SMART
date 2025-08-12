import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({children}) => {
      
  const [action, setAction] = useState("add");
  const [empId, setEmpId] = useState(null);
  const [empData, setEmpData] = useState(null);
  const [headerTab, setHeaderTab] = useState("personal");


  return(
    <UserContext.Provider 
    value={{action, setAction, empId, setEmpId, empData, setEmpData, headerTab, setHeaderTab}}
    >
        {children}
    </UserContext.Provider>
  )
}


export const useUserContext = () => useContext(UserContext);