import fastify from "fastify";
import { runSeed } from "./shared/database/db.ts";

export const server = fastify();
const startServer = async () => {
  await server.listen({ port: 80 });
  console.log("Server listening at 80");
};
startServer();
runSeed();
