import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import React from "react";

type Props = {
  register: any;
  error?: string;
  name: string;
  placeholder: string;
  id: string;
};

export default function InputField({
  register,
  error,
  name,
  placeholder,
  id,
}: Props) {
  return (
    <FormControl>
      <FormLabel htmlFor={id} m="0" fontSize="sm">
        {name}
      </FormLabel>
      <Input id={id} placeholder={placeholder} {...register(id)} />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
}
