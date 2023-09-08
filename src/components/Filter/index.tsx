import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { CategoryData } from "@/utils/categoryData";

type FilterProps = {
  handleFilter: (category: string[]) => void;
};

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
      <Menu closeOnSelect={false}>
        <MenuButton as={Button} size="sm" bg="brand.20">
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
    </FormControl>
  );
}

export default Filter;
