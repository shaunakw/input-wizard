import {
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
import { isRegistered, register } from "@tauri-apps/api/globalShortcut";
import { useEffect, useState } from "react";

export const MouseTab = (props: { onChange: (on: boolean) => void }) => {
  const [on, setOn] = useState(false);
  const [millis, setMillis] = useState(100);
  const [button, setButton] = useState("Left");

  useEffect(() => {
    if (on) {
      invoke("start_click", { millis, button });
    } else {
      invoke("stop_click");
    }
    props.onChange(on);
  }, [on]);

  useEffect(() => {
    register("Ctrl+L", () => setOn(!on));
  }, []);

  useEffect(() => {
    register("`", () => setI(i + 1));
  }, []);

  const [i, setI] = useState(0);
  const [j, setJ] = useState(false);
  const [k, setK] = useState(false);

  const reload = () => {
    isRegistered("`").then(setJ);
    isRegistered("Ctrl+L").then(setK);
  };

  return (
    <SimpleGrid columns={2} gap={4}>
      <div>
        <Text fontSize={"sm"} mb={2} ml={1}>
          Click interval (milliseconds)
        </Text>
        <NumberInput
          defaultValue={millis}
          min={1}
          isInvalid={isNaN(millis)}
          isDisabled={on}
          onChange={(_, n) => setMillis(n)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </div>

      <div>
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
      </div>

      <Button
        size={"lg"}
        colorScheme="blue"
        isDisabled={on}
        onClick={() => {
          if (!isNaN(millis)) {
            setOn(true);
          }
        }}
      >
        Start
      </Button>

      <Button
        size={"lg"}
        colorScheme="blue"
        isDisabled={!on}
        onClick={() => setOn(false)}
      >
        Stop
      </Button>
      <Button size={"lg"} colorScheme="blue" isDisabled={!on} onClick={reload}>
        Reload
      </Button>
      <p>i: {i}</p>
      <p>` enabled: {j}</p>
      <p>Ctrl+L enabled: {k}</p>
    </SimpleGrid>
  );
};
