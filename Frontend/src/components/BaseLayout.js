import React from "react";
import PageTransition from "../components/Transition";
import { Flex, Box } from "@chakra-ui/react";

const BaseLayout = (props) => {
  return (
    <>
      <PageTransition>
        <Flex
          direction="column"
          alignItems="center"
          className="base-page"
          {...props}
        >
          <Box w="100%" m="0 auto">
            {props.children}
          </Box>
        </Flex>
      </PageTransition>
    </>
  );
};

export default BaseLayout;
