import { Kbd, Text } from "@chakra-ui/react";
import { modifiers } from "../util/keys";

export const ShortcutText = (props: { shortcut: string[] }) => {
  return (
    <Text>
      {props.shortcut.map((key) => (
        <span key={key}>
          <Kbd>{key}</Kbd>
          {modifiers.includes(key) && " + "}
        </span>
      ))}
    </Text>
  );
};
