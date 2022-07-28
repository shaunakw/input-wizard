import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";

import { parseEvent, modifiers } from "../util/keys";
import { MultiKbd } from "./MultiKbd";

export const EditShortcutButton = (props: {
  isDisabled: boolean;
  onChange: (shortcut: string) => void | Promise<void>;
}) => {
  const [shortcut, setShortcut] = useState<string[]>([]);

  const { isOpen, onOpen, onClose } = useDisclosure({
    onOpen() {
      window.addEventListener("keydown", onKeyDown);
    },
    onClose() {
      window.removeEventListener("keydown", onKeyDown);
      setShortcut([]);
    },
  });

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    const key = parseEvent(e)?.shortcut;
    if (key) {
      setShortcut((shortcut) => {
        const canEdit =
          shortcut.length === 0 ||
          modifiers.includes(shortcut[shortcut.length - 1]);
        const isValid = !modifiers.includes(key) || !shortcut.includes(key);
        if (canEdit && isValid) {
          return [...shortcut, key];
        }
        return shortcut;
      });
    }
  }, []);

  const save = async () => {
    try {
      await props.onChange(shortcut.join("+"));
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <IconButton
        aria-label={"Edit shortcut"}
        size={"sm"}
        mr={4}
        icon={<EditIcon />}
        isDisabled={props.isDisabled}
        onClick={onOpen}
      />

      <Modal
        size={"xs"}
        autoFocus={false}
        returnFocusOnClose={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent m={"auto"}>
          <ModalHeader>Type new shortcut</ModalHeader>

          <ModalBody>
            <Box
              minHeight={10}
              px={2}
              py={1.5}
              border={"1px solid"}
              borderRadius={"md"}
              borderColor={"gray.300"}
            >
              <MultiKbd keys={shortcut} />
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              size={"sm"}
              mr={2}
              isDisabled={shortcut.length === 0}
              onClick={() => setShortcut([])}
            >
              Reset
            </Button>

            <Button
              size={"sm"}
              mr={2}
              isDisabled={
                shortcut.length === 0 ||
                modifiers.includes(shortcut[shortcut.length - 1])
              }
              onClick={save}
            >
              Save
            </Button>

            <Button size={"sm"} colorScheme={"red"} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
