import React, { useEffect, useState } from "react";
import { Checkbox, FormControl } from "@chakra-ui/react";
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
      {CategoryData.map((item, index) => {
        return (
          <Checkbox
            mr="2"
            key={item.id}
            value={item.value}
            onChange={(e) => handleChange(e, index)}
          >
            {item.text}
          </Checkbox>
        );
      })}
    </FormControl>
  );
}

export default Filter;
