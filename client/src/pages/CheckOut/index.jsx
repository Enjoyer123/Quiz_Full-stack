import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDataFromApi, postDataCart } from "../../utils/api";
import { v4 as uuidv4 } from 'uuid';
import { MyContext } from "../../App";



const Checkout = () => {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState();
  const navigate = useNavigate();
  const context = useContext(MyContext)
  
  
const handlePurchase = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const payload = {
    name: user.name,
    address: phone + address,
    amount: totalAmount,
    paymentId: `PAY-${uuidv4()}`,
    email: user.email,
    userid: user.id,
    products: cartItems,
  };

  if (payload) {
    postDataCart("/api/order/create", payload).then((res)=>{
      navigate('/')
    })
  } else {
    context.setAlertBox({
      open: true,
      error: true,
      msg: "No order payload found in sessionStorage",
    });
   
  }
};


  useEffect(() => {
    window.scrollTo(0, 0);
    const user = JSON.parse(sessionStorage.getItem("user"));
    fetchDataFromApi(`/api/cart?userId=${user?.id}`).then((res) => {
      setCartItems(res.data);
      setTotalAmount(res.total);
    });
  }, []);

  

  return (
    <div className="flex flex-col justify-center items-center min-h-screen mt-14 px-4">
      <div className="w-full max-w-2xl md:max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-[1px_0px_13px_2px_rgba(0,_0,_0,_0.1)]">
        <h2 className="text-3xl font-semibold text-center ">Checkout</h2>
        <div className="p-4 flex flex-col w-full">
          <h3 className="text-xl font-semibold">Order Summary</h3>
          <p className="text-lg font-bold text-orange-500 mt-2">
            Total: ${totalAmount}
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black">Name</label>
            <input
              type="text"
              className="w-full border rounded-lg p-3 text-black"
              value={context.user?.name || ""}
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Address</label>
            <textarea
              className="w-full border rounded-lg p-3 text-black"
              rows="4"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Phone Number</label>
            <input
              type="text"
              className="w-full border rounded-lg p-3 text-black"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </form>

        <button
          onClick={handlePurchase}
          className="w-full bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-black mt-6 cursor-pointer"
        >
          Confirm Purchase
        </button>
      </div>
    </div>

  );
};

export default Checkout;
