import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

import { Box, Image,  VStack, HStack, Avatar, IconButton, Container, Text , useColorModeValue  } from '@chakra-ui/react';
import { FaRegHeart, FaRegComment } from 'react-icons/fa';


import { motion } from "framer-motion";
const Explore = () => {
 
  const location = useLocation();
  const stock = location.state?.Explore;
  
console.log(stock)
  if (!stock) {
    return (
      <Container maxW="50vw" h="70vh" display="flex" justifyContent="center" alignItems="center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1}} transition={{ duration: 2 }}>
          <Text fontSize="xl" fontWeight="bold" textAlign="center">
          EXPLORE NEW INSIGHTS BY SEARCHING FOR A STOCK
          </Text>
        </motion.div>
      </Container>
    );
  }
  return (
    <Container maxW="81%">
      {stock.posts.map((post, index) => (
        <Box
          key={index}
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
              <div key={index}>
                <HStack>
                  <Avatar name={post.investorName} src={post.profilePic} />
                  console.log()
                  <VStack align="start">
              <Text fontWeight="bold">{post.investorName}</Text>
                    <Text fontSize="sm" color="gray.500">@{stock.stockName}</Text>
                  </VStack>
                </HStack>
                <Text fontSize="xs" color="gray.500">{post.timeAgo}</Text>
              </div>
            </HStack>
            <Text mt={1}>{post.text}</Text>
            {post.img && <Image src={post.img} alt={`Post image`}  borderRadius="md" maxW="50vw" maxH="40vw"  objectFit="cover"  />}
            src={post.img}
            <HStack mt={4}>
              <IconButton
                aria-label="Like post"
                icon={<FaRegHeart />}
                size="sm"
                variant="ghost"
                colorScheme="red"
              />
              <IconButton
                aria-label="Comment on post"
                icon={<FaRegComment />}
                size="sm"
                variant="ghost"
                colorScheme="blue"
              />
            </HStack>
          </VStack>
        </Box>
      ))}
    </Container>
  );}
  

export default Explore;





