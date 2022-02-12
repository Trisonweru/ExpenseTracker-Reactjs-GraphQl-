import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import React, { useState } from "react";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Flex,
  Heading,
  Box,
} from "@chakra-ui/react";
import { gql, useMutation } from "@apollo/client";
import StripeCheckout from "react-stripe-checkout";

const CREATE_USER = gql`
  mutation CreateUser($email: String!, $password: String!) {
    createUser(email: $email, password: $password) {
      _id
      email
    }
  }
`;

export default function Donate() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const [amount, setAmount] = useState();
  function onSubmit(values) {
    return new Promise((resolve) => {
      console.log(values);
      resolve();
    });
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
        Donate
      </Heading>
      <Box width={"100%"}>
        <form onSubmit={handleSubmit(onSubmit)} width={"100%"}>
          <FormControl isInvalid={errors.email}>
            <FormLabel htmlFor="amount">Email</FormLabel>
            <Input
              type="text"
              id="amount"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              {...register("amount", {
                required: "This is required",
                minLength: { value: 1, message: "Minimum length should be 1" },
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
        </form>

        <Flex marginTop={"10px"}>
          {" "}
          <StripeCheckout
            stripeKey="pk_test_4TbuO6qAW2XPuce1Q6ywrGP200NrDZ2233"
            amount={amount * 100}
            name="Donation"
          />
        </Flex>
      </Box>
    </Flex>
  );
}
