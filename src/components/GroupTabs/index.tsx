import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Image from "next/image";
import { GroupData } from "@/utils/groupData";

type Props = {
  changeGroup: (e: number) => void;
};

const GroupTabs = ({ changeGroup }: Props) => {
  return (
    <Tabs isFitted onChange={(e) => changeGroup(e + 1)}>
      <TabPanels>
        {GroupData.map((group) => (
          <TabPanel
            key={group.id}
            p="0"
            pt="1"
            m="0"
            fontSize="sm"
            fontWeight="500"
          >
            {group.text}
          </TabPanel>
        ))}
      </TabPanels>
      <TabList>
        {GroupData.map((group) => (
          <Tab key={group.id}>
            <Image src={group.url} alt={group.text} width={30} height={30} />
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
};

export default GroupTabs;
