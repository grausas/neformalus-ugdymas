import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Radio,
  Select,
} from "@chakra-ui/react";
import React from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { text } from "stream/consumers";

type Props = {
  register: any;
  registerValue: string;
  options?: any;
  error?: string;
  name: string;
  id: string;
  text?: string;
  selectOptions?: { text: string; id: number; value: number }[];
};

export default function SelectField({
  register,
  registerValue,
  options,
  error,
  name,
  id,
  text,
  selectOptions,
}: Props) {
  return (
    <FormControl>
      <FormLabel htmlFor={id} m="0" fontSize="sm" color="brand.40">
        {name}
      </FormLabel>
      <Menu closeOnSelect={false}>
        <MenuButton
          as={Button}
          variant="outline"
          rightIcon={<ChevronDownIcon />}
          w="100%"
          fontSize="sm"
          fontWeight="400"
          rounded="md"
        >
          {text}
        </MenuButton>
        <MenuList>
          {selectOptions &&
            selectOptions.map((option) => (
              <MenuItem key={option.id}>
                <Checkbox
                  value={option.value}
                  size="sm"
                  id={id}
                  {...register(registerValue, options)}
                >
                  {option.text}
                </Checkbox>
              </MenuItem>
            ))}
        </MenuList>
      </Menu>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
}
