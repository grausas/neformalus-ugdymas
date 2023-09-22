"use client";
import { useContext } from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  useColorMode,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import Image from "next/image";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { AuthContext } from "@/context/auth";
import logo from "@/assets/logo.png";

interface Props {
  children: React.ReactNode;
  url: string;
}

const Links = [
  { name: "Žemėlapis", url: "/zemelapis" },
  { name: "Apie mus", url: "#" },
  { name: "Informacija", url: "#" },
  { name: "Kontaktai", url: "#" },
];

const NavLink = (props: Props) => {
  const { children, url } = props;

  return (
    <Link
      color="brand.10"
      fontWeight="500"
      href={url}
      px={2}
      py={1}
      _hover={{
        textDecoration: "none",
        color: "brand.40",
        transition: "0.3s ease-in-out",
      }}
    >
      {children}
    </Link>
  );
};

export default function Simple() {
  const auth = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Box bg="brand.31" px={4}>
        <Flex
          maxW="1440px"
          h={14}
          alignItems={"center"}
          justifyContent={"space-between"}
          margin="0 auto"
        >
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <Link href="/" _hover={{ textDecoration: "none" }}>
            <HStack spacing={3} alignItems={"center"}>
              <Image width={30} height={30} src={logo} alt="logo" />
              <Text
                color="brand.10"
                textTransform="uppercase"
                fontWeight="600"
                fontSize="lg"
              >
                Neformalus vilnius
              </Text>
            </HStack>
          </Link>
          <Flex alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={2}
              display={{ base: "none", md: "flex" }}
              mr="5"
            >
              {Links.map((link) => (
                <NavLink key={link.name} url={link.url}>
                  {link.name}
                </NavLink>
              ))}
            </HStack>
            {/* <Button
              size={{ base: "sm", md: "md" }}
              //  onClick={toggleColorMode}
            >
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button> */}
            {auth.user.token && (
              <Button
                onClick={() => auth.logout()}
                size="sm"
                ml="2"
                bg="brand.10"
                shadow="md"
                px="5"
              >
                Atsijungti
              </Button>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link.name} url={link.url}>
                  {link.name}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
