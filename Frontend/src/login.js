import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
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
} from "@chakra-ui/react";
import { gql, useLazyQuery } from "@apollo/client";
import AuthContext from "./components/context/context";

const LOGIN_USER = gql`
  query Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      userId
      token
    }
  }
`;

export default function Signup() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const context = useContext(AuthContext);
  // let history = useNavigate();

  function onSubmit(values) {
    return new Promise((resolve) => {
      loginUser({
        variables: { email: values.email, password: values.pass },
      });
      resolve();
    });
  }
  const [loginUser, { error, data }] = useLazyQuery(LOGIN_USER);

  if (error) {
    alert(error.message);
  }
  if (data) {
    context.login(data.login.token, data.login.userId);

    return <Navigate to="/" replace />;
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
        Account Signin
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
        <Flex display="flex" justifyContent={"center"} margin={"20px"}>
          <Link to="/signup">Or Signup</Link>
        </Flex>
      </Box>
    </Flex>
  );
}
