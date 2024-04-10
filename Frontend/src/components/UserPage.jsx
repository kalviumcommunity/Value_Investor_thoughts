import { useRef, useState, useEffect } from "react";
import UserHeader from "./UserHeader";
import {
  Container,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  VStack,
  HStack,
  Box,
  Text,
  Avatar,
  IconButton,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";
import BASE_URL from "../config";
import usePreviewImg from "../../Hooks/usePreviewImg";
import CreatePost from "./CreatePost";
import Explore from "./Explore";

function UserPage() {
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const [data, setData] = useState([]);
  const storedData = JSON.parse(localStorage.getItem("CurrentUser"));
  const userId = storedData.id;
  const InvestorName = storedData.firstName;
  const [editId, setEditId] = useState(null);
  const [stockName, setStockName] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const imageRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/getUserPostedData/${userId}`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.log("Error parsing JSON:", error));
  }, [userId]);

  const handleDelete = async (editId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/deletePost/${editId}`, {
        withCredentials: true,
      });
      console.log(response.data); 
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`${BASE_URL}/editPost/${userId}`, {
        EditId: editId,
        postedBy : userId,
        text: text,
        img: imgUrl,
        investorName :InvestorName,
        Stock: stockName,
      });
      setEditId(null);
      setStockName("");
      setText("");
      setImage(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleEdit = (_id, stockName, text, img) => {
    setEditId(_id);
    setStockName(stockName);
    setText(text);
    setImage(img);
    setIsEditing(true);
  };

  return (
    <>
      <UserHeader />
      <Container maxW="50vw">
        {data.map((post, index) =>
          post.posts.map((postDetail, postIndex) => (
            <Box
              key={postDetail._id}
              maxW="50vw"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              bg={useColorModeValue("white", "black")}
              shadow="md"
              mb={4}
            >
              <VStack align="stretch" p={4}>
                <HStack justify="space-between">
                  <Text fontWeight="bold">{postDetail.stockName}</Text>
                </HStack>
                {postDetail.postedBy === userId && (
                  <>
                    <HStack>
                      <Text fontSize="sm" color="gray.500">
                        @{postDetail.investorName}
                      </Text>
                      {/* <Text>PostedBy: {postDetail.investorName}</Text> */}
                    </HStack>
                    <Text>{postDetail.text}</Text>
                    {postDetail.img && (
                      <Image
                      borderRadius="md" maxW="50vw" maxH="40vw" 
                        src={postDetail.img}
                        alt={`Post by ${postDetail.investorName}`}
                      />
                    )}
                    <IconButton
                      aria-label="Delete post"
                      icon={<DeleteIcon />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDelete(postDetail._id)}
                    />
                    <Button
                      colorScheme="blue"
                      onClick={() =>
                        handleEdit(
                          postDetail._id,
                          postDetail.stockName,
                          postDetail.text,
                          postDetail.img
                        )
                      }
                    >
                      Edit
                    </Button>
                  </>
                )}
              </VStack>
            </Box>
          ))
        )}
      </Container>

      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="stockName">Stock Name:</label>
              <input
              id="stockName"
              type="text"
              value={stockName}
              onChange={(e) => {
                const inputValue = e.target.value;
                const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9]/g, ""); // Allow only alphanumeric characters
                setStockName(sanitizedValue);
              }}
              placeholder="Enter Stock Name"
              style={{ marginLeft: "1rem" }}
            />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="text">Text:</label>
              <textarea
                id="text"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter Text"
                style={{ marginLeft: "1rem", minHeight: "100px" }}
              ></textarea>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="image">Image:</label>
              <input
                id="image"
                type="file"
                ref={imageRef}
                onChange={handleImageChange}
                style={{ marginLeft: "1rem" }}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleSubmit(editId)}
            >
              Save
            </Button>
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* <Explore/> */}
      <CreatePost />
    </>
  );
}

export default UserPage;
