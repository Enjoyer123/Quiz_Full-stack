import React, { useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {

    BsGrid1X2Fill,
    BsFillArchiveFill,

} from "react-icons/bs";
import { MyContext } from "../../App"
import { FaShoppingBasket } from "react-icons/fa";


function Sidebar() {
    const context = useContext(MyContext)
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <>
            <aside className={`bg-black text-white w-64 h-full fixed top-0 left-0 z-40 transform ${context.isOpen ? "translate-x-0" : "-translate-x-full"} 2xl:translate-x-0 transition-transform duration-300 ease-in-out lg:flex flex-col`}>
                <div className="flex justify-between items-center px-6 py-4">
                    <div className="text-white text-lg font-bold flex items-center gap-2 mb-10">
                        บ้านนายดิน
                    </div>
                </div>

                <ul className="list-none p-0">
                    <li className="hover:bg-white/20 cursor-pointer text-white text-lg">
                        <Link to="/" className="flex items-center gap-4 px-6 py-4">
                            <BsGrid1X2Fill className="text-xl" /> Dashboard
                        </Link>
                    </li>
                    <li className="hover:bg-white/20 cursor-pointer text-white text-lg">
                        <Link to="/addproduct" className="flex items-center gap-4 px-6 py-4">
                            <BsFillArchiveFill className="text-xl" /> Add Products
                        </Link>
                    </li>
                    <li className="hover:bg-white/20 cursor-pointer text-white text-lg">
                        <Link to="/order" className="flex items-center gap-4 px-6 py-4">
                            <FaShoppingBasket className="text-xl" /> Order
                        </Link>
                    </li>
                </ul>
            </aside>
        </>
    );
}

export default Sidebar;


