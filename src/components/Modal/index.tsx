import {
  EmailIcon,
  ExternalLinkIcon,
  PhoneIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Stack,
  Flex,
  Text,
  Link,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import Image from "next/image";
import location from "@/assets/location.svg";
import { DeleteFeature } from "@/helpers/deleteFeature";

function CardModal({ isOpen, onClose, modalData }: any) {
  console.log("modalData", modalData);
  const deleteFeature = async () => {
    // await DeleteFeature(modalData.attributes.OBJECTID);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalData.attributes.PAVADIN}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack color="brand.40" my="3" spacing="0" fontSize="md">
              <Flex alignItems="center">
                <Image width={16} height={16} src={location} alt="adresas" />
                <Text ml="2" fontWeight="500">
                  {modalData.attributes.ADRESAS}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <EmailIcon mr="2" color="brand.30" />
                <Text>{modalData.attributes.EL_PASTAS}</Text>
              </Flex>
              <Flex alignItems="center">
                <PhoneIcon mr="2" color="brand.30" />
                <Text>
                  {modalData.attributes.TELEF_MOB
                    ? "+" + modalData.attributes.TELEF_MOB
                    : modalData.attributes.TELEF}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <ExternalLinkIcon mr="2" color="brand.30" />
                <Link
                  href={`http://${modalData.attributes.NUORODA}`}
                  isExternal
                >
                  {modalData.attributes.NUORODA}
                </Link>
              </Flex>
              {modalData.attributes.SOC_TINKL && (
                <Text>{modalData.attributes.SOC_TINKL}</Text>
              )}
              {modalData.attributes.PASTABA && (
                <Text>{modalData.attributes.PASTABA}</Text>
              )}
            </Stack>
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <Button
              bg="brand.20"
              size="sm"
              onClick={deleteFeature}
              leftIcon={<EditIcon />}
            >
              Redaguoti
            </Button>
            <Popover>
              <PopoverTrigger>
                <Button
                  mt="2"
                  colorScheme="red"
                  size="sm"
                  leftIcon={<DeleteIcon />}
                >
                  Ištrinti
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Ar tikrai norite ištrinti?</PopoverHeader>
                <PopoverBody display="flex" justifyContent="flex-end">
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={deleteFeature}
                    leftIcon={<DeleteIcon />}
                  >
                    Ištrinti
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CardModal;
