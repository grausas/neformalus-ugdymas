import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  Select,
} from "@chakra-ui/react";
import React from "react";

type Props = {
  register: any;
  registerValue: string;
  options?: any;
  error?: string;
  name: string;
  placeholder?: string;
  id: string;
  children?: React.ReactNode;
  selectOptions?: { text: string; id: number; value: number }[];
};

export default function SelectField({
  register,
  registerValue,
  options,
  error,
  name,
  placeholder,
  id,
  children,
  selectOptions,
}: Props) {
  return (
    <FormControl>
      <FormLabel htmlFor={id} m="0" fontSize="sm" color="brand.40">
        {name}
      </FormLabel>
      <InputGroup>
        {children}
        <Select
          id={id}
          placeholder={placeholder}
          {...register(registerValue, options)}
          bg="brand.10"
        >
          {selectOptions &&
            selectOptions.map((option) => (
              <option key={option.id} value={option.value}>
                {option.text}
              </option>
            ))}
        </Select>
      </InputGroup>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
}
