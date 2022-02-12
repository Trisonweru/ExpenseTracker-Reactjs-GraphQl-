import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import React from "react";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Flex,
  Heading,
  Box,
} from "@chakra-ui/react";
import { gql, useMutation } from "@apollo/client";

const CREATE_USER = gql`
  mutation CreateUser($email: String!, $password: String!) {
    createUser(email: $email, password: $password) {
      _id
      email
    }
  }
`;

export default function Signup() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(values) {
    return new Promise((resolve) => {
      createUser({
        variables: {
          email: values.email,
          password: values.pass,
        },
      });
      console.log(values);
      resolve();
    });
  }

  const [createUser, { data, error }] = useMutation(CREATE_USER);
  if (error) {
    alert(error.message);
  }
  if (data) {
    return <Navigate to="/" replace={true} />;
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
        Create Account
      </Heading>
      <Box width={"100%"}>
        <form onSubmit={handleSubmit(onSubmit)} width={"100%"}>
          <FormControl isInvalid={errors.email}>
            <FormLabel htmlFor="name">Email</FormLabel>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              {...register("email", {
                required: "This is required",
                minLength: { value: 4, message: "Minimum length should be 4" },
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.pass} width="100%">
            <FormLabel htmlFor="name">Password</FormLabel>
            <Input
              type={"password"}
              id="pass"
              placeholder="Password"
              {...register("pass", {
                required: "This is required",
                minLength: { value: 4, message: "Minimum length should be 4" },
              })}
            />
            <FormErrorMessage>
              {errors.pass && errors.pass.message}
            </FormErrorMessage>
          </FormControl>
          <Button
            mt={4}
            colorScheme="teal"
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
