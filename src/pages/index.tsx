import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Home() {
  return (
    <>
      <Container maxW={"3xl"}>
        <Stack
          as={Box}
          textAlign={"center"}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
          >
            Neformalus <br />
            <Text as={"span"} color={"green.400"}>
              ugdymas
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            VISOS VEIKLOS VAIKAMS IR JAUNIMUI VILNIAUS MIESTE VIENOJE VIETOJE
          </Text>
        </Stack>
      </Container>
    </>
  );
}
