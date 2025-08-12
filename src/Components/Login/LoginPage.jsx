import React, { useState } from "react";
import LoginImg from '../../Assets/LoginImg.jpg'
//import half from "../../Assets/half.png";
import Login from "./Login";

export default function LoginPage() {
  const [forgotpassword, setForgotPassword] = useState(false);

  return (
    <>
      <div className="flex w-screen h-screen items-center justify-center">
        <div className="w-[55%] h-screen relative flex justify-center items-center">
          <div className="absolute right-[10vw]">
            <img
              src={LoginImg}
              alt="loginGif"
              className="w-[37vw] h-[37vw] rounded-xl"
              style={{
                zIndex: 2,
                position: "relative",
              }}
            />
          </div>
          <div className="absolute bg-gradient-to-r from-[#A2BE9A] to-[#117283] right-0 top-0 h-[100vh] w-full"></div>
        </div>
        <div className="w-[45%]  h-full flex items-center justify-center">
          {forgotpassword ? (
            // <ForgotPassword setForgotPassword={setForgotPassword} />
            ""
          ) : (
            <Login setForgotPassword={setForgotPassword} />
          )}
        </div>
      </div>
    </>
  );
}
