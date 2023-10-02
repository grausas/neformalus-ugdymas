import { useState } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tooltip,
} from "@chakra-ui/react";
import Image from "next/image";
import { GroupData } from "@/utils/groupData";

type Props = {
  changeGroup: (e: number) => void;
  loading: boolean;
};

const GroupTabs = ({ changeGroup, loading }: Props) => {
  const [selectedTab, setSelectedTab] = useState(1);

  return (
    <Tabs
      isFitted
      onChange={(e) => {
        changeGroup(e + 1);
        setSelectedTab(e + 1);
      }}
      variant="enclosed"
      mt="2"
    >
      <TabList borderColor="brand.11">
        {GroupData.map((group) => (
          <Tooltip label={group.text} key={group.id}>
            <Tab
              borderBottom="none"
              bg={selectedTab === group.id ? "brand.10" : "transparent"}
              isDisabled={loading}
            >
              <Image src={group.url} alt={group.text} width={30} height={30} />
            </Tab>
          </Tooltip>
        ))}
      </TabList>
      <TabPanels>
        {GroupData.map((group) => (
          <TabPanel
            key={group.id}
            p="0"
            py="1"
            m="0"
            fontSize="sm"
            fontWeight="500"
            pl="2"
            border="1px solid"
            borderColor="brand.11"
            bg={selectedTab === group.id ? "brand.10" : "transparent"}
          >
            {group.text}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default GroupTabs;
