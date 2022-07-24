import {
  Box,
  Button,
  CircularProgress,
  Kbd,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { listen } from "@tauri-apps/api/event";
import { register, unregisterAll } from "@tauri-apps/api/globalShortcut";
import { useState } from "react";

import keymap from "../keymap.json";

type Key = keyof typeof keymap;

const modifiers = ["Ctrl", "Meta", "Alt", "Shift"];

export const SetShortcutButton = (props: {
  isDisabled: boolean;
  onSelect: (shortcut: string) => void;
  onShortcut: () => void;
}) => {
  const [shortcut, setShortcut] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [unlisten, setUnlisten] = useState<() => void>();

  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose() {
      unlisten?.();
      setShortcut([]);
    },
  });

  const open = async () => {
    const unlisten = await listen("keydown", (e) => {
      const key = keymap[e.payload as Key];
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
    });
    setUnlisten(() => unlisten);
    onOpen();
  };

  const save = async () => {
    if (!loading) {
      setLoading(true);
      try {
        await unregisterAll();
        console.log(shortcut.join("+"));
        await register(shortcut.join("+"), props.onShortcut);
        props.onSelect(shortcut.join("+"));
        onClose();
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
  };

  return (
    <Box gridColumn={"1 / span 2"}>
      <Button width={"100%"} isDisabled={props.isDisabled} onClick={open}>
        Set shortcut
      </Button>

      <Modal
        size={"xs"}
        autoFocus={false}
        returnFocusOnClose={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
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
              {shortcut.map((key) => (
                <span key={key}>
                  <Kbd>{key}</Kbd>
                  {modifiers.includes(key) && " + "}
                </span>
              ))}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              size={"sm"}
              mr={2}
              isDisabled={shortcut.length === 0 || loading}
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
              <Box as="span" opacity={loading ? 0 : 1}>
                Save
              </Box>
              {loading && (
                <CircularProgress
                  isIndeterminate
                  size={4}
                  color={"gray"}
                  position="absolute"
                />
              )}
            </Button>

            <Button size={"sm"} colorScheme={"red"} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
