import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { fetchDataFromApi, postData } from "../../utils/api";
import { useParams } from "react-router-dom";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";



const UpdateProduct = () => {

  let { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    author: "",
    price: "",
    category: "",
    image: ""
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
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
    const fetchData = async () => {
      try {
        fetchDataFromApi(`/api/products/${id}`).then((res) => {

          setFormData({
            name: res.name,
            description: res.description,
            author: res.author,
            price: res.price,
            category: res.category,

          });
          setImage(res.image)
        })


      } catch (error) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Error fetching product data",
        });


      }
    };


    fetchData();

  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("author", formData.author);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("category", formData.category);
    if (image) {
      formDataToSend.append("image", image);
    }

    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      context.setAlertBox({
        open: true,
        error: false,
        msg: "Product Updated",
      });
      setTimeout(() => {
        navigate("/")
      })

    } catch (error) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Error updating product",
      });

    }
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
  
    
    if (selectedImage && (selectedImage.type === "image/png" || selectedImage.type === "image/jpeg")) {
      setImage(selectedImage);
      const previewUrl = URL.createObjectURL(selectedImage);
      setImagePreview(previewUrl);
    } else {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Only png , jpg",
      });
    }
  };


  return (

    <div className="mt-10 flex flex-col items-center min-h-screen py-10 px-4 sm:px-6 lg:px-8">

      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg mt-8">
        <h2 className="text-2xl font-semibold text-center text-black mb-6">Update Product</h2>
        <form onSubmit={handleSubmit} method="post" encType="multipart/form-data" className="space-y-6">


          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-50 text-black border border-gray-300 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-50 text-black border border-gray-300 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
              rows="4"
              required
            />
          </div>


          <div className="flex flex-row ">

            <img
              src={imagePreview || import.meta.env.VITE_API_URL + image}
              alt="Current Product"
              className="w-32 h-42 object-cover rounded-md mb-4"
            />

            <div className="w-full flex flex-col ml-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black">Change Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  className="w-full p-3 rounded-md bg-gray-50 text-black border border-gray-300 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                  accept="image/*"
                />
              </div>
              <div className="space-y-2 mt-3">
                <label className="block text-sm font-medium text-black">Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-gray-50 text-black border border-gray-300 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-50 text-black border border-gray-300 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
              required
            />
          </div>


          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-50 text-black border border-gray-300 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
              required
            />
          </div>


          <button
            type="submit"
            className="cursor-pointer w-full py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-black focus:ring-4 focus:outline-none"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
