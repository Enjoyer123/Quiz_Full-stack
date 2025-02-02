import React, { useEffect, useState } from 'react';
import { fetchDataFromApi } from '../../utils/api';
import Dialog from '@mui/material/Dialog';
import { MdClose } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const history = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);

        const token = sessionStorage.getItem("token");
        if (!token) {
            history("/login");
        }

        const user = JSON.parse(sessionStorage.getItem("user"));
        fetchDataFromApi(`/api/order/pending/?userid=${user?.id}`).then((res) => {
            setOrders(res.orders);
        });
    }, []);

    const showProducts = (id) => {
        fetchDataFromApi(`/api/order/${id}`).then((res) => {
            setIsOpenModal(true);
            setProducts(res.products);
        });
    };

    return (
        <>
            <section className="flex flex-col items-center min-h-screen mt-22">

                <div className="p-4 flex flex-col w-full max-w-4xl">
                    <h2 className="text-2xl font-bold mb-6">Orders</h2>

                    {orders.length > 0 ? (
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left text-black">
                                <thead className="text-xs text-black uppercase bg-gray-200">
                                    <tr>
                                        <th className="px-6 py-3">Payment Id</th>
                                        <th className="px-6 py-3">Products</th>
                                        <th className="px-6 py-3">Name</th>

                                        <th className="px-6 py-3">Total Amount</th>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Order Status</th>
                                        <th className="px-6 py-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, index) => (
                                        <tr key={index} className="bg-white hover:bg-gray-50 text-black">
                                            <td className="px-6 py-4 font-semibold">{order?.paymentId}</td>
                                            <td className="px-6 py-4 underline cursor-pointer text-orange-500" onClick={() => showProducts(order?._id)}>View</td>
                                            <td className="px-6 py-4">{order?.name}</td>

                                            <td className="px-6 py-4">{order?.amount}</td>
                                            <td className="px-6 py-4">{order?.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`py-1 px-3 rounded-full text-xs ${order?.status === "pending" ? "bg-orange-500 text-white" : "bg-green-500 text-white"}`}>{order?.status}</span>
                                            </td>
                                            <td className="px-6 py-4">{new Date(order?.date).toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Bangkok" })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <h3 className="text-xl font-semibold mt-4">Your Order is currently empty</h3>
                            <Link to="/">
                                <button className="bg-orangr-500 text-orange-500 cursor-pointer px-6 py-3 rounded-full mt-6">Continue Shopping</button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>
            <Dialog open={isOpenModal} onClose={() => setIsOpenModal(false)} className="flex items-center justify-center">
                <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
                    <button
                        className="absolute top-4 right-4 p-2 rounded-full bg-black text-white hover:bg-orange-500 transition-all cursor-pointer"
                        onClick={() => setIsOpenModal(false)}
                    >
                        <MdClose size={24} />
                    </button>



                    <div className="mt-10 overflow-x-auto shadow-md rounded-lg border border-gray-200">
                        <table className="min-w-full table-auto bg-white">
                            <thead className="bg-gray-200 text-black">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">Product Id</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">Product Title</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">Image</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">Quantity</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">Price</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">SubTotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products?.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-2">{item?.productId?.substr(0, 6) + '...'}</td>
                                        <td className="px-4 py-2">{item?.productTitle}</td>
                                        <td className="px-4 py-2">
                                            <img src={import.meta.env.VITE_API_URL + item?.image} alt={item?.productTitle} className="w-16 h-16 object-cover rounded" />
                                        </td>
                                        <td className="px-4 py-2">{item?.quantity}</td>
                                        <td className="px-4 py-2">{item?.price}</td>
                                        <td className="px-4 py-2">{item?.subTotal}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default Orders;

