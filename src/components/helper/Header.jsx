import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { api } from "../../utils/api.js";
import defaultImage from "../../Icons/profile.jpeg";
import { Link } from 'react-router-dom';

const Header = () => {
  const [searchData, setSearchData] = useState([]);
  const [secondryQuery, setSecondryQuery] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);

  const fetchSearchData = async (searchQuery) => {
    try {
      const response = await api.get("/api/user/_search", {
        params: {
          query: searchQuery,
          limit: 10,
          offset: 0
        }
      });

      if (response && response.data && response.data[0] && response.data[0].data) {
        setSearchData(response.data[0].data);
      } else {
        setSearchData([]);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      setSearchData([]);
    }
  };

  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (secondryQuery) {
      const timer = setTimeout(() => {
        fetchSearchData(secondryQuery);
      }, 500); // Reduced to 500ms for better responsiveness

      setDebounceTimer(timer);
    } else {
      setSearchData([]); // Clear search data when query is empty
    }

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [secondryQuery]);

  return (
    <header className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">LocalHire</h1>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
          <input
            type="text"
            placeholder="Search..."
            value={secondryQuery}
            onChange={(e) => setSecondryQuery(e.target.value)}
            className="bg-white bg-opacity-20 text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-blue-300 transition duration-300 w-[25rem]"
          />
          <div className={`absolute top-full h-[20rem] overflow-auto scrollbar-hidden  left-0 w-full mt-2 bg-gray-900 p-3 rounded-lg shadow-lg transition-opacity duration-300 ${secondryQuery.length > 0 ? "opacity-100 z-50" : "opacity-0 z-0"}`}>
            {secondryQuery.length > 0 && (
              searchData.length > 0 ? (
                searchData.map((data, index) => (
                  <Link to={`/profile/${data._id}`} key={data._id} onClick={() => {setSecondryQuery("")}}>
                    <div className='border flex items-center p-2 cursor-pointer rounded-3xl mb-3'>
                      <div className='w-16 h-16 rounded-full '>
                        <img src={data?.profileImage || defaultImage} alt="profileImage" className='w-16 h-16 rounded-full object-cover' />
                      </div>
                      <div className='ml-4'>
                        <h1 className='text-lg'>{data?.name || "Unnamed User"}</h1>
                        <p className='text-sm text-gray-500'>{data?.designation || "user"}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="p-3 text-center text-gray-600">No results found</p>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;





