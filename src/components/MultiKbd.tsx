import { Kbd, Text } from "@chakra-ui/react";
import { modifiers } from "../util/keys";

export const MultiKbd = (props: { keys: string[] }) => {
  return (
    <Text>
      {props.keys.map((key) => (
        <span key={key}>
          <Kbd>{key}</Kbd>
          {modifiers.includes(key) && " + "}
        </span>
      ))}
    </Text>
  );
};
