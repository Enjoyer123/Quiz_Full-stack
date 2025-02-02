import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App"
import { postDataSignIn } from "../../utils/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const context = useContext(MyContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      postDataSignIn("/api/user/signin", {
        email,
        password,
        isAdmin: false
      }).then((res) => {

        if (res.error !== true) {
          sessionStorage.setItem("token", res.token);
          if (res.user?.name) {

            sessionStorage.removeItem("user");
            sessionStorage.setItem("user", JSON.stringify(res.user));

            context.setAlertBox({
              open: true,
              error: false,
              msg: "Logout Success"
            });

            setTimeout(() => {
              context.setisLogin(true);

              window.location.href = "/";
            }, 100);
          } else {
            
            context.setAlertBox({
              open: true,
              error: true,
              msg: "Login failed",
            });
          }
        }
      })


    } catch (error) {

      context.setAlertBox({
        open: true,
        error: true,
        msg: "Error during login",
      });

    }
  };

  const SignUp = () => {
    navigate('/signUp');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white shadow-[0px_0px_18px_2px_rgba(0,_0,_0,_0.1)] rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-black mb-6">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-black transition duration-200 cursor-pointer"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-orange-500 hover:underline font-medium"
              onClick={SignUp}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;