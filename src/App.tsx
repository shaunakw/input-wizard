import {
  Box,
  Button,
  Flex,
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
import { useEffect, useState } from "react";
import { EditShortcutButton } from "./components/EditShortcutButton";
import { ShortcutText } from "./components/ShortcutText";

export default function App() {
  const [on, setOn] = useState(false);

  const [type, setType] = useState("click");

  const [millis, setMillis] = useState(100);
  const [button, setButton] = useState("Left");

  const [shortcut, setShortcut] = useState("`");

  useEffect(() => {
    if (on) {
      if (type === "click") {
        invoke("start_click", { millis, button });
      }
    } else {
      invoke("stop");
    }
  }, [on]);

  return (
    <SimpleGrid columns={2} p={4} gap={4}>
      <Box gridColumn={"1 / span 2"}>
        <Text fontSize={"xs"} mb={2} ml={1}>
          Action
        </Text>
        <Select
          size={"sm"}
          defaultValue={type}
          isDisabled={on}
          onChange={(e) => setType(e.target.value)}
        >
          <option value={"click"}>Mouse click</option>
          <option value={"key_press"}>Key press</option>
          <option value={"key_hold"}>Key hold</option>
        </Select>
      </Box>

      <Box>
        <Text fontSize={"xs"} mb={1} ml={1}>
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

      <Box>
        <Text fontSize={"xs"} mb={1} ml={1}>
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

      <Flex gridColumn={"1 / span 2"} align="center">
        <EditShortcutButton
          isDisabled={on}
          onSelect={setShortcut}
          onShortcut={() => setOn((on) => !on)}
        />
        <Text fontSize={"sm"} ml={4} mr={2}>
          Shortcut:
        </Text>
        <ShortcutText shortcut={shortcut.split("+")} />
      </Flex>

      <Button colorScheme="blue" isDisabled={on} onClick={() => setOn(true)}>
        Start
      </Button>

      <Button colorScheme="blue" isDisabled={!on} onClick={() => setOn(false)}>
        Stop
      </Button>
    </SimpleGrid>
  );
}
