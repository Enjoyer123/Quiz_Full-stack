import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [image,setImage] = useState("")

  useEffect(() => {
   
    const fetchProduct = async () => {
      try {
        fetchDataFromApi(`/api/products/${id}`).then((res) => {

          setProduct(res);
          setImage(res.image)
        })

      } catch (error) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Error fetching product details",
        });

      }
    };
    fetchProduct();
  }, [id]);

  
  return (
    <div className="flex flex-col justify-center items-center min-h-screen mt-8">
      <div className="p-4 flex flex-col w-full max-w-5xl bg-white shadow-md">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/2 px-4">
            <img
              id="mainImage"
              src={import.meta.env.VITE_API_URL + image}
              alt={product.name}
              className="w-full h-auto rounded-lg "
            />
          </div>
          <div className="w-full md:w-1/2 px-4 pt-10 ">
            <h2 className="text-3xl font-bold mb-2 font-serif">{product.name}</h2>
            <p className="text-gray-600 mb-4">Author: {product.author}</p>
            <p className="text-gray-600 mb-4">Tags: {product.category}</p>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="mb-4">
              <span className="text-2xl font-bold mr-2">${product.price}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
