import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import ProductDetail from "./pages/ProductDetail"
import { fetchDataFromApi, postDataCart } from "./utils/api";
import Checkout from "./pages/CheckOut";
import Orders from "./pages/Order";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const MyContext = createContext();

function App() {

  const [isLogin, setisLogin] = useState(false)
  const [cartData, setCartData] = useState([]);
  const [alertBox, setAlertBox] = useState({
    msg: "",
    error: false,
    open: false,
  });
  const [user, setUser] = useState({
    name: "",
    email: "",
    userId: "",
  });
  const [isHideSidebarAndHeader, setisHideSidebarAndHeader] = useState(false);
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token !== "" && token !== undefined && token !== null) {
      const userData = JSON.parse(sessionStorage.getItem("user"));
      setUser(userData);
      setisLogin(true)
    }
  }, []);

  const getCartData = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    fetchDataFromApi(`/api/cart?userId=${user?.id}`).then((res) => {
      setCartData(res.books);
    });
  };

  const addtoCart = (data) => {
    if (isLogin) {
      postDataCart(`/api/cart/add`, data).then((res) => {
        if (res.status !== false) {
          setAlertBox({
            open: true,
            error: false,
            msg: "Item is added in the cart",
          });



          getCartData();
        } else {
          setAlertBox({
            open: true,
            error: true,
            msg: "Product already added in the cart",
          });
         
        }
      });
    }
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: '#FF6900',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  const values = {
    isHideSidebarAndHeader,
    setisHideSidebarAndHeader,
    cartData,
    setCartData,
    addtoCart,
    getCartData,
    isLogin,
    setisLogin,
    setUser,
    user,
    alertBox,
    setAlertBox,
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertBox({
      open: false,
    });
  };


  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
      <Snackbar
            open={alertBox.open}
            autoHideDuration={6000}
            onClose={handleClose}
            className="snackbar"
          >
            <Alert
              onClose={handleClose}
              severity={alertBox.error === false ? "success" : "error"}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {alertBox.msg}
            </Alert>
          </Snackbar>
        <ThemeProvider theme={theme}>
          <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signUp" element={<SignUp />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order" element={<Orders />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </MyContext.Provider>
    </BrowserRouter>
  )
}
export { MyContext };

export default App;