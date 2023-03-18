import { CircularProgress, HStack } from "@chakra-ui/react";

export default function LoadingPage() {
  return (
    <HStack
      position="fixed"
      left={0}
      backgroundColor="blackAlpha.400"
      top={0}
      zIndex={10}
      width="100vw"
      height="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress isIndeterminate color="blue" />
    </HStack>
  );
}
