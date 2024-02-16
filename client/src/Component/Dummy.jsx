import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dummy() {
  const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:5000/get-data');
        setData(response.data);
        console.log(response.data)
        // setIsLoading(false);
      } catch (error) {
        console.log(error)
        // setError(error);
        // setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {data && (
        <ul>
          {data.map((item) => (
            <li key={item._id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
