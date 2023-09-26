import { ActivitiesData } from "@/utils/activitiesData";
import { Flex, Text } from "@chakra-ui/react";

interface Props {
  activities?: string[];
}

export default function AppliedFilters({ activities }: Props) {
  return (
    <Flex fontSize="sm" wrap="wrap" color="brand.40">
      <Text fontWeight="500" mr="1">
        Filtrai:
      </Text>
      {activities?.map((item: any) => {
        return ActivitiesData.map((activity) => {
          if (Number(item) === activity.value) {
            return (
              <Text key={activity.id} mr="1">
                {activity.text},
              </Text>
            );
          }
        });
      })}
    </Flex>
  );
}
