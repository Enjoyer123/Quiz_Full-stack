import React, { useState, createContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Home from "./pages/Home";
import SignUp from "./pages/Signup";
import LogIn from "./pages/Login";
import AddProduct from "./pages/Product/AddProduct";
import UpdateProduct from "./pages/Product/UpdateProduct";
import Orders from "./pages/Order";
import ProductDetail from "./pages/Product/ProductDetail";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Footer from "./components/Footer"
const MyContext = createContext();

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    userId: "",
  });
  const [alertBox, setAlertBox] = useState({
    msg: "",
    error: false,
    open: false,
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const userData = JSON.parse(sessionStorage.getItem("user"));
      setUser(userData);
      setIsLogin(true);
    }
  }, []);

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
    isLogin,
    setIsLogin,
    isOpen,
    setIsOpen,
    setUser,
    user,
    alertBox,
    setAlertBox
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
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={alertBox.error === false ? "success" : "error"}
            variant="filled"
          >
            {alertBox.msg}
          </Alert>
        </Snackbar>

        <ThemeProvider theme={theme}>
          <div className="flex flex-col min-h-screen bg-gray-50">

            {
            isLogin && <Header />
            }
            {
            isLogin && <Sidebar />
            
            }

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/addproduct" element={<AddProduct />} />
              <Route path="/updateproduct/:id" element={<UpdateProduct />} />
              <Route path="/productdetail/:id" element={<ProductDetail />} />
              <Route path="/order" element={<Orders />} />
            </Routes>

            {
            isLogin &&  <Footer />
            
            }
           
          </div>
        </ThemeProvider>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export { MyContext };
export default App;
