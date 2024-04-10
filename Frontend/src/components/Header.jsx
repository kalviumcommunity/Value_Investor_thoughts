import React from "react";
import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import userAtom from "../../Atoms/CurrentUser";
import { CiSearch } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import BlackLogo from "../assets/BlackLogo.png";
import WhiteLogo from "../assets/WhiteLogo.png";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();

  return (
    <Flex justifyContent={"space-around"} mt={6} mb="12">
      {user && (
        <>
          <Button size={{ base: "sm", sm: "md" }}>
            <RouterLink to="/userPage">
              <RxAvatar size={24} />
            </RouterLink>
          </Button>

          <Image
            cursor={"pointer"}
            alt="logo"
            justifyContent={"center"}
            w={10}
            src={colorMode === "dark" ? WhiteLogo : BlackLogo}
            onClick={toggleColorMode}
          />

          <Button size={{ base: "sm", sm: "md" }}>
            <RouterLink to="/SearchBar">
              <CiSearch size={24}  />
            </RouterLink>
          </Button>
        </>
      )}
    </Flex>
  );
};

export default Header;
