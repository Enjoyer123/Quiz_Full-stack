import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../../App.jsx";
import Pagination from '@mui/material/Pagination';
import { fetchDataFromApi } from "../../utils/api.js";
import Slideshow from "../../components/Banner/index.jsx";
import Rating from '@mui/material/Rating';

const Home = () => {
  const context = useContext(MyContext);
  const [books, setBooks] = useState([]);
  const [totalpage, setTotalpage] = useState();
const [loading,setLoading] = useState(false)
  useEffect(() => {
    const fetchBooks = () => {
      try {
         fetchDataFromApi("/api/products").then((res)=>{
          setTotalpage(res.pagination.totalPages);
          setBooks(Array.isArray(res.data) ? res.data : []); 
        })
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false); 
      }
    };

    fetchBooks();
  }, []);

  const handleChange = (event, value) => {
    fetchDataFromApi(`/api/products?page=${value}`).then((res) => {
      setBooks(res.data);
    });
  };


  return (
    <div className="flex flex-col justify-center items-center min-h-screen mt-20">
  <div className="p-4 flex flex-col w-full max-w-4xl bg-white">
    <Slideshow />
    <h2 className="text-xl text-center font-bold mb-4 font-serif">Best Selling Books Ever</h2>
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-4">
      {books.map((book) => (
        <div
          key={book.id}
          className="bg-white mb-3 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 w-full max-w-[250px] flex flex-col overflow-hidden"
        >
          <Link to={`/product/${book.id}`} className="block">
            <div className="w-full h-[250px] overflow-hidden relative">
              <img
                src={import.meta.env.VITE_API_URL + book.image}
                alt={book.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="px-4 pt-2 mb-2 flex-grow">
              <h3 className="font-serif text-md font-semibold">{book.name.length > 9 ? `${book.name.substring(0, 9)}...` : book.name}</h3>
              <p className="text-gray-500 text-sm">{book.author.length > 9 ? `${book.name.substring(0, 9)}...` : book.author}</p>
            </div>
            <div className="flex justify-between px-4 mt-auto mb-2">
              <Rating name="simple-controlled" value={5} size="small" readOnly color="primary" />
              <p className="text-black font-semibold">฿{book.price}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>

    <div className="flex items-center justify-center">
      <Pagination
        count={totalpage}
        className="mt-4 text-white"
        color="primary"
        onChange={handleChange}
      />
    </div>
  </div>
</div>

  );
};

export default Home;
