import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import usePreviewImg from "../../Hooks/usePreviewImg";
import useShowToast from "../../Hooks/useShowToast";
import BASE_URL from "../config";

export default function UpdateProfilePage() {
  const storedData = JSON.parse(localStorage.getItem("CurrentUser"));
  const navigate = useNavigate(); // Initialize useNavigate
  const [isUpdate, setIsUpdate] = useState(false);
  const [inputs, setInputs] = useState({
    firstName: storedData.firstName,
    lastName: storedData.lastName,
    email: storedData.email,
    bio: storedData.bio,
    password: "",
    username: storedData.username,
  });

  const fileRef = useRef(null);
  const [updating, setUpdating] = useState(false);

  const showToast = useShowToast();
  const { handleImageChange, imgUrl } = usePreviewImg();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) return;
    setUpdating(true);
    try {
      const userId = storedData?.id; 
      if (!userId) {
        throw new Error("User ID is undefined");
      }
      const res = await fetch(`${BASE_URL}/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Success", "Profile updated successfully", "success");
        localStorage.setItem("CurrentUser", JSON.stringify(data.user));
        setIsUpdate(true);
      } else {
        showToast(
          "Error",
          data.error || "An error occurred while updating the profile",
          "error"
        );
      }
    } catch (error) {
      console.error("Fetch error:", error);
      showToast("Error", error.message, "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    navigate("/userpage"); // Navigate to user page on cancel
  };

  useEffect(() => {
    if (isUpdate) {
      setIsUpdate(false);
      navigate("/userpage"); // Navigate to user page after successful update
    }
  }, [isUpdate]);

  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"} my={6}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>
          <FormControl id="userName">
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  size="xl"
                  boxShadow={"md"}
                  src={imgUrl || storedData.profilePic}
                />
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Change Avatar
                </Button>
                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder="John Doe"
              value={inputs.firstName}
              onChange={(e) => setInputs({ ...inputs, firstName: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="johndoe"
              value={inputs.lastName}
              onChange={(e) =>
                setInputs({ ...inputs, lastName: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="email"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="Your bio."
              value={inputs.bio}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="password"
              autoComplete="current-password"
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              onClick={handleCancel}
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
            >
              Cancel
            </Button>
            <Button
              bg={"green.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "green.500",
              }}
              type="submit"
              isLoading={updating}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
