const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const http = require("http");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ApolloServer, gql } = require("apollo-server-express");

//importing mongoose models
const Expense = require("./models/expense");
const User = require("./models/users");

//import the midleware to check for every incoming request if user is authenticated
const isAuth = require("./middleware/is-auth");

const app = express();
app.use(express.json());
app.use(isAuth);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
//dynamic relationships
const singleUser = async (userID) => {
  try {
    const user = await User.findById(userID);
    return {
      ...user._doc,
      _id: user.id,
    };
  } catch (err) {
    throw err;
  }
};

const typeDefs = gql`
  type Expense {
    _id: ID!
    user: User!
    title: String!
    description: String!
    amount: String!
    createdAt: String!
    updatedAt: String!
  }
  type User {
    _id: ID!
    email: String!
    password: String
  }
  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  type Query {
    users: [User!]!
    expenses(userId: ID!): [Expense!]!
    login(email: String, password: String!): AuthData!
  }
  type Mutation {
    createExpense(
      userId: ID!
      title: String!
      description: String!
      amount: String!
    ): Expense
    createUser(email: String!, password: String!): User
  }
`;

const resolvers = {
  Query: {
    expenses: async (root, args, req) => {
      // if (!req.isAuth) {
      //   throw new Error("Not authenticated.");
      // }
      const expenses = await Expense.find({ user: args.userId });
      return expenses.map((expense) => {
        return {
          ...expense._doc,
          _id: expense.id,
          user: singleUser.bind(this, expense._doc.user),
          createdAt: new Date(expense._doc.createdAt).toISOString(),
          updatedAt: new Date(expense._doc.updatedAt).toISOString(),
        };
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ email: args.email });
      if (!user) {
        throw new Error("Invalid credentials. Please try again!");
      }
      const isEqual = await bcrypt.compare(args.password, user.password);
      if (!isEqual) {
        throw new Error("Invalid credentials. Please try again!");
      }
      const token = await jwt.sign(
        { userId: user.id, email: user.email },
        "thisissupposedtobemysecret",
        {
          expiresIn: "1h",
        }
      );
      return { userId: user.id, token: token, tokenExpiration: 1 };
    },
  },
  Mutation: {
    createExpense: (root, args, req) => {
      // if (!req.isAuth) {
      //   throw new Error("Not authenticated.");
      // }
      const expense = new Expense({
        title: args.title,
        amount: args.amount,
        description: args.description,
        user: args.userId,
      });
      expense
        .save()
        .then((result) => {
          return {
            ...result._doc,
            _id: result.id,
            user: singleUser.bind(this, result._doc.user),
          };
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    },
    createUser: (root, args) => {
      console.log(args);
      return User.findOne({ email: args.email })
        .then((user) => {
          if (user) {
            throw new Error("The user already exists");
          }
          return bcrypt.hash(args.password, 12);
        })
        .then((hashedPass) => {
          const user = new User({
            email: args.email,
            password: hashedPass,
          });
          return user.save();
        })

        .then((result) => {
          console.log(result);
          return { ...result._doc, _id: result.id, password: null };
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    },
  },
};

let apolloServer = null;
async function startServer() {
  apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
}
startServer();
const httpserver = http.createServer(app);

mongoose
  .connect(
    `mongodb+srv://Mongo:${process.env.PASSWORD}@cluster0.yqkqv.mongodb.net/expense_trackerDB?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        `Server is running at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
