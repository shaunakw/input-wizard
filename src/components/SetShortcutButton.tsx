import {
  Box,
  Button,
  Kbd,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";

export const SetShortcutButton = (props: {
  isDisabled: boolean;
  onChange: (shortcut: string) => void;
}) => {
  const [shortcut, setShortcut] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure({
    onOpen() {
      document.addEventListener("keydown", onKeyDown);
    },
    onClose() {
      console.log("removing");
      document.removeEventListener("keydown", onKeyDown);
      setShortcut([]);
    },
  });

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    console.log(e);
  }, []);

  const save = () => {
    props.onChange(shortcut.join("+"));
    onClose();
  };

  return (
    <>
      <Button
        gridColumn={"1 / span 2"}
        isDisabled={props.isDisabled}
        onClick={onOpen}
      >
        Set shortcut
      </Button>

      <Modal size={"xs"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Type new shortcut</ModalHeader>

          <ModalBody>
            <Box
              height={10}
              px={2}
              py={1.5}
              border={"1px solid"}
              borderRadius={"md"}
              borderColor={"gray.300"}
            >
              {shortcut.map((key, i) => (
                <>
                  {i > 0 && " + "}
                  <Kbd>{key}</Kbd>
                </>
              ))}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button size={"sm"} mr={2} onClick={() => setShortcut([])}>
              Reset
            </Button>
            <Button size={"sm"} mr={2} onClick={save}>
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
