import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Input, Box, Flex, Text, CircularProgress, useColorModeValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../config";
import Cookie from "js-cookie";


function SearchBar() {
  const [input, setInput] = useState("");
  const [data, setData] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
 
  const navigate = useNavigate();
  const hoverBgColor = useColorModeValue("gray", "gray"); // Adjust hover background color based on color mode
 

  useEffect(() => {
    if (input.trim() === "") {
      setResults([]); 
      return; 
    }
    const newData =
      data &&
      data.filter((user) =>
        user.stockName.toLowerCase().includes(input.toLowerCase())
      );
    setResults(newData);
  }, [input, data]);

  
  const handleChange = (e) => setInput(e.target.value);

  const handleClick = (result) => {
    navigate("/Explore", { state: { Explore: result } });
  };

  return (
    <Box>
      <Flex justifyContent="center" alignItems="center" mb={4}>
        <FaSearch id="search-icon" />
        <Input
          variant="unstyled"
          placeholder="Type to search..."
          value={input}
          onChange={handleChange}
          ml={2}
          fontSize="1.25rem"
        />
      </Flex>
      <Box textAlign="center">
        {loading ? (
          <CircularProgress isIndeterminate color="teal" />
        ) : (
          results.map((result, id) => (
            <Text
              key={id}
              p={2}
              _hover={{ bg: hoverBgColor, cursor: "pointer" }}
              onClick={() => handleClick(result)}
            >
              {result.stockName}
            </Text>
          ))
        )}
      </Box>
    </Box>
  );
}

export default SearchBar;
