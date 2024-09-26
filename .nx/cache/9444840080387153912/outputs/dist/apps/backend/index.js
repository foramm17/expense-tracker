// apps/backend/src/index.js
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import passport2 from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { buildContext } from "graphql-passport";

// apps/backend/src/resolvers/index.js
import { mergeResolvers } from "@graphql-tools/merge";

// apps/backend/src/models/transaction.model.js
import mongoose from "mongoose";
var transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  description: {
    type: String,
    required: true
  },
  paymentType: {
    type: String,
    enum: ["cash", "card"],
    required: true
  },
  category: {
    type: String,
    enum: ["saving", "expense", "investment"],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    default: "Unknown"
  },
  date: {
    type: Date,
    required: true
  }
});
var Transaction = mongoose.model("Transaction", transactionSchema);
var transaction_model_default = Transaction;

// apps/backend/src/models/user.model.js
import mongoose2 from "mongoose";
var userSchema = new mongoose2.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: ""
  },
  gender: {
    type: String,
    enum: ["male", "female"]
  }
}, { timestamps: true });
var User = mongoose2.model("User", userSchema);
var user_model_default = User;

// apps/backend/src/resolvers/user.resolver.js
import bcrypt from "bcryptjs";
var userResolver = {
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, name, password, gender } = input;
        if (!username || !name || !password || !gender) {
          throw new Error("All fields are required");
        }
        const existingUser = await user_model_default.findOne({ username });
        if (existingUser) {
          throw new Error("User already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const newUser = new user_model_default({
          username,
          name,
          password: hashedPassword,
          gender,
          profilePicture: gender === "male" ? boyProfilePic : girlProfilePic
        });
        await newUser.save();
        await context.login(newUser);
        return newUser;
      } catch (err) {
        console.error("Error in signUp: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },
    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;
        if (!username || !password)
          throw new Error("All fields are required");
        const { user } = await context.authenticate("graphql-local", {
          username,
          password
        });
        await context.login(user);
        return user;
      } catch (err) {
        console.error("Error in login:", err);
        throw new Error(err.message || "Internal server error");
      }
    },
    logout: async (_, __, context) => {
      try {
        await context.logout();
        context.req.session.destroy((err) => {
          if (err)
            throw err;
        });
        context.res.clearCookie("connect.sid");
        return { message: "Logged out successfully" };
      } catch (err) {
        console.error("Error in logout:", err);
        throw new Error(err.message || "Internal server error");
      }
    }
  },
  Query: {
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (err) {
        console.error("Error in authUser: ", err);
        throw new Error("Internal server error");
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await user_model_default.findById(userId);
        return user;
      } catch (err) {
        console.error("Error in user query:", err);
        throw new Error(err.message || "Error getting user");
      }
    }
  },
  User: {
    transactions: async (parent) => {
      try {
        const transactions = await transaction_model_default.find({ userId: parent._id });
        return transactions;
      } catch (err) {
        console.log("Error in user.transactions resolver: ", err);
        throw new Error(err.message || "Internal server error");
      }
    }
  }
};
var user_resolver_default = userResolver;

// apps/backend/src/resolvers/transaction.resolver.js
var transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser())
          throw new Error("Unauthorized");
        const userId = await context.getUser()._id;
        const transactions = await transaction_model_default.find({ userId });
        return transactions;
      } catch (err) {
        console.error("Error getting transactions:", err);
        throw new Error("Error getting transactions");
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await transaction_model_default.findById(transactionId);
        return transaction;
      } catch (err) {
        console.error("Error getting transaction:", err);
        throw new Error("Error getting transaction");
      }
    },
    categoryStatistics: async (_, __, context) => {
      if (!context.getUser())
        throw new Error("Unauthorized");
      const userId = context.getUser()._id;
      const transactions = await transaction_model_default.find({ userId });
      const categoryMap = {};
      transactions.forEach((transaction) => {
        if (!categoryMap[transaction.category]) {
          categoryMap[transaction.category] = 0;
        }
        categoryMap[transaction.category] += transaction.amount;
      });
      return Object.entries(categoryMap).map(([category, totalAmount]) => ({
        category,
        totalAmount
      }));
    }
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const newTransaction = new transaction_model_default({
          ...input,
          userId: context.getUser()._id
        });
        await newTransaction.save();
        return newTransaction;
      } catch (err) {
        console.error("Error creating transaction:", err);
        throw new Error("Error creating transaction");
      }
    },
    updateTransaction: async (_, { input }) => {
      try {
        const updatedTransaction = await transaction_model_default.findByIdAndUpdate(
          input.transactionId,
          input,
          {
            new: true
          }
        );
        return updatedTransaction;
      } catch (err) {
        console.error("Error updating transaction:", err);
        throw new Error("Error updating transaction");
      }
    },
    deleteTransaction: async (_, { transactionId }) => {
      try {
        const deletedTransaction = await transaction_model_default.findByIdAndDelete(
          transactionId
        );
        return deletedTransaction;
      } catch (err) {
        console.error("Error deleting transaction:", err);
        throw new Error("Error deleting transaction");
      }
    }
  },
  Transaction: {
    user: async (parent) => {
      const userId = parent.userId;
      try {
        const user = await user_model_default.findById(userId);
        return user;
      } catch (err) {
        console.error("Error getting user:", err);
        throw new Error("Error getting user");
      }
    }
  }
};
var transaction_resolver_default = transactionResolver;

// apps/backend/src/resolvers/index.js
var mergedResolvers = mergeResolvers([user_resolver_default, transaction_resolver_default]);
var resolvers_default = mergedResolvers;

// apps/backend/src/typeDefs/index.js
import { mergeTypeDefs } from "@graphql-tools/merge";

// apps/backend/src/typeDefs/user.typeDef.js
var userTypeDef = `#graphql
  type User {
    _id: ID!
    username: String!
    name: String!
    password: String!
    profilePicture: String
    gender: String!
    transactions: [Transaction!]
  }

  type Query {
    authUser: User
    user(userId:ID!): User
  }

  type Mutation {
    signUp(input: SignUpInput!): User
    login(input: LoginInput!): User
    logout: LogoutResponse
  }

  input SignUpInput {
    name: String!
    username: String!
    password: String!
    gender: String!
  }

  input LoginInput {
    username: String!
    password: String!
  }

  type LogoutResponse {
    message: String!
  }

`;
var user_typeDef_default = userTypeDef;

// apps/backend/src/typeDefs/transaction.typeDef.js
var transactionTypeDef = `#graphql
  type Transaction {
    _id: ID!
    userId: ID!
    description: String!
    paymentType: String!
    category: String!
    amount: Float!
    location: String
    date: String!
    user: User!
  }

  type Query {
    transactions: [Transaction!]
    transaction(transactionId:ID!): Transaction
    categoryStatistics: [CategoryStatistics!]
  }

  type Mutation {
    createTransaction(input: CreateTransactionInput!): Transaction!
    updateTransaction(input: UpdateTransactionInput!): Transaction!
    deleteTransaction(transactionId:ID!): Transaction!
  }

  type CategoryStatistics {
    category: String!
    totalAmount: Float!
  }

  input CreateTransactionInput {
    description: String!
    paymentType: String!
    category: String!
    amount: Float!
    date: String!
    location: String
  }

  input UpdateTransactionInput {
    transactionId: ID!
    description: String
    paymentType: String
    category: String
    amount: Float
    location: String
    date: String
  }
`;
var transaction_typeDef_default = transactionTypeDef;

// apps/backend/src/typeDefs/index.js
var mergedTypeDefs = mergeTypeDefs([user_typeDef_default, transaction_typeDef_default]);
var typeDefs_default = mergedTypeDefs;

// apps/backend/src/db/connectDB.js
import mongoose3 from "mongoose";
var connectDB = async () => {
  try {
    const conn = await mongoose3.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

// apps/backend/src/passport/passport.config.js
import passport from "passport";
import bcrypt2 from "bcryptjs";
import { GraphQLLocalStrategy } from "graphql-passport";
var configurePassport = async () => {
  passport.serializeUser((user, done) => {
    console.log("Serializing user");
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    console.log("Deserializing user");
    try {
      const user = await user_model_default.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  passport.use(
    new GraphQLLocalStrategy(async (username, password, done) => {
      try {
        const user = await user_model_default.findOne({ username });
        if (!user) {
          throw new Error("Invalid username or password");
        }
        const validPassword = await bcrypt2.compare(password, user.password);
        if (!validPassword) {
          throw new Error("Invalid username or password");
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
};

// apps/backend/src/index.js
dotenv.config();
configurePassport();
var __dirname = path.resolve();
var app = express();
var httpServer = http.createServer(app);
var MongoDBStore = connectMongo(session);
var store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions"
});
store.on("error", (err) => console.log(err));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1e3 * 60 * 60 * 24 * 7,
      httpOnly: true
    },
    store
  })
);
app.use(passport2.initialize());
app.use(passport2.session());
var server = new ApolloServer({
  typeDefs: typeDefs_default,
  resolvers: resolvers_default,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});
await server.start();
app.use(
  "/graphql",
  cors({
    origin: "http://localhost:3000",
    credentials: true
  }),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res })
  })
);
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/apps/frontend/index.html"));
});
await new Promise((resolve) => httpServer.listen({ port: 4e3 }, resolve));
await connectDB();
console.log(`\u{1F680} Server ready at http://localhost:4000/graphql`);
