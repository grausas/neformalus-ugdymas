import { useContext } from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  Heading,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import Image from "next/image";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { AuthContext } from "@/context/auth";
import logo from "@/assets/logo.png";
import logoBlack from "@/assets/logo_black.png";

interface Props {
  children: React.ReactNode;
  url: string;
}

const Links = [
  { name: "Žemėlapis", url: "/zemelapis" },
  { name: "Kontaktai", url: "#" },
];

const NavLink = (props: Props) => {
  const { children, url } = props;

  return (
    <Link
      color="brand.50"
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

  return (
    <>
      <Box bg="brand.30" px={4}>
        <Flex
          h={16}
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
            <HStack spacing={3} alignItems={"center"} position="relative">
              <Image height={24} src={logoBlack} alt="logo" />
              <Box
                _after={{
                  content: "''",
                  position: "absolute",
                  top: "0",
                  width: "2px",
                  height: "100%",
                  bg: "brand.50",
                }}
              />
              <Flex direction="column">
                <Heading
                  color="brand.50"
                  fontWeight="500"
                  fontSize="md"
                  letterSpacing="0.5px"
                  as="h1"
                  lineHeight="1"
                >
                  Neformalus
                </Heading>
                <Heading
                  color="brand.50"
                  fontWeight="500"
                  fontSize="md"
                  letterSpacing="0.5px"
                  as="h1"
                  lineHeight="1"
                >
                  Vilnius
                </Heading>
              </Flex>
            </HStack>
          </Link>
          <Flex alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={2}
              display={{ base: "none", md: "flex" }}
              mr="5"
            >
              {/* {Links.map((link) => (
                <NavLink key={link.name} url={link.url}>
                  {link.name}
                </NavLink>
              ))} */}
            </HStack>

            {auth.user.token && (
              <Button
                onClick={() => auth.logout()}
                bg="brand.20"
                fontSize="sm"
                textTransform="uppercase"
                shadow="md"
              >
                Atsijungti
              </Button>
            )}
          </Flex>
        </Flex>

        {/* {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link.name} url={link.url}>
                  {link.name}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null} */}
      </Box>
    </>
  );
}
