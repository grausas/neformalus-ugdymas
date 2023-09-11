import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
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

  useEffect(() => {
    handleFilter(category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return (
    <FormControl>
      <Stack direction="row">
        <Menu closeOnSelect={false}>
          <MenuButton as={Button} size="sm" bg="brand.10">
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
                  >
                    {item.text}
                  </Checkbox>
                </MenuItem>
              );
            })}
          </MenuList>
        </Menu>
        <Menu closeOnSelect={false}>
          <MenuButton as={Button} size="sm" bg="brand.10">
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
          </MenuList>
        </Menu>
        <Menu closeOnSelect={false}>
          <MenuButton as={Button} size="sm" bg="brand.10">
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
          </MenuList>
        </Menu>
      </Stack>
    </FormControl>
  );
}

export default Filter;
