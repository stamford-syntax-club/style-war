import React from "react";
import { Container, Flex, Modal, Button } from "@mantine/core";
import Mountain from "../../public/digital-art-beautiful-mountains.jpg";
import { useDisclosure } from "@mantine/hooks";
import Ref from "@/components/challenge-ref";
import Obj from "@/components/challenge-obj";

export default function Challenge() {
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
            <Obj value="very good" />
            <Ref img={Mountain.src} closeButton={close} />
          </Flex>
        </Modal>
      </Container>
      <Button onClick={open}>View Challenge</Button>
    </>
  );
}

