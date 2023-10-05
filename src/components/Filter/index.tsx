import React, { useState, useEffect, useMemo } from "react";
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
import { TriangleDownIcon } from "@chakra-ui/icons";
import { ActivitiesData } from "@/utils/activitiesData";
import { queryActivityGroupTable, queryDomains } from "@/helpers/queryDomains";

type FilterProps = {
  handleFilter: (activity: string[]) => void;
  loading: boolean;
  group?: number;
  view?: __esri.MapView;
};

type ItemType = {
  code: number;
  name: string;
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

function Filter({ handleFilter, loading, group, view }: FilterProps) {
  const [activity, setActivity] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    ActivitiesData.map(() => false)
  );
  const [activityGroup, setActivityGroup] = useState<__esri.Graphic[]>();
  const [domains, setDomains] = useState();

  useEffect(() => {
    if (!view) return;
    async function queryData() {
      const results = await queryActivityGroupTable();
      // console.log("results", results);
      setActivityGroup(results);
      const domainsResults = await queryDomains();
      setDomains(domainsResults);
    }

    queryData();
  }, [view]);

  const filteredActivitiesData: any = useMemo(() => {
    if (!activityGroup || !domains) return [];
    const results = activityGroup.filter(
      (item) => item.attributes.VEIKLAGRID === group
    );
    console.log("results", results);
    console.log("domains", domains);
    // @ts-ignore
    const filteredData = domains[0].domain.codedValues.filter(
      (item: { code: number }) => {
        return results.some(
          (result) => result.attributes.VEIKLAID === item.code
        );
      }
    );
    console.log("filteredData", filteredData);
    return filteredData;
  }, [activityGroup, domains, group]);

  console.log("filteredActivitiesData", filteredActivitiesData);

  console.log("filter group", group);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = event.target.checked;
    setCheckedItems(newCheckedItems);
    const newActivity = event.target.checked
      ? [...activity, event.target.value]
      : activity.filter((item) => item !== event.target.value);
    setActivity(newActivity);
  };

  const handleActivities = () => {
    handleFilter(activity);
  };

  const clearFilterActivity = () => {
    setActivity([]);
    setCheckedItems(ActivitiesData.map(() => false));
    handleFilter([]);
  };

  return (
    <FormControl>
      <Stack direction="row">
        <Menu closeOnSelect={false}>
          <MenuButton
            as={Button}
            size="sm"
            bg="brand.10"
            color="brand.21"
            px="5"
            display={filteredActivitiesData.length > 0 ? "block" : "none"}
            rightIcon={<TriangleDownIcon boxSize="2" color="brand.50" />}
            _active={{ borderColor: "brand.21", bg: "brand.10" }}
          >
            Veiklos
          </MenuButton>
          <MenuList>
            {filteredActivitiesData.map((item: ItemType, index: number) => {
              return (
                <MenuItem key={item.code} py="1">
                  <Checkbox
                    value={item.code}
                    onChange={(e) => handleChange(e, index)}
                    size="sm"
                    isChecked={checkedItems[index]}
                    color="brand.40"
                    isDisabled={loading}
                  >
                    {item.name}
                  </Checkbox>
                </MenuItem>
              );
            })}
            <Flex justify="space-between" px="4" align="center" mt="2">
              <Text
                fontSize="sm"
                fontWeight="600"
                _hover={{ cursor: "pointer", textDecoration: "underline" }}
                color="brand.31"
                onClick={clearFilterActivity}
              >
                Išvalyti
              </Text>
              <Button
                size="sm"
                bg="brand.30"
                _hover={{ bg: "brand.31" }}
                onClick={handleActivities}
              >
                Ieškoti
              </Button>
            </Flex>
          </MenuList>
        </Menu>
        <Menu closeOnSelect={false}>
          <MenuButton
            as={Button}
            size="sm"
            bg="brand.10"
            color="brand.21"
            px="5"
            rightIcon={<TriangleDownIcon boxSize="2" color="brand.50" />}
            _active={{ borderColor: "brand.21", bg: "brand.10" }}
          >
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
                fontWeight="600"
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
          <MenuButton
            as={Button}
            size="sm"
            bg="brand.10"
            px="5"
            color="brand.21"
            rightIcon={<TriangleDownIcon boxSize="2" color="brand.50" />}
            _active={{ borderColor: "brand.21", bg: "brand.10" }}
          >
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
                fontWeight="600"
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
