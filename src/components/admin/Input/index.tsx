import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
} from "@chakra-ui/react";

type Props = {
  register: any;
  registerValue: string;
  options?: any;
  error?: string;
  name: string;
  type?: string;
  placeholder?: string;
  id: string;
  children?: React.ReactNode;
  maxLength?: number;
  minLength?: number;
  isError?: boolean;
};

export default function InputField({
  register,
  registerValue,
  options,
  error,
  name,
  type,
  placeholder,
  id,
  children,
  maxLength,
  minLength,
  isError,
}: Props) {
  return (
    <FormControl isInvalid={isError}>
      <FormLabel htmlFor={id} m="0" fontSize="sm" color="brand.40">
        {name}
      </FormLabel>
      <InputGroup>
        {children}
        <Input
          type={type}
          id={id}
          placeholder={placeholder}
          {...register(registerValue, options)}
          bg="brand.10"
          maxLength={maxLength}
          minLength={minLength}
        />
      </InputGroup>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
}
