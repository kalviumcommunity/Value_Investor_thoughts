  import React, { useState, useEffect } from 'react';
  import { Avatar } from "@chakra-ui/avatar";
  import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
  import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
  import { Portal } from "@chakra-ui/portal";
  import { Button, IconButton, useToast } from "@chakra-ui/react";
  import { BsInstagram } from "react-icons/bs";
  import { CgMoreO } from "react-icons/cg";
  import axios from "axios";
  import BASE_URL from "../config";
  import { Link as RouterLink } from "react-router-dom";
  import Cookie from "js-cookie";

  const UserHeader = () => {
    const toast = useToast();
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Add a loading state
  const storedData = JSON.parse(localStorage.getItem("CurrentUser"));
  
  // console.log(Cookie.get('jwt'))
  
  useEffect(() => {
      const fetchUserPosts = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`${BASE_URL}/user-posts`,{
            headers:{
              token:Cookie.get('jwt')
            }
          });
          // console.log(response)
          setUserData(response.data.user);
        } catch (error) {
          console.log(error.message);
          toast({
            status: "error",
            description: error.response.data.error,
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setIsLoading(false); 
        }
      };

      fetchUserPosts();
  }, []);

  const copyURL = () => {
      const currentURL = window.location.href;
      navigator.clipboard.writeText(currentURL).then(() => {
        toast({
          title: "Success.",
          status: "success",
          description: "Profile link copied.",
          duration: 3000,
          isClosable: true,
        });
      });
  };
  

  if (isLoading) {
    return <div>Loading...</div>;
    }
  return (
      <VStack gap={4} alignItems={"start"} p={4} borderRadius="lg">
          <Flex justifyContent={"space-between"} w={"full"}>
              <Box>
                  <Text fontSize={"2xl"} fontWeight={"bold"}>{userData.firstName} {userData.lastName}</Text>
              </Box>
              <Box>
                  <Avatar
                      name={userData.name}
                      src={userData.profilePic || 'https://bit.ly/broken-link'}
                      size={{ base: "md", md: "xl" }}
                  />
              </Box>
          </Flex>

          <Text fontSize="sm" color="gray.600">{userData.bio}</Text>

          {storedData?.id === userData._id && (
              <Link as={RouterLink} to='/updateUser'>
                  <Button size={"sm"} colorScheme="blue">Update Profile</Button>
              </Link>
          )}
          
          <Flex w={"full"} justifyContent={"space-between"}>
              <Flex>
                  <IconButton
                      icon={<BsInstagram size={24} />}
                      aria-label="Instagram"
                      variant="ghost"
                      onClick={() => {}}
                  />
                  <Menu>
                      <MenuButton as={IconButton} icon={<CgMoreO size={24} />} variant="ghost" />
                      <Portal>
                          <MenuList bg="gray.100">
                              <MenuItem onClick={copyURL}>Copy link</MenuItem>
                          </MenuList>
                      </Portal>
                  </Menu>
              </Flex>
          </Flex>
              	  
          <Flex w={"full"}>
              <Flex flex={1} justifyContent={"center"} pb='3' borderBottom={"1px solid gray"}  cursor={"pointer"}>
                  <Text fontWeight={"bold"}>POSTED</Text>
              </Flex>
          </Flex>
      </VStack>
  );
  };

  export default UserHeader;
