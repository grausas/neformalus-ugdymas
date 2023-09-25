import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Image from "next/image";

const GroupTabs = () => {
  return (
    <Tabs>
      <TabList w="100%" justifyContent="space-between">
        <Tab>
          <Image
            src="/neformalus_svietimas.svg"
            alt=""
            width={30}
            height={30}
          />
        </Tab>
        <Tab>
          <Image
            src="/vaiku_jaunimo_klubai.svg"
            alt=""
            width={30}
            height={30}
          />
        </Tab>
        <Tab>
          <Image
            src="/atviri_jaunimo_centrai.svg"
            alt=""
            width={30}
            height={30}
          />
        </Tab>
        <Tab>
          <Image src="/nvo_istaigos.svg" alt="" width={30} height={30} />
        </Tab>
        <Tab>
          <Image src="/vaiku_stovyklos.svg" alt="" width={30} height={30} />
        </Tab>
      </TabList>
    </Tabs>
  );
};

export default GroupTabs;
