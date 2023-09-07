import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import React from "react";

type Props = {
  register: any;
  error?: string;
  name: string;
  placeholder?: string;
  id: string;
  children?: React.ReactNode;
};

export default function InputField({
  register,
  error,
  name,
  placeholder,
  id,
  children,
}: Props) {
  return (
    <FormControl>
      <FormLabel htmlFor={id} m="0" fontSize="sm" color="brand.40">
        {name}
      </FormLabel>
      <InputGroup>
        {children}
        <Input
          id={id}
          placeholder={placeholder}
          {...register(id)}
          bg="brand.10"
        />
      </InputGroup>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
}
