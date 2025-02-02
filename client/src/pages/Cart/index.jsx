import { FaRegTrashAlt } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { editData, fetchDataFromApi, deleteData } from "../../utils/api";
import { useNavigate, Link } from "react-router-dom";
import QuantityBox from "../../components/QuantityBox";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useNavigate();
  const [cartFields, setCartFields] = useState({});
  const [productQuantity, setProductQuantity] = useState();
  const [chengeQuantity, setchengeQuantity] = useState(0);
  const [totalDiscount, settotalDiscount] = useState(0)
  const [total, settotal] = useState(0)
  const [totalBasePrice, settotalBasePrice] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0);
    const token = sessionStorage.getItem("token");
    
    if (!token) {
      history("/login");
      return;
    }
  
    const fetchCartItems = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        fetchDataFromApi(`/api/cart?userId=${user?.id}`).then((res) => {
      
        setCartItems(res.data);
        settotalDiscount(res.totalDiscount);
        settotal(res.total);
        settotalBasePrice(res.totalBasePrice);
        });
      } catch (err) {
        setError("Failed to load cart items");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCartItems();
  }, []);
  

  const selectedItem = (item, quantityVal) => {

    if (chengeQuantity !== 0) {
      const user = JSON.parse(sessionStorage.getItem("user"));
      cartFields.productTitle = item?.productTitle
      cartFields.image = item?.image
      cartFields.price = item?.price
      cartFields.quantity = quantityVal
      cartFields.subTotal = parseInt(item?.price * quantityVal)
      cartFields.productId = item?.productId
      cartFields.categoryName = item?.categoryName
      cartFields.userId = user?.id

      editData(`/api/cart/${item?._id}`, cartFields).then((res) => {
        setTimeout(() => {

          const user = JSON.parse(sessionStorage.getItem("user"));
          fetchDataFromApi(`/api/cart?userId=${user?.id}`).then((res) => {
            setCartItems(res.data);
            settotalDiscount(res.totalDiscount)
            settotal(res.total)
            settotalBasePrice(res.totalBasePrice)
          
          })
        }, 1)
      })
    }

  }

  const removeItem = (id) => {
    deleteData(`/api/cart/${id}`).then(() => {
      fetchCartItems();
      window.location.reload()
    });
  };

  const quantity = (val) => {
    setProductQuantity(val);
    setchengeQuantity(val)
  }
  
  const fetchCartItems = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const response = await fetchDataFromApi(`/api/cart?userId=${user?.id}`);
    setCartItems(response.data);
    settotalDiscount(response.totalDiscount);
    settotal(response.total);
    settotalBasePrice(response.totalBasePrice);
  };



  return (
    <div className="font-sans max-w-4xl max-md:max-w-xl mx-auto p-4 mt-22">
      <h1 className="text-2xl font-bold text-black">Your Cart</h1>
      {cartItems.length > 0 ? (

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 bg-white px-4 py-6 rounded-md shadow-[0_2px_12px_-3px_rgba(61,63,68,0.3)]">
                <div className="flex gap-4">
                  <div className="w-28 h-28 max-sm:w-24 max-sm:h-24 shrink-0">
                    <img src={import.meta.env.VITE_API_URL + item.image} className="w-full h-full object-contain" alt={item.productTitle} />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <Link to={`/product/${item.productId}`}>
                      <h3 className="text-sm sm:text-base font-bold text-black hover:text-orange-500">{item.productTitle}</h3>
                    </Link>
                      <p className="text-sm text-black mt-2 flex items-center gap-2">
                        Tags: {item.categoryName}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center gap-3">
                      <QuantityBox quantity={quantity} item={item} selectedItem={selectedItem} value={item?.quantity} />
                    </div>
                  </div>
                </div>
                <div className="ml-auto flex flex-col">
                  <div className="flex items-start gap-4 justify-end">
                    <span
                      className="cursor-pointer text-orange-500 hover:text-black"
                      onClick={() => removeItem(item.id)}
                    >
                      <FaRegTrashAlt />

                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="bg-white shadow-md p-4 rounded-lg ">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-bold text-xl text-black">฿{totalBasePrice.toFixed(2)}</span>
              </div>
            </div>
            <div className="bg-white shadow-md p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Discount</span>
                <span className="font-bold text-xl text-orange-500">฿{totalDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-semibold text-lg">Final Total</span>
                <span className="font-bold text-xl text-black">฿{total.toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout">
              <button className="w-full bg-orange-500 text-white py-3 rounded-md mt-4 hover:bg-black cursor-pointer">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>)
        : (
          <div className="flex flex-col items-center justify-center py-12">
            <h3 className="text-xl font-semibold mt-4">Your Cart is currently empty</h3>
            <Link to="/">
              <button className="bg-orangr-500 text-orange-500 cursor-pointer px-6 py-3 rounded-full mt-6">Continue Shopping</button>
            </Link>
          </div>
        )}
    </div>


  );
};

export default Cart;
