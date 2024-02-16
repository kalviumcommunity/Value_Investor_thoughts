import React, { useState, useEffect } from 'react';
import axios, { Axios } from 'axios';

export default function Dummy() {
  const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://investor-thoughts.onrender.com/get-data');
        // console.log(response.data)
        setData(response.data);
      } catch (error) {
        // console.log(error)
       
      }
    };

    fetchData();
  }, []);

 

  return (
    <div>
      {data && (
        <ul>
          { data && data.map((item) => (
            <li key={item._id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
