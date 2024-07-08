import React from 'react'
import { Container, Flex } from "@mantine/core";
import Mountain from "../../public/digital-art-beautiful-mountains.jpg";
import Ref from "@/components/challenge-ref";
import Obj from "@/components/challenge-obj";
function challenge() {
  return (
    <>
      <Container fluid>
        <Flex justify="center" gap="md" align="center" mt="md">
          <Obj value="very good" />
          <Ref img={Mountain.src} />
        </Flex>
      </Container>

    </>

  )
}

export default challenge
