import React, { useEffect, useState } from "react";
import { FiMail, FiLogOut } from "react-icons/fi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { getClientDetailsById } from "../../API/UserManagement/Client/ClientDetails";

export default function ProfilePage() {

  const [showDetails, setShowDetails] = useState(false);
  const [clientData, setClientData] = useState();
  const navigate = useNavigate();
  const user = {
    name: "Praveen",
    email: "praveen@example.com",
    phone: "+1 234 567 8900",
    profileImageUrl: "https://placehold.co/100x100/A5B4FC/ffffff?text=P",
  };

  const userId = sessionStorage.getItem("LoginUserId");

  const handleLogout = () => {
    // sessionStorage.setItem("token", null);
    // sessionStorage.setItem("LoginUserId", null);
    sessionStorage.removeItem("token");
    if (userId.includes("PRO")) {
      navigate("/");
    } else if (userId.includes("emp")) {
      navigate("/employee");
    } else {
      navigate(`/client/${userId}`);
    }
    //sessionStorage.removeItem("LoginUserId");
    window.location.reload();
  };

    useEffect(() => {
      const fetchClientDetails = async () => {
        try {
          const res = await getClientDetailsById(userId, setClientData);
          console.log(res, "res");
        } catch (err) {
          console.error("Status check failed", err);
        } finally {
          setLoading(false);
        }
      };
  
      if (userId) {
        fetchClientDetails();
      }
    }, [userId]);

    console.log(clientData, "clientData")

  return (
    <>
      <div className="flex flex-col items-center bg-gradient-to-b from-indigo-50 to-white p-[0.5vw] rounded-[1vw] shadow-md">
        {/* Profile Image */}
        <div className="relative mb-[0.5vw]">
          <img
            src={user.profileImageUrl}
            alt="User Profile"
            className="w-[8.5vh] h-[8.5vh] border-[0.2vw] border-gray-400 rounded-full object-cover shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Greeting */}
        <div className="text-center ">
          <h1 className="text-[1.25vw] font-bold text-gray-800 drop-shadow-sm">
            Hey, {clientData?.company?.owner_name}!
          </h1>
        </div>
        <div className="w-full flex items-center justify-between px-[1vw] ">
          <div className="text-[1vw] mt-[0.5vw] text-gray-500">
            Welcome to your profile.
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-[1.1vw] font-semibold text-gray-800 focus:outline-none cursor-pointer"
          >
            {showDetails ? (
              <FaChevronUp className="w-[1vw] h-[1vw] text-indigo-500 transition-transform duration-300" />
            ) : (
              <FaChevronDown className="w-[1vw] h-[1vw] text-indigo-500 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Animated dropdown */}
        <div
          className={`transition-all duration-200 ease-in-out overflow-hidden ${
            showDetails ? "max-h-full opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-[0.2vw]">
            <div className="flex cursor-default items-center space-x-[1.5vw] p-[0.5vw] rounded-lg hover:bg-indigo-50 transition-all duration-200">
              <FiMail className="w-[1.5vw] h-[1.5vw] text-[#323232]" />
              <div>
                <p className="text-[0.9vw] text-gray-400">Email Address</p>
                <p className="text-[0.8vw] font-medium text-gray-700">
                  {clientData?.company?.emailid}
                </p>
              </div>
            </div>

            <div className="flex cursor-default items-center space-x-4 p-[0.5vw] rounded-lg hover:bg-indigo-50 transition-all duration-200">
              <FaCircleUser className="w-[1.5vw] h-[1.5vw] text-[#323232]" />
              <div>
                <p className="text-[0.9vw] text-gray-400">User ID </p>
                <p className="text-[0.8vw] font-medium text-gray-700">
                  {sessionStorage.getItem("LoginUserId")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="mt-[1vw] text-center">
        <button
          onClick={handleLogout}
          className="flex cursor-pointer items-center justify-center space-x-2 w-full px-[2vw] py-[0.5vw] bg-[#4c67edd5] hover:bg-[#4C67ED] text-white font-semibold rounded-[1vw] shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4C67ED] focus:ring-opacity-50"
        >
          <FiLogOut className="w-5 h-5 text-white" />
          <span>Log Out</span>
        </button>
      </div>
    </>
  );
}
