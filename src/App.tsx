import {
  Box,
  Button,
  Flex,
  Kbd,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api";
import { unregisterAll, register } from "@tauri-apps/api/globalShortcut";
import { useEffect, useState } from "react";
import { Store } from "tauri-plugin-store-api";

import { EditKeyButton } from "./components/EditKeyButton";
import { EditShortcutButton } from "./components/EditShortcutButton";
import { MultiKbd } from "./components/MultiKbd";
import { Key } from "./util/keys";

type ActionType = "click" | "keypress" | "keydown";

const store = new Store(".settings.dat");

export default function App() {
  const [on, setOn] = useState(false);
  const [type, setType] = useState<ActionType>("click");

  const [key, setKey] = useState<Key>();
  const [millis, setMillis] = useState(100);
  const [button, setButton] = useState("Left");

  const [shortcut, setShortcut] = useState<string>();

  const onShortcutChange = async (shortcut: string) => {
    await unregisterAll();
    await register(shortcut, () => setOn((on) => !on));
    await store.set("shortcut", shortcut);
    setShortcut(shortcut);
  };

  useEffect(() => {
    store.get("shortcut").then((shortcut) => {
      if (shortcut) {
        onShortcutChange(shortcut as string);
      }
    });
  }, []);

  useEffect(() => {
    if (on) {
      if (type === "click") {
        if (!isNaN(millis)) {
          invoke("start_click", { millis, button });
        }
      } else if (type === "keypress") {
        if (!isNaN(millis) && key) {
          invoke("start_keypress", { millis, key: key.rust[0] });
        }
      }
    } else {
      invoke("stop");
    }
  }, [on]);

  return (
    <SimpleGrid columns={2} px={4} py={3} columnGap={4} rowGap={3}>
      <Box gridColumn={"1 / span 2"}>
        <Text fontSize={"xs"} mb={1} ml={0.5}>
          Action
        </Text>
        <Select
          size={"sm"}
          defaultValue={type}
          isDisabled={on}
          onChange={(e) => setType(e.target.value as ActionType)}
        >
          <option value={"click"}>Mouse click</option>
          <option value={"keypress"}>Key press</option>
          <option value={"keydown"}>Key hold</option>
        </Select>
      </Box>

      {type === "click" ? (
        <Box>
          <Text fontSize={"xs"} mb={1} ml={0.5}>
            Mouse button
          </Text>
          <Select
            size={"sm"}
            defaultValue={button}
            isDisabled={on}
            onChange={(e) => setButton(e.target.value)}
          >
            <option value={"Left"}>Left</option>
            <option value={"Right"}>Right</option>
            <option value={"Middle"}>Middle</option>
          </Select>
        </Box>
      ) : (
        <Box>
          <Text fontSize={"xs"} mb={1} ml={0.5}>
            Key
          </Text>
          <Flex align={"center"}>
            <EditKeyButton isDisabled={on} onChange={setKey} />
            {key ? <Kbd>{key.shortcut}</Kbd> : "None"}
          </Flex>
        </Box>
      )}

      <Box>
        <Text fontSize={"xs"} mb={1} ml={0.5}>
          Interval (milliseconds)
        </Text>
        <NumberInput
          size={"sm"}
          defaultValue={millis}
          min={1}
          isInvalid={isNaN(millis)}
          isDisabled={on}
          onChange={(_, n) => setMillis(isNaN(n) ? 1 : n)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Box>

      <Box gridColumn={"1 / span 2"}>
        <Text fontSize={"xs"} mb={1} ml={0.5}>
          Shortcut
        </Text>
        <Flex align={"center"}>
          <EditShortcutButton isDisabled={on} onChange={onShortcutChange} />
          {shortcut ? <MultiKbd keys={shortcut.split("+")} /> : "None"}
        </Flex>
      </Box>

      <Button colorScheme="blue" isDisabled={on} onClick={() => setOn(true)}>
        Start
      </Button>

      <Button colorScheme="blue" isDisabled={!on} onClick={() => setOn(false)}>
        Stop
      </Button>
    </SimpleGrid>
  );
}
