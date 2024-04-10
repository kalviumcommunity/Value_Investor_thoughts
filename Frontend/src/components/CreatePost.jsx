import { AddIcon } from "@chakra-ui/icons";
import {
 Button,
 CloseButton,
 Flex,
 FormControl,
 Image,
 Input,
 Modal,
 ModalBody,
 ModalCloseButton,
 ModalContent,
 ModalFooter,
 ModalHeader,
 ModalOverlay,
 Text,
 Textarea,
 useColorModeValue,
 useDisclosure,
} from "@chakra-ui/react";
import axios from 'axios';
import BASE_URL from "../config";
import { useRef, useState, useEffect } from "react";
import usePreviewImg from "../../Hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import useShowToast from "../../Hooks/useShowToast";
const MAX_CHAR = 500;
const MAX_CHAR_SN = 50;

const CreatePost = () => {
 const { isOpen, onOpen, onClose } = useDisclosure();
 const [postText, setPostText] = useState("");
 const [StockName, setStockName] = useState("");
 const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
 const imageRef = useRef(null);
 const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
 const showToast = useShowToast();
 const [loading, setLoading] = useState(false);

 const handleTextChangeStock = (e) => {
  const inputStockName = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
  setStockName(inputStockName);
};


 const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
 };

 const handleCreatePost = async () => {
    setLoading(true);
    try {
      const storedData = JSON.parse(localStorage.getItem("CurrentUser"));
      const userId = storedData.id;
      const userName = storedData.firstName; 
      const profilePic = storedData.profilePic; 
      const res = await axios.post(`${BASE_URL}/create`, {
        postedBy: userId,
        investorName: userName,
        text: postText,
        profilePic: profilePic,
        img: imgUrl,
        Stock: StockName
      }, {
        withCredentials: true 
      });

      const data = await res.data;
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post created successfully", "success");
      onClose();
      setPostText("");
      setImgUrl("");
    } catch (error) {
      showToast("Error", error.message || "An error occurred", "error");
    } finally {
      setLoading(false);
    }
 };

 return (
    <>
      <Button
        position={"fixed"}
        bottom={20}
        right={5}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
        size={{ base: "sm", sm: "md" }}
      > 
        <AddIcon />   
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="Name of the stock"
                onChange={handleTextChangeStock}
                onKeyPress={handleTextChangeStock}
                value={StockName}
              />
              <Text
                pb={1}
                fontSize="xs"
                fontWeight="bold"
                textAlign={"right"}
                color={"gray.800"}
              >
              </Text>
              <Textarea
                placeholder="Post content goes here.."
                onChange={handleTextChange}
                value={postText}
              />
              <Text
                fontSize="xs"
                fontWeight="bold"
                textAlign={"right"}
                m={"1"}
                color={"gray.800"}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>

              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />

              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => imageRef.current.click()}
              />
            </FormControl>

            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt="Selected img" />
                <CloseButton
                 onClick={() => {
                    setImgUrl("");
                 }}
                 bg={"gray.800"}
                 position={"absolute"}
                 top={2}
                 right={2}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
              isLoading={loading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
 );
};

export default CreatePost;