import Pagination from '@mui/material/Pagination';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useContext } from "react";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
} from "react-icons/bs";
import { fetchDataFromApi, deleteData } from "../../utils/api";
import { FaShoppingBasket } from "react-icons/fa";
import { MyContext } from '../../App';


function Home() {
  const [totalpage, setTotalpage] = useState();
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const navigate = useNavigate()
  const context = useContext(MyContext)

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const userData = JSON.parse(sessionStorage.getItem("user"));
      context.setUser(userData);
      context.setIsLogin(true);
    } else {
      navigate("/login")
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
      
        const [productsData, ordersData, usersData] = await Promise.all([
          fetchDataFromApi('/api/products/'),
          fetchDataFromApi('/api/order/'),
          fetchDataFromApi('/api/user/'),
        ]);

        setProducts(productsData.data);
        setTotalpage(productsData.pagination.totalPages);
        setTotalProducts(productsData.pagination.totalProducts);
        setTotalOrders(ordersData.totalOrders);
        setTotalUsers(usersData.count);
      } catch (err) {
       
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Error fetching data",
        });
      } 
    };

    fetchAllData();
  }, []);

  const handleChange = (event, value) => {
    fetchDataFromApi(`/api/products?page=${value}`).then((res) => {
      setProducts(res.data);
    });
  };

  const handleDelete = async (id) => {
    try {
      deleteData(`/api/products/${id}`).then((res) => {
        context.setAlertBox({
          open: true,
          error: false,
          msg: "Product Deleted",
        });
      })

      setTimeout(() => {
        window.location.reload();
      }, 500)
    } catch (error) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Error deleting product",
      });
     
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen mt-20">
      <div className="p-10 flex flex-col w-full max-w-6xl">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          <div className="bg-white shadow-lg p-5 rounded-md flex flex-col items-center w-full">
            <div className="flex justify-between items-center w-full">
              <h3 className="text-lg font-semibold">PRODUCTS</h3>
              <BsFillArchiveFill className="text-2xl text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold mt-4">{totalProducts}</h1>
          </div>
          <div className="bg-white shadow-lg p-5 rounded-md flex flex-col items-center w-full">
            <div className="flex justify-between items-center w-full">
              <h3 className="text-lg font-semibold">CATEGORIES</h3>
              <BsFillGrid3X3GapFill className="text-2xl text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold mt-4">12</h1>
          </div>
          <div className="bg-white shadow-lg p-5 rounded-md flex flex-col items-center w-full">
            <div className="flex justify-between items-center w-full">
              <h3 className="text-lg font-semibold">USERS</h3>
              <BsPeopleFill className="text-2xl text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold mt-4">{totalUsers}</h1>
          </div>
          <div className="bg-white shadow-lg p-5 rounded-md flex flex-col items-center w-full">
            <div className="flex justify-between items-center w-full">
              <h3 className="text-lg font-semibold">ORDERS</h3>
              <FaShoppingBasket className="text-2xl text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold mt-4">{totalOrders}</h1>
          </div>
        </div>

     
        {products && products.length > 0 ? (
          <div className="relative overflow-x-auto shadow-[0_2px_12px_-3px_rgba(61,63,68,0.3)] sm:rounded-lg">

            <table className="w-full text-sm text-left text-black">
              <thead className="text-xs text-black uppercase bg-gray-200">
                <tr>
                  <th className="px-6 py-3">Image</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Author</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>

                {products.map((product, index) => (
                  <tr key={index} className="bg-white hover:bg-gray-100 text-black">
                    <td className="px-6 py-4">
                      <img
                        src={import.meta.env.VITE_API_URL + product.image}
                        alt={product.name}
                        className="w-15 h-20 object-cover"
                      />
                    </td>
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">{product.description.substring(0, 20)}...</td>
                    <td className="px-6 py-4">{product.author}</td>
                    <td className="px-6 py-4">{product.price}</td>
                    <td className="px-6 py-4">{product.category}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2 text-white">
                        <Link to={`/productdetail/${product.id}`} className="bg-blue-600 px-3 py-1 rounded-md hover:bg-blue-700 cursor-pointer">
                          Read
                        </Link>
                        <Link to={`/updateproduct/${product.id}`} className="bg-yellow-600 px-3 py-1 rounded-md hover:bg-yellow-700 cursor-pointer">
                          Update
                        </Link>
                        <button onClick={() => handleDelete(product.id)} className="bg-red-600 px-3 py-1 rounded-md hover:bg-red-700 cursor-pointer">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <h3 className="text-xl font-semibold mt-4">No Product Found</h3>

          </div>

        )}
        <div className="flex justify-center">

          <Pagination
            count={totalpage}
            color="primary"
            onChange={handleChange}
            className="mt-4"

          />
        </div>
      </div>
    </div >

  );
}

export default Home;
