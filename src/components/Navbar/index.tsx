import { useContext } from "react";
import {
  Box,
  Flex,
  HStack,
  Button,
  useDisclosure,
  Heading,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import Image from "../Image";
import { AuthContext } from "@/context/auth";

export default function Simple() {
  const auth = useContext(AuthContext);

  return (
    <>
      <Box bg="brand.30" px={{ base: 2, md: 3 }}>
        <Flex
          h={{ base: 12, md: 16 }}
          alignItems={"center"}
          justifyContent={"space-between"}
          margin="0 auto"
        >
          <Link href="/" _hover={{ textDecoration: "none" }}>
            <HStack spacing={3} alignItems={"center"} position="relative">
              <Image height={22} width={22} src="/logo_black.png" alt="logo" />
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
                  fontSize={{ base: "sm", md: "md" }}
                  letterSpacing="0.9px"
                  as="h1"
                  lineHeight="1"
                >
                  Vilniaus miesto neformaliojo
                </Heading>
                <Heading
                  color="brand.50"
                  fontWeight="500"
                  fontSize={{ base: "sm", md: "md" }}
                  letterSpacing="0.9px"
                  as="h1"
                  lineHeight="1"
                >
                  švietimo žemėlapis
                </Heading>
              </Flex>
            </HStack>
          </Link>
          <Flex alignItems={"center"}>
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
      </Box>
    </>
  );
}
