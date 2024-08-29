import React from "react";
import { Container, Flex, Modal, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Ref from "@/components/challenge-ref";
import Obj from "@/components/challenge-obj";

interface challenge {
  objectives: (string | null)[];
  imageUrl: string;
  isActive: boolean;
}
export default function Challenge({ objectives, imageUrl }: challenge) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        size="auto"
        title="Current Challenge"
      >
        <Flex gap="md" mt="md">
          <Obj value={objectives ?? ["no objective"]} />
          <Ref img={imageUrl} />
        </Flex>
      </Modal>
      <Button onClick={open}>View Challenge</Button>
    </>
  );
}
