import { useForm } from "react-hook-form";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  FormErrorMessage,
  Button,
  VStack,
  Flex,
  SimpleGrid,
  InputLeftAddon,
  InputLeftElement,
  Heading,
} from "@chakra-ui/react";
import { PhoneIcon, EmailIcon, LinkIcon } from "@chakra-ui/icons";
import InputField from "../Input";

type FormValues = {
  PAVADIN: string;
  ADRESAS: string;
  EL_PASTAS: string;
  NUORODA: string;
  TELEF_MOB: string;
  TELEFONAS: string;
  SOC_TINKL: string;
  PASTABA: string;
};

export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = (data) => console.log(data);
  const onInvalid = () => null;

  return (
    <VStack
      as="form"
      position="absolute"
      top="4"
      right="4"
      maxW="600px"
      maxH="500px"
      bg="brand.10"
      p="4"
      shadow="md"
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      align="left"
    >
      <Heading size="md">Pridėti naują veiklą</Heading>
      <SimpleGrid columns={[1, 2]} spacing="3">
        <InputField
          register={register}
          error={errors.PAVADIN && errors.PAVADIN.message}
          name="Pavadinimas"
          id="PAVADIN"
        />
        <InputField
          register={register}
          error={errors.ADRESAS && errors.ADRESAS.message}
          name="Adresas"
          id="ADRESAS"
        />
        <InputField
          register={register}
          error={errors.EL_PASTAS && errors.EL_PASTAS.message}
          name="El. paštas"
          id="EL_PASTAS"
        >
          <InputLeftAddon>
            <EmailIcon />
          </InputLeftAddon>
        </InputField>
        <InputField
          register={register}
          error={errors.NUORODA && errors.NUORODA.message}
          name="Nuoroda"
          id="NUORODA"
        >
          <InputLeftAddon>
            <LinkIcon />
          </InputLeftAddon>
        </InputField>
        <InputField
          register={register}
          error={errors.TELEF_MOB && errors.TELEF_MOB.message}
          name="Mobilaus telefono numeris"
          id="TELEF_MOB"
        >
          <InputLeftAddon>370</InputLeftAddon>
        </InputField>
        <InputField
          register={register}
          error={errors.TELEFONAS && errors.TELEFONAS.message}
          name="Telefonas"
          id="TELEFONAS"
        >
          <InputLeftAddon pointerEvents="none">
            <PhoneIcon />
          </InputLeftAddon>
        </InputField>
        <InputField
          register={register}
          error={errors.SOC_TINKL && errors.SOC_TINKL.message}
          name="Socialiniai tinklai"
          id="SOC_TINKL"
        />

        <InputField
          register={register}
          error={errors.PASTABA && errors.PASTABA.message}
          name="Pastaba"
          id="PASTABA"
        />
      </SimpleGrid>
      <Flex justify="space-between" w="100%">
        <Button bg="brand.20">Atšaukti</Button>
        <Button
          bg="brand.30"
          _hover={{ bg: "brand.31" }}
          isLoading={isSubmitting}
          type="submit"
        >
          Pridėti
        </Button>
      </Flex>
    </VStack>
  );
}
