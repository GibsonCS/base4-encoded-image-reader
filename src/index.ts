import fastify from "fastify";
import { routesRegistration } from "./routes/index.js";
import { runSeed } from "./shared/database/db.ts";

export const server = fastify({ logger: false });
routesRegistration(server);

const startServer = async () => {
  await server.listen({ port: 3000 });
  console.log("Server listening at 3000");
};
runSeed();
startServer();
