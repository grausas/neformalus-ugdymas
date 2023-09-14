import React, { useEffect, useState } from "react";
import {
  Text,
  Button,
  Checkbox,
  FormControl,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  Flex,
} from "@chakra-ui/react";
import { CategoryData } from "@/utils/categoryData";

type FilterProps = {
  handleFilter: (category: string[]) => void;
};

const NVS = [
  { value: 1, text: "Taikomas" },
  { value: 2, text: "Netaikomas" },
];

const classData = [
  { value: 1, text: "1-4 klasė" },
  { value: 1, text: "5-8 klasė" },
  { value: 1, text: "9-12 klasė" },
];

function Filter({ handleFilter }: FilterProps) {
  const [category, setCategory] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    CategoryData.map(() => false)
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = event.target.checked;
    setCheckedItems(newCheckedItems);
    const newCategory = event.target.checked
      ? [...category, event.target.value]
      : category.filter((item) => item !== event.target.value);
    setCategory(newCategory);
  };

  const handleCategory = () => {
    handleFilter(category);
  };

  const clearFilterCategory = () => {
    console.log("hello");
    setCategory([]);
    setCheckedItems(CategoryData.map(() => false));
    handleFilter([]);
  };

  return (
    <FormControl>
      <Stack direction="row">
        <Menu closeOnSelect={false}>
          <MenuButton as={Button} size="sm" bg="brand.10" shadow="md" px="5">
            Veiklos
          </MenuButton>
          <MenuList>
            {CategoryData.map((item, index) => {
              return (
                <MenuItem key={item.id} py="1">
                  <Checkbox
                    value={item.value}
                    onChange={(e) => handleChange(e, index)}
                    size="sm"
                    isChecked={checkedItems[index]}
                  >
                    {item.text}
                  </Checkbox>
                </MenuItem>
              );
            })}
            <Flex justify="space-between" px="4" align="center" mt="2">
              <Text
                fontSize="sm"
                fontWeight="500"
                _hover={{ cursor: "pointer", textDecoration: "underline" }}
                color="brand.31"
                onClick={clearFilterCategory}
              >
                Išvalyti
              </Text>
              <Button
                size="sm"
                bg="brand.30"
                _hover={{ bg: "brand.31" }}
                onClick={handleCategory}
              >
                Ieškoti
              </Button>
            </Flex>
          </MenuList>
        </Menu>
        <Menu closeOnSelect={false}>
          <MenuButton as={Button} size="sm" bg="brand.10" shadow="md" px="5">
            NVŠ krepšelis
          </MenuButton>
          <MenuList>
            {NVS.map((item, index) => {
              return (
                <MenuItem key={index} py="1">
                  <Checkbox
                    value={item.value}
                    // onChange={(e) => handleChange(e, index)}
                    size="sm"
                  >
                    {item.text}
                  </Checkbox>
                </MenuItem>
              );
            })}
            <Flex justify="space-between" px="4" align="center" mt="2">
              <Text
                fontSize="sm"
                fontWeight="500"
                _hover={{ cursor: "pointer", textDecoration: "underline" }}
                color="brand.31"
              >
                Išvalyti
              </Text>
              <Button size="sm" bg="brand.30" _hover={{ bg: "brand.31" }}>
                Ieškoti
              </Button>
            </Flex>
          </MenuList>
        </Menu>
        <Menu closeOnSelect={false}>
          <MenuButton as={Button} size="sm" bg="brand.10" shadow="md" px="5">
            Klasės
          </MenuButton>
          <MenuList>
            {classData.map((item, index) => {
              return (
                <MenuItem key={index} py="1">
                  <Checkbox
                    value={item.value}
                    // onChange={(e) => handleChange(e, index)}
                    size="sm"
                  >
                    {item.text}
                  </Checkbox>
                </MenuItem>
              );
            })}
            <Flex justify="space-between" px="4" align="center" mt="2">
              <Text
                fontSize="sm"
                fontWeight="500"
                _hover={{ cursor: "pointer", textDecoration: "underline" }}
                color="brand.31"
              >
                Išvalyti
              </Text>
              <Button size="sm" bg="brand.30" _hover={{ bg: "brand.31" }}>
                Ieškoti
              </Button>
            </Flex>
          </MenuList>
        </Menu>
      </Stack>
    </FormControl>
  );
}

export default Filter;
