import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  IconButton,
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
import { Key, parseEvent } from "../util/keys";

export const EditKeyButton = (props: {
  isDisabled: boolean;
  onChange: (key: Key) => void;
}) => {
  const [key, setKey] = useState<Key>();

  const { isOpen, onOpen, onClose } = useDisclosure({
    onOpen() {
      window.addEventListener("keydown", onKeyDown);
    },
    onClose() {
      window.removeEventListener("keydown", onKeyDown);
      setKey(undefined);
    },
  });

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    const key = parseEvent(e);
    if (key) {
      setKey(key);
    }
  }, []);

  const save = () => {
    props.onChange(key!);
    onClose();
  };

  return (
    <>
      <IconButton
        aria-label={"Edit key"}
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
          <ModalHeader>Type new key</ModalHeader>

          <ModalBody>
            <Box
              minHeight={10}
              px={2}
              py={1.5}
              border={"1px solid"}
              borderRadius={"md"}
              borderColor={"gray.300"}
            >
              {key && <Kbd>{key.shortcut}</Kbd>}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              size={"sm"}
              mr={2}
              isDisabled={!key}
              onClick={() => setKey(undefined)}
            >
              Reset
            </Button>

            <Button size={"sm"} mr={2} isDisabled={!key} onClick={save}>
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
