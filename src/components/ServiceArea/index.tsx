import {
  Flex,
  useDisclosure,
  Text,
  Switch,
  CloseButton,
  Box,
} from "@chakra-ui/react";
import { SettingsIcon, ArrowLeftIcon } from "@chakra-ui/icons";
import { ChangeEventHandler, useEffect, useState } from "react";

const colors = [
  { color: "rgba(177,211,50,.75)", text: "0 - 5 minutės" },
  { color: "rgba(177,211,50,.5)", text: "5 - 10 minutės" },
  { color: "rgba(177,211,50,.25)", text: "10 - 15 minutės" },
];

const ServiceArea = ({
  handleServiceArea,
}: {
  handleServiceArea: (checked: boolean) => void;
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    handleServiceArea(isChecked);
    // eslint-disable-next-line
  }, [isChecked]);

  return (
    <>
      <Flex
        position="absolute"
        justify="center"
        align="center"
        top="97"
        left="4"
        zIndex="11"
        bg="brand.10"
        borderRadius="md"
        height="32px"
        width="32px"
        shadow="md"
        onClick={isOpen ? onClose : onOpen}
        _hover={{
          bg: "brand.20",
          cursor: "pointer",
          transition: "0.3s ease-in-out",
        }}
      >
        {isOpen ? (
          <ArrowLeftIcon boxSize={4} fontWeight="300" />
        ) : (
          <SettingsIcon boxSize={4} />
        )}
      </Flex>
      {isOpen && (
        <Flex
          position="absolute"
          direction="column"
          top="97"
          left="14"
          zIndex="11"
          bg="brand.10"
          borderRadius="md"
          shadow="md"
          p="3"
          maxW={{ base: "250px", md: "100%" }}
        >
          <CloseButton
            onClick={onClose}
            position="absolute"
            top="0"
            right="0"
          />
          <Flex direction="row" alignItems="center">
            <Switch
              size={{ base: "sm", md: "md" }}
              mr={{ base: "2", md: "3" }}
              isChecked={isChecked}
              value={isChecked ? "true" : "false"}
              onChange={handleChange}
            />
            <Text fontSize={{ base: "sm", md: "md" }}>
              {isChecked ? "Įjungta" : "Išjungta"}
            </Text>
          </Flex>
          <Text mb="2" fontSize={{ base: "sm", md: "md" }}>
            Matuoti pasiekiamumą aplink nurodytą vietą
          </Text>
          <Box>
            {colors.map((item, index) => (
              <Text
                key={index}
                bg={item.color}
                px="2"
                fontSize={{ base: "sm", md: "md" }}
              >
                {item.text}
              </Text>
            ))}
          </Box>
        </Flex>
      )}
    </>
  );
};

export default ServiceArea;
