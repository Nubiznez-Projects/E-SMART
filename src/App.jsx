import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { ToastContainer } from 'react-toastify';
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Components/Common/SideBar";
//import ChartBar from './Components/Common/ChartComponents/ChartBar';
import { useEffect, useState } from "react";
import ProfilePage from "./Components/Common/ProfilePage";
import Sales from "./Components/Sales/Sales";
import Purchase from "./Components/Purchase/Purchase";
import Roles from "./Components/MasterSetup/Roles/Roles";
import Master from "./Components/MasterSetup/Master";
import Analytics from "./Components/DataAnalytics/Analytics";
import LoginPage from "./Components/Login/LoginPage";
import { ToastContainer, Bounce, Zoom, Flip } from "react-toastify";
import UserManagement from "./Components/UserManagement/UserManagement";
import { UserProvider } from "./Context/UserContext";
import Settings from "./Components/Settings/Settings";
import Login from "./Components/Login/Login";
import { LoginProvider } from "./Context/LoginContext";
import RequestManagement from "./Components/RequestManagement/RequestManagement";
import DocumentVerification from "./Components/UserManagement/Client/DocumentVerification";
import PendingApproval from "./Components/UserManagement/Client/PendingApproval";
import Subscription from "./Components/Subscription/Subscription";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedModule, setSelectedModule] = useState();
  const [animate, setAnimate] = useState(false);
  const [authtoken, setAuthtoken] = useState(sessionStorage.getItem("token"));
  const userStatus = sessionStorage.getItem("status");
  const [clientData, setClientData] = useState();
  const userId = sessionStorage.getItem("LoginUserId");


  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const LoginId = sessionStorage.getItem("LoginUserId");
    if (token) {
      setAuthtoken(token);
    }
    if (LoginId?.startsWith("PRO")) {
      setSelectedModule(5);
    } else {
      setSelectedModule(2);
    }
  }, [sessionStorage.getItem("token")]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
    setAnimate(true);
    // Reset animation after it completes (2 seconds)
    setTimeout(() => {
      setAnimate(false);
    }, 2000);
  };

  return (
    <>
      <Router>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
        {authtoken ? (
          <>
            {userStatus === "not_verified" ? (
             <DocumentVerification clientData={clientData} userId={userId} />
            ) : userStatus === "Pending" || userStatus === "InActive" ? (
              <PendingApproval />
            ) : (
              <>
                <Sidebar
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  setIsSidebarOpen={setIsSidebarOpen}
                  setSelectedModule={setSelectedModule}
                  selectedModule={selectedModule}
                />
                <div className="mt-[1vw] px-[2vw]">
                  <div className=" bg-[#FFFFFF4D] w-full px-[3vw] rounded-2xl shadow-md h-[86vh]">
                    <Routes className="">
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/sales" element={<Sales />} />
                      <Route path="/purchase" element={<Purchase />} />
                      <Route path="/roles" element={<Roles />} />
                      <Route path="/mastersetup" element={<Master />} />
                      <Route path="/dataanalytics" element={<Analytics />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/subscription" element={<Subscription />} />
                      <Route
                        path="/requestManagement"
                        element={<RequestManagement />}
                      />
                      <Route
                        path="/usermanagement"
                        element={
                          <UserProvider>
                            <UserManagement />
                          </UserProvider>
                        }
                      />
                    </Routes>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <Routes>
            <Route
              path="/client/:clientId"
              element={
                <LoginProvider>
                  <Login
                  setClientData={setClientData}
                    setAuthtoken={setAuthtoken}
                    setSelectedModule={setSelectedModule}
                  />
                </LoginProvider>
              }
            />
            <Route
              path="/employee"
              element={
                <LoginProvider>
                  <Login
                    setAuthtoken={setAuthtoken}
                    setSelectedModule={setSelectedModule}
                  />
                </LoginProvider>
              }
            />
          </Routes>
        )}
      </Router>
    </>
  );
}

export default App;
