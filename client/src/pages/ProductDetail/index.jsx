import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import QuantityBox from "../../components/QuantityBox";
import { fetchDataFromApi } from "../../utils/api";

const ProductDetail = () => {
  const { id } = useParams(); 
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const context = useContext(MyContext);

  let [cartFields, setCartFields] = useState({});
  let [productQuantity, setProductQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        fetchDataFromApi(`/api/products/${id}`).then((res)=>{
          setBooks(res);

        })
        
      } catch (err) {
        setError(err.message);
      }
      
    };

    fetchProduct();
  }, [id]);

  const quantity = (val) => {
    setProductQuantity(val);
  };

  const addtoCart = () => {
    const token = sessionStorage.getItem("token");
    if (token !== "" && token !== undefined && token !== null) {
      const user = JSON.parse(sessionStorage.getItem("user"));

      cartFields.productTitle = books?.name;
      cartFields.image = books?.image;
      cartFields.price = books?.price;
      cartFields.quantity = productQuantity;
      cartFields.subTotal = parseInt(books?.price * productQuantity);
      cartFields.productId = books?.id;
      cartFields.categoryName = books?.category;
      cartFields.userId = user?.id;

      context.addtoCart(cartFields);
    } else {
      navigate("/login");
    }
  };

  return (

    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="p-4 flex flex-col w-full max-w-5xl bg-white shadow-md">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/2 px-4">

            <img
              id="mainImage"
              src={import.meta.env.VITE_API_URL + books.image}
              alt={books.name}
              className="w-full h-auto rounded-lg shadow-md"
            />

          </div>


          <div className="w-full md:w-1/2 px-4 pt-10 ">
            <h2 className="text-3xl font-bold mb-2 font-serif">{books.name}</h2>
            <p className="text-gray-600 mb-4">Author: {books.author}</p>
            <p className="text-gray-600 mb-4">Tags: {books.category}</p>

            <p className="text-gray-600 mb-4">{books.description}</p>

            <div className="mb-4">
              <span className="text-2xl font-bold mr-2">${books.price}</span>
            </div>

            <div className="mb-4">
              <QuantityBox quantity={quantity} item={books} />
            </div>
            <button
              className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-black cursor-pointer"
              onClick={addtoCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ProductDetail;
