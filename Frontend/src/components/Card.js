import React from "react";
import { Box, Text, Stack } from "@chakra-ui/react";

function Card(props) {
  const { amount, date, title, description } = props;

  const dt = new Date(date);

  return (
    <Box
      p={4}
      display={{ md: "flex" }}
      maxWidth="32rem"
      borderWidth={1}
      margin={2}
      background="rgba(0,0,0,0.1)"
      borderRadius={"5px"}
    >
      <Stack
        align={{ base: "center", md: "stretch" }}
        textAlign={{ base: "center", md: "left" }}
        mt={{ base: 4, md: 0 }}
        ml={{ md: 6 }}
      >
        <Text
          fontWeight="bold"
          textTransform="uppercase"
          fontSize="lg"
          letterSpacing="wide"
        >
          {title}
        </Text>
        <Text fontWeight="bold" fontSize="sm" letterSpacing="wide" color="blue">
          Amount: ${amount}
        </Text>

        <Text my={2} color="gray.500">
          {description}
        </Text>
        <Text my={2} color="gray.500" fontSize="12px">
          ~ {dt.toDateString()}
        </Text>
      </Stack>
    </Box>
  );
}

export default Card;
