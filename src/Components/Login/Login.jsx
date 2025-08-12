import React, { useEffect, useState } from "react";
import secure from "../../assets/secure.png";
import user from "../../assets/user.png";
import data from "../../assets/Data.png";
import master from "../../assets/master.png";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import { login } from "../../API/Login/Login";
import { MdEmail } from "react-icons/md";
import { MdLock } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { getClientDetailsById } from "../../API/UserManagement/Client/ClientDetails";

const validationSchema = Yup.object().shape({
  email_id: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address format"
    )
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
 // passkey: Yup.string().required("Pass Key is required"),
});

export default function ClientLogin({ setAuthtoken, setSelectedModule, clientData, setClientData }) {
  // Get user type from URL
  const location = useLocation();
  const userType = location?.pathname?.split("/")[1]?.trim() || "pro";
  const [rememberMe, setRememberMe] = useState(false);
  const LoginUserId = useSelector((state) => state.auth.LoginUserId);
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { clientId } = useParams();
  const [isActivated, setIsActivated] = useState();
  const [loading, setLoading] = useState(true);
  const [passkey, setPasskey] = useState("");

  console.log("Client ID from path:", clientId);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  console.log(LoginUserId, "LoginUserId");

  const handleSubmit = async (values) => {
    try {
      const result = await login(userType, values);
      toast.success(result.message);
      let id;
      if (result) {
        const token = result?.token;
        id = result?.pro_id || result?.client_id || result?.emp_id;

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("LoginUserId", id);

        setAuthtoken(token); // ✅ set state before navigating

        console.log("LoginUserId from payload:", result);
      }
      if (id?.startsWith("PRO")) {
        navigation("/usermanagement");
        window.location.reload();
      } 
    } catch (error) {
      toast.error(error?.response?.data?.error);
      console.error("Unexpected error during login:", error);
    }
  };

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const res = await getClientDetailsById(clientId, setClientData);
        console.log(res, "res");
        setIsActivated(res?.company?.req_status_id);
        sessionStorage.setItem("status", res?.company?.req_status);
        setPasskey(res?.company?.activate_Key);
      } catch (err) {
        console.error("Status check failed", err);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchClientDetails();
    } else {
      setLoading(false);
    }
  }, [clientId]);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-2xl flex min-h-screen w-full overflow-hidden">
          {/* Left side */}
          <div className="flex flex-1 flex-col items-center py-12 px-[9vw] bg-[#101225] rounded-r-[2vw]">
            <h1 className="text-white text-[2vw] font-bold mb-[5vh]">
              E - SMART
            </h1>
            <div className="flex items-center justify-center bg-white mt-[12vh] rounded-[2vw] py-[1vw] w-[40vw] mb-[3vh]">
              <span className="text-[1.5vw] font-semibold">
                Welcome To Accounts Management !
              </span>
            </div>
            <p className="text-gray-300 text-center text-[1.35vw] text-base mb-10 w-[32vw]">
              Streamline your financial operations with our secure, intuitive
              platform.
            </p>
            <div className="flex items-center justify-center w-full mt-[10vh] ml-[4vw]">
              <div className="grid grid-cols-2 gap-y-[3vw] w-full mx-auto">
                <div className="flex gap-3">
                  <span>
                    <img src={secure} className="h-[3.5vw] w-[3.5vw]" />
                  </span>
                  <div>
                    <div className="text-white text-[1.2vw]">Secure Access</div>
                    <div className="text-gray-400 text-[1vw]">
                      Enterprise-grade Security
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span>
                    <img src={user} className="h-[3.5vw] w-[3.5vw]" />
                  </span>
                  <div>
                    <div className="text-white text-[1.2vw]">
                      User Management
                    </div>
                    <div className="text-gray-400 text-[1vw]">
                      Role-based Permissions
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span>
                    <img src={master} className="h-[3.5vw] w-[3.5vw]" />
                  </span>
                  <div>
                    <div className="text-white text-[1.2vw]">Master Setup</div>
                    <div className="text-gray-400 text-[1vw]">
                      Customizable Workflow
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span>
                    <img src={data} className="h-[3.5vw] w-[3.5vw]" />
                  </span>
                  <div>
                    <div className="text-white text-[1.2vw]">
                      Data Analytics
                    </div>
                    <div className="text-gray-400 text-[1vw]">
                      Real-time insights
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right side */}
          <div className="bg-white flex w-full flex-col justify-center items-center px-8 py-12">
            <h2 className="text-gray-900 text-[1.5vw] font-bold mb-[2vw] text-center">
              SIGN IN
            </h2>
            <p className="text-gray-600 mb-[2vw] text-center text-[1vw]">
              Sign in to start your journey with E-SMART
            </p>
            {/* <div className="flex flex-col gap-[1vw]">
              <button
                className="flex text-[1.1vw] text-[#4C67ED] items-center justify-center w-[24vw] h-[3.5vw] border border-[#4C67ED] rounded-full hover:bg-gray-100 transition mb-1"
                type="button"
              >
                <img
                  className="h-[1.5vw] w-[1.5vw] mr-2"
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="google"
                />
                Sign in with Google
              </button>
              <button
                className="flex text-[1.1vw] text-[#4C67ED] items-center justify-center w-[24vw] h-[3.5vw] border border-[#4C67ED] rounded-full hover:bg-gray-100 transition"
                type="button"
              >
                <img
                  className="h-[2vw] w-[2vw] mr-[1vw]"
                  src={apple}
                  alt="apple"
                />
                Sign in with Apple
              </button>
            </div>
            <div className="flex items-center my-[2vw]">
              <hr className="flex-1 w-[5vw] border-gray-400" />
              <span className="mx-2 text-[1vw] text-[#323232]">
                or continue with
              </span>
              <hr className="flex-1 w-[5vw] border-gray-600" />
            </div> */}
            <div>
              <Formik
                initialValues={{
                  email_id: localStorage.getItem("rememberedEmail") || "",
                  password: localStorage.getItem("rememberedPassword") || "",
                  passkey: "" || passkey,
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  handleSubmit(values, {
                    // setSubmitting,
                    // setFieldError,
                    // setAuthtoken,
                  });
                  if (rememberMe) {
                    localStorage.setItem("rememberedEmail", values.email_id);
                    localStorage.setItem("rememberedPassword", values.password);
                  } else {
                    localStorage.removeItem("rememberedEmail");
                    localStorage.removeItem("rememberedPassword");
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-[1.5vw] relative">
                      <span className="absolute left-[0.5vw] bg-[#3232324D] rounded-full p-[0.6vw] top-1/2 transform -translate-y-1/2">
                        <MdEmail color="#FFFFFF" size={"1.5vw"} />
                      </span>
                      <Field
                        name="email_id"
                        className="pr-[3vw] rounded-full placeholder-blue border-[0.1vw] border-[#C2C2C2] text-[1vw] h-[3.5vw] w-[25vw] outline-none pl-[4vw]"
                        type="text"
                        placeholder="Email Address"
                      />
                      <ErrorMessage
                        name="email_id"
                        component="div"
                        className="text-red-600 text-[0.8vw] absolute left-[1vw]"
                      />
                    </div>
                    <div className="mb-[1.5vw] relative">
                      <span className="absolute left-[0.3vw] bg-[#3232324D] rounded-full p-[0.6vw] top-1/2 transform -translate-y-1/2">
                        <MdLock color="#FFFFFF" size={"1.5vw"} />
                      </span>
                      <Field
                        className="pr-[3vw] rounded-full placeholder-blue border-[0.1vw] border-[#C2C2C2] text-[1vw] h-[3.5vw] w-[25vw] outline-none pl-[4vw]"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                      />
                      <div
                        className="absolute right-[1vw] bottom-[1vw] cursor-pointer"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <FaEye className="text-[1.5vw] " />
                        ) : (
                          <FaEyeSlash className="text-[1.5vw] " />
                        )}
                      </div>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-600 text-[0.8vw] absolute left-[1vw]"
                      />
                    </div>
                    {isActivated === 4 && (
                      <div className="mb-[1.5vw] relative">
                        <span className="absolute left-[0.5vw] bg-[#3232324D] rounded-full p-[0.6vw] top-1/2 transform -translate-y-1/2">
                          <MdEmail color="#FFFFFF" size={"1.5vw"} />
                        </span>
                        <Field
                          name="passkey"
                          className="pr-[3vw] rounded-full placeholder-blue border-[0.1vw] border-[#C2C2C2] text-[1vw] h-[3.5vw] w-[25vw] outline-none pl-[4vw]"
                          type="text"
                          placeholder="Pass Key"
                        />
                        <ErrorMessage
                          name="passkey"
                          component="div"
                          className="text-red-600 text-[0.8vw] absolute left-[1vw]"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <label className="flex items-center text-[1vw]">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={() => setRememberMe(!rememberMe)}
                          className="mr-2 h-[1vw] w-[1vw] cursor-pointer"
                        />
                        Remember me
                      </label>
                      <a href="#" className="text-[1vw] hover:underline">
                        Forgot Password?
                      </a>
                    </div>
                    <button
                      className="flex mt-[4vw] cursor-pointer text-[1.3vw] font-medium bg-[#4C67ED] text-white items-center justify-center w-[25vw] h-[3.5vw] border border-[#4C67ED] rounded-full"
                      type="submit"
                    >
                      GET STARTED
                    </button>
                  </Form>
                )}
              </Formik>
              {/* <p className="text-center text-[1vw] text-gray-700 mt-6">
                Don’t have an account yet?{" "}
                <a
                  href="#"
                  className="text-red-600 font-semibold hover:underline"
                >
                  Sign Up
                </a>
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
