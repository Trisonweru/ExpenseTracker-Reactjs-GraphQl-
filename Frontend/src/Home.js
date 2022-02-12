import React, { useContext, useEffect, useState } from "react";

import AuthContext from "./components/context/context";

import { Line } from "react-chartjs-2";

import { Heading, Text, Box, Flex, Spinner } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import Card from "./components/Card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

const HomePage = () => {
  const context = useContext(AuthContext);
  const [expense, setExpense] = useState();
  const [lbl, setLbl] = useState([]);
  const [dt, setDt] = useState([]);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  const dat = {
    labels: lbl,
    datasets: [
      {
        label: "Daily Expense Track",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(31, 62, 189, 0.4)",
        borderColor: "rgba(31, 62, 189,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(31, 62, 189, 1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(731, 62, 189, 1)",
        pointHoverBorderColor: "rgba(31, 62, 189, 1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: dt,
      },
    ],
  };
  const lineOptions = {
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          // stacked: true,
          gridLines: {
            display: false,
          },
        },
      ],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  };

  let GET_EXPENSES = {
    query: `
      query{
        expenses(userId:"${context.userId}"){
          title
        amount
        user {
          email
        }
        description
        createdAt
        }
      }
      `,
  };

  useEffect(() => {
    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(GET_EXPENSES),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((result) => {
        if (result.status !== 200 && result.status !== 201) {
          throw new Error("Failed");
        }

        return result.json();
      })
      .then((data) => {
        console.log();
        setLbl(
          data.data.expenses.map((item) =>
            new Date(item.createdAt).toDateString()
          )
        );
        setDt(data.data.expenses.map((item) => parseFloat(item.amount)));
        setExpense(
          data.data.expenses.reduce(function (acc, obj) {
            return acc + parseFloat(obj.amount);
          }, 0)
        );
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent="start"
      alignItems={"center"}
      width={"100%"}
      minHeight={"100vh"}
      background="rgba(0,0,0,0.1)"
    >
      <Flex
        display={"flex"}
        flexDirection="column"
        width={"70%"}
        marginTop={"10"}
        justifyContent="center"
        alignItems={"center"}
        background="rgba(255,255,255,1)"
      >
        <Flex
          display={"flex"}
          width={"90%"}
          marginTop={"10"}
          justifyContent="space-between"
          alignItems={"center"}
          background="rgba(255,255,255,1)"
          borderBottom={"1px  solid  #000"}
        >
          <Heading as="h1" fontSize={"23px"}>
            Daily Expenses
          </Heading>

          <Text>Total: $ {expense ? expense : 0}</Text>
        </Flex>
        <Flex
          display={"flex"}
          flexFlow="row  wrap"
          width={"90%"}
          marginTop={"10"}
          alignItems={"center"}
          justifyContent="center"
          background="rgba(255,255,255,1)"
        >
          <Line data={dat} options={lineOptions} />
        </Flex>
      </Flex>
    </Box>
  );
};

export default HomePage;
