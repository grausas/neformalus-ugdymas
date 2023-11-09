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
  handleFilter: (
    activity: string[],
    nvsKrepse?: number | undefined,
    classFilter?:
      | { name?: string | undefined; value?: number | undefined }[]
      | undefined
  ) => void;
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
  { value: 1, text: "1-4 klasė", name: "KLASE_1_4" },
  { value: 1, text: "5-8 klasė", name: "KLASE_5_8" },
  { value: 1, text: "9-12 klasė", name: "KLASE_9_12" },
];

function Filter({ handleFilter, loading, group, view }: FilterProps) {
  const [activity, setActivity] = useState<string[]>([]);
  const [nvsKrepse, setNvsKrepse] = useState<number | undefined>();
  const [classFilter, setClassFilter] = useState<
    { name?: string; value?: number }[]
  >([]);
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    ActivitiesData.map(() => false)
  );
  const [activityGroup, setActivityGroup] = useState<__esri.Graphic[]>();
  const [domains, setDomains] = useState();

  useEffect(() => {
    if (!view) return;
    async function queryData() {
      const results = await queryActivityGroupTable();
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
    // @ts-ignore
    const filteredData = domains[0].domain.codedValues.filter(
      (item: { code: number }) => {
        return results.some(
          (result) => result.attributes.VEIKLAID === item.code
        );
      }
    );
    return filteredData;
  }, [activityGroup, domains, group]);

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

  const handleChangeNvsKrepse = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);
    const checked = event.target.checked;
    if (checked) {
      setNvsKrepse(value);
    } else {
      setNvsKrepse(undefined);
    }
  };

  // filter by classData
  const handleFilterByClass = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value, name } = event.target;
    if (checked) {
      setClassFilter((prevClassFilter) => [
        ...prevClassFilter,
        { name, value: Number(value) },
      ]);
    } else {
      setClassFilter((prevClassFilter) =>
        prevClassFilter.filter((item) => item.name !== name)
      );
    }
  };

  const handleActivities = () => {
    handleFilter(activity, nvsKrepse, classFilter);
  };

  const handleNvsKrepse = () => {
    handleFilter(activity, nvsKrepse, classFilter);
  };
  const handleClasses = () => {
    handleFilter(activity, nvsKrepse, classFilter);
  };

  const clearFilterActivity = () => {
    setActivity([]);
    setCheckedItems(ActivitiesData.map(() => false));
    handleFilter([]);
  };

  const clearNvsKrepse = () => {
    setNvsKrepse(undefined);
    handleFilter([]);
  };

  const clearClass = () => {
    setClassFilter([]);
    handleFilter([]);
  };

  useEffect(() => {
    clearFilterActivity();
    clearNvsKrepse();
  }, [group]);

  return (
    <FormControl>
      <Stack direction="row">
        <Menu closeOnSelect={false}>
          <MenuButton
            as={Button}
            size="sm"
            bg="brand.10"
            color="brand.21"
            px={{ base: "3", md: "5" }}
            display={filteredActivitiesData.length > 0 ? "block" : "none"}
            rightIcon={<TriangleDownIcon boxSize="2" color="brand.50" />}
            _active={{
              borderColor: "brand.21",
              bg: "brand.10",
              boxShadow: "md",
            }}
          >
            Veiklos
          </MenuButton>
          <MenuList maxH={{ base: "50vh", md: "600px" }} overflow="auto">
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
        {group === 1 && (
          <Menu closeOnSelect={false}>
            <MenuButton
              as={Button}
              size="sm"
              bg="brand.10"
              color="brand.21"
              px="5"
              rightIcon={<TriangleDownIcon boxSize="2" color="brand.50" />}
              _active={{
                borderColor: "brand.21",
                bg: "brand.10",
                boxShadow: "md",
              }}
            >
              NVŠ krepšelis
            </MenuButton>
            <MenuList>
              {NVS.map((item, index) => {
                return (
                  <MenuItem key={index} py="1">
                    <Checkbox
                      value={item.value}
                      onChange={handleChangeNvsKrepse}
                      size="sm"
                      isChecked={nvsKrepse === item.value}
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
                  onClick={clearNvsKrepse}
                >
                  Išvalyti
                </Text>
                <Button
                  size="sm"
                  bg="brand.30"
                  _hover={{ bg: "brand.31" }}
                  onClick={handleNvsKrepse}
                >
                  Ieškoti
                </Button>
              </Flex>
            </MenuList>
          </Menu>
        )}
        {group === 1 && (
          <Menu closeOnSelect={false}>
            <MenuButton
              as={Button}
              size="sm"
              bg="brand.10"
              px="5"
              color="brand.21"
              rightIcon={<TriangleDownIcon boxSize="2" color="brand.50" />}
              _active={{
                borderColor: "brand.21",
                bg: "brand.10",
                boxShadow: "md",
              }}
            >
              Klasės
            </MenuButton>
            <MenuList>
              {classData.map((item, index) => {
                return (
                  <MenuItem key={index} py="1">
                    <Checkbox
                      value={item.value}
                      name={item.name}
                      onChange={(e) => handleFilterByClass(e)}
                      size="sm"
                      isChecked={classFilter.some(
                        (filter) => filter.name === item.name
                      )}
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
                  onClick={clearClass}
                >
                  Išvalyti
                </Text>
                <Button
                  size="sm"
                  bg="brand.30"
                  _hover={{ bg: "brand.31" }}
                  onClick={handleClasses}
                >
                  Ieškoti
                </Button>
              </Flex>
            </MenuList>
          </Menu>
        )}
      </Stack>
    </FormControl>
  );
}

export default Filter;
