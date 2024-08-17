import React from "react";
import { List, Container, Flex, Modal, Button } from "@mantine/core";
import Mountain from "../../public/digital-art-beautiful-mountains.jpg";
import { useDisclosure } from "@mantine/hooks";
import Ref from "@/components/challenge-ref";
import Obj from "@/components/challenge-obj";

interface challenge {
  objectives: (string | null)[];
  imageUrl: string;
  isActive: boolean;
}
export default function Challenge({ objectives, imageUrl, isActive }: challenge) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Container fluid>
        <Modal
          opened={opened}
          onClose={close}
          withCloseButton={false}
          size="100%"
        >
          <Flex justify="center" gap="md" align="center" mt="md">
            <Obj value={objectives ?? ["no objective"]} />
            <Ref img={imageUrl} closeButton={close} />
          </Flex>
        </Modal>
      </Container>
      <Button onClick={open}>View Challenge</Button>
    </>
  );
}

