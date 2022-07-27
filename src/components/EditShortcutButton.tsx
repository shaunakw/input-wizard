import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  CircularProgress,
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

import keymap from "../keymap.json";
import { ShortcutText } from "./ShortcutText";

type Key = keyof typeof keymap;

const modifiers = ["Ctrl", "Meta", "Alt", "Shift"];

export const EditShortcutButton = (props: {
  isDisabled: boolean;
  onSelect: (shortcut: string) => void | Promise<void>;
}) => {
  const [shortcut, setShortcut] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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
    const key = keymap[e.code as Key];
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
    if (!loading) {
      setLoading(true);
      try {
        await props.onSelect(shortcut.join("+"));
        onClose();
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
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
              <ShortcutText shortcut={shortcut} />
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
    </>
  );
};
