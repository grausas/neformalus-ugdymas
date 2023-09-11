"use client";
import React from "react";
import { CategoryData } from "@/utils/categoryData";
import { Flex, Text } from "@chakra-ui/react";

interface Props {
  category: string[];
}

export default function AppliedFilters({ category }: Props) {
  return (
    <Flex fontSize="sm" wrap="wrap">
      <Text fontWeight="500" mr="1">
        Filtrai:
      </Text>
      {category.map((item: any) => {
        return CategoryData.map((category) => {
          if (Number(item) === category.value) {
            return (
              <Text key={category.id} mr="1">
                {category.text},
              </Text>
            );
          }
        });
      })}
    </Flex>
  );
}
