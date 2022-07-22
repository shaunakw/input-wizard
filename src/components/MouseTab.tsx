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
import { useState } from "react";

export const MouseTab = (props: { onChange: (on: boolean) => void }) => {
  const start = () => {
    invoke("start_click", { millis, button });
    setOn(true);
    props.onChange(true);
  };

  const stop = () => {
    invoke("stop_click");
    setOn(false);
    props.onChange(false);
  };

  const [on, setOn] = useState(false);
  const [millis, setMillis] = useState(100);
  const [button, setButton] = useState("Left");

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

      <Button size={"lg"} colorScheme="blue" isDisabled={on} onClick={start}>
        Start
      </Button>
      <Button size={"lg"} colorScheme="blue" isDisabled={!on} onClick={stop}>
        Stop
      </Button>
    </SimpleGrid>
  );
};
