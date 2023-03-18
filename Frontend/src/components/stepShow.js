import React, { useState } from "react";
import { Button, Text } from "@chakra-ui/react";

export default function StepShow({ steps }) {
  const [show, setShow] = useState(!steps.length > 3);
  const array = show ? steps : steps.slice(0, 3);

  const handleShow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShow(!show);
  };

  return (
    <>
      {array.map((step, index) => (
        <Text fontSize="md" key={`step-${index}`}>
          • {step}
        </Text>
      ))}
      <Button size="sm" onClick={handleShow}>
        {show ? "Show More" : "Show Less"}
      </Button>
    </>
  );
}
