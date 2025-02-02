import React, { useState, useEffect, useContext } from "react";
import { MyContext } from "../../App";
import { useNavigate, Link } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";


function Navbar() {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [user, setUser] = useState([])

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (!user) {
    } else {
      const parsedUser = JSON.parse(user);
      setUser(parsedUser.email.charAt(0).toUpperCase())
    }
  }, [navigate]);

  const handleLogout = () => {
    window.location.reload();
    sessionStorage.clear();
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };


  return (
    <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200 shadow-md">
      <div className="flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-orange-500">บ้านนายดิน</span>
        </Link>

        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {context.isLogin != false ? (
            <>
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold text-lg">
                {user}
              </div>
              <button
                onClick={handleLogout}
                className="bg-black hover:bg-orange-500 cursor-pointer text-white  w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold ml-1"
              >
                <IoMdLogOut />
              </button>
            </>
          ) : (
            <button
              type="button"
              className="text-white bg-orange-500 hover:bg-orange-500 font-medium rounded-lg text-sm px-4 py-2 text-center cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-black rounded-lg 2xl:hidden cursor-pointer"
            onClick={() => context.setIsOpen(!context.isOpen)}
          >
           
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        
      </div>
    </nav>
  );
}

export default Navbar;
