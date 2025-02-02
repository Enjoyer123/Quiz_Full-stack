import React, { useState, useEffect, useContext } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { MyContext } from "../../App";
import { useNavigate, Link } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import { FaShoppingBasket } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

function Navbar() {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [user, setUser] = useState([])
  const [menuOpen, setMenuOpen] = useState(false);

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
         
        </div>
        <div className={`items-center justify-between ${menuOpen ? "flex" : "hidden"} w-full md:flex md:w-auto md:order-1`} id="navbar-sticky">
          <ul className="w-full flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-white md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
            <li>
              <Link
                to="/"
                className="block py-2 px-3 text-black rounded-sm hover:bg-orange-500 hover:text-white transition-all md:hover:bg-transparent md:hover:text-orange-500 md:p-0"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/order"
                className="flex items-center gap-2 py-2 px-3 text-black rounded-sm hover:bg-orange-500 hover:text-white transition-all md:hover:bg-transparent md:hover:text-orange-500 md:p-0"
              >
                <FaShoppingBasket />
                Order
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="flex items-center gap-2 py-2 px-3 text-black rounded-sm hover:bg-orange-500 hover:text-white transition-all md:hover:bg-transparent md:hover:text-orange-500 md:p-0"
              >
                <FaShoppingCart />
                Cart
              </Link>
            </li>
            <li>
              <Link
                to="https://github.com/Enjoyer123"
                className="flex items-center gap-2 py-2 px-3 text-black rounded-sm hover:bg-orange-500 hover:text-white transition-all md:hover:bg-transparent md:hover:text-orange-500 md:p-0"
              >
                <FaGithub />
                GitHub
              </Link>
            </li>
          </ul>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
