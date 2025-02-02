import React, { useEffect, useState, useContext } from 'react';
import { fetchDataFromApi, editData } from '../../utils/api';
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog';
import { MdClose } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [totalpage, setTotalPage] = useState(1);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const context = useContext(MyContext)
    const history = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);

        const token = sessionStorage.getItem("token");
        if (token !== "" && token !== undefined && token !== null) {
            context.setIsLogin(true);
        } else {
            history("/login");
        }

        const user = JSON.parse(sessionStorage.getItem("user"));

        fetchDataFromApi(`/api/order/`).then((res) => {
            setOrders(res.orders || []);
            setTotalPage(res.totalPages)
        });
    }, []);

    const showProducts = (id) => {
        fetchDataFromApi(`/api/order/${id}`).then((res) => {
            setIsOpenModal(true);
            setProducts(res.products);
        });
    };

    const handleChange = (event, value) => {

        fetchDataFromApi(`/api/order?page=${value}`).then((res) => {
            setOrders(res.orders);

        })
    }

    const orderStatus = (newStatus, id) => {
        fetchDataFromApi(`/api/order/${id}`).then((res) => {
            const updatedOrder = {
                ...res,
                status: newStatus
            };
            editData(`/api/order/${id}`, updatedOrder).then(() => {
                fetchDataFromApi(`/api/order/`).then((res) => {
                    setOrders(res.orders);
                });
            });


        });
    };


    return (
        <>
            <section className="flex flex-col items-center min-h-screen mt-22">

                <div className="p-4 flex flex-col w-full max-w-6xl">
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
                                            <td className="px-4 py-2">
                                                {order?.status === "pending" ? (
                                                    <span
                                                        className="py-1 px-3 rounded-full text-xs cursor-pointer bg-red-500 text-white hover:bg-red-400"
                                                        onClick={() => orderStatus("confirm", order?._id)}
                                                    >
                                                        {order?.status}
                                                    </span>
                                                ) : (
                                                    <span
                                                        className="py-1 px-3 rounded-full text-xs cursor-pointer bg-green-500 text-white hover:bg-greed-500"
                                                        onClick={() => orderStatus("pending", order?._id)}
                                                    >
                                                        {order?.status}
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4">{new Date(order?.date).toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Bangkok" })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <h3 className="text-xl font-semibold mt-4">Order is currently empty</h3>

                        </div>
                    )}
                </div>


                {orders && orders.length > 0 && (
                    <div className="flex justify-center">
                        <Pagination
                            count={totalpage}
                            color="primary"
                            onChange={handleChange}
                            className="mt-4"
                        />
                    </div>
                )}





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
                                            <img src={import.meta.env.VITE_API_URL + item.image} alt={item?.productTitle} className="w-16 h-20 object-cover" />
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
