import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import { KeyboardTab } from "./components/KeyboardTab";
import { MouseTab } from "./components/MouseTab";

export default function App() {
  const [mouseOn, setMouseOn] = useState(false);
  const [keyboardOn, setKeyboardOn] = useState(false);

  return (
    <Tabs>
      <TabList>
        <Tab isDisabled={keyboardOn}>Mouse</Tab>
        <Tab isDisabled={mouseOn}>Keyboard</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <MouseTab onChange={setMouseOn} />
        </TabPanel>
        <TabPanel>
          <KeyboardTab onChange={setKeyboardOn} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
