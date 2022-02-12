import React, { useContext } from "react";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Flex,
  Heading,
  Box,
  Textarea,

} from "@chakra-ui/react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import AuthContext from "./components/context/context";

const CREATE_EXPENSE = gql`
  mutation CreateExpense(
    $userId: ID!
    $title: String!
    $description: String!
    $amount: String!
  ) {
    createExpense(
      userId: $userId
      title: $title
      description: $description
      amount: $amount
    ) {
      title
      amount
    }
  }
`;

function Expense() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const context = useContext(AuthContext);
  function onSubmit(values) {
    return new Promise((resolve) => {
      createExpense({
        variables: {
          title: values.title,
          description: values.description,
          amount: values.amount,
          userId: context.userId,
        },
      });
      resolve();
    });
  }
  const [createExpense, { error }] = useMutation(CREATE_EXPENSE);
  if (error) {
    alert("Could not add expense!");
    return;
  }
  return (
    <Flex
      display={"flex"}
      flexDir="column"
      justify="start"
      align="center"
      w="50%"
      margin={"0 auto"}
      height="100vh"
      pt={10}
    >
      <Heading as="h3" align="center" m={"20px"}>
        Add Expense
      </Heading>
      <Box width={"100%"}>
        <form onSubmit={handleSubmit(onSubmit)} width={"100%"}>
          <FormControl isInvalid={errors.title}>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input
              type="text"
              id="title"
              placeholder="Title"
              {...register("title", {
                required: "This is required",
                minLength: { value: 4, message: "Minimum length should be 4" },
              })}
            />
            <FormErrorMessage>
              {errors.title && errors.title.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.amount} width="100%">
            <FormLabel htmlFor="amount">Amount</FormLabel>
            <Input
              type={"text"}
              id="amount"
              placeholder="Amount"
              {...register("amount", {
                required: "This is required",
                minLength: { value: 1, message: "Minimum length should be 1" },
              })}
            />
            <FormErrorMessage>
              {errors.amount && errors.amount.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.description} width="100%">
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea
              type={"text"}
              id="description"
              placeholder="Description"
              {...register("description", {
                required: "This is required",
                minLength: { value: 4, message: "Minimum length should be 4" },
              })}
            />
            <FormErrorMessage>
              {errors.description && errors.description.message}
            </FormErrorMessage>
          </FormControl>
          <Button
            mt={4}
            colorScheme="blue"
            isLoading={isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Box>
    </Flex>
  );
}

export default Expense;
