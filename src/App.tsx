import {
  Box,
  Button,
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
import { register, unregisterAll } from "@tauri-apps/api/globalShortcut";
import { useEffect, useState } from "react";
import { SetShortcutButton } from "./components/SetShortcutButton";

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

  useEffect(() => {
    unregisterAll().then(() => {
      register(shortcut, () => setOn((on) => !on));
    });
  }, [shortcut]);

  return (
    <SimpleGrid columns={2} p={4} gap={4}>
      <Box gridColumn={"1 / span 2"}>
        <Text fontSize={"sm"} mb={2} ml={1}>
          Action
        </Text>
        <Select
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
        <Text fontSize={"sm"} mb={2} ml={1}>
          Mouse button
        </Text>
        <Select
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
        <Text fontSize={"sm"} mb={2} ml={1}>
          Interval (milliseconds)
        </Text>
        <NumberInput
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

      <SetShortcutButton isDisabled={on} onChange={setShortcut} />

      <Button
        size={"lg"}
        colorScheme="blue"
        isDisabled={on}
        onClick={() => setOn(true)}
      >
        Start ({shortcut})
      </Button>

      <Button
        size={"lg"}
        colorScheme="blue"
        isDisabled={!on}
        onClick={() => setOn(false)}
      >
        Stop ({shortcut})
      </Button>
    </SimpleGrid>
  );
}
