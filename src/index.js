import express from "express";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload-ts";
import { typeDefs } from "./schema/index.js";
import { resolvers } from "./resolvers/index.js";
import { authMiddleware } from "./utils/authMiddleare.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
const app = express();

// app.use("/uploads", express.static(path.join(process.cwd(), "src/uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "src", "uploads")));
app.use(graphqlUploadExpress());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

await server.start();
server.applyMiddleware({ app });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});
