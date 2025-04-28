import fastify from "fastify";
import { runSeed } from "./shared/database/db.ts";
import { MeasurementController } from "./modules/measurement/controllers/measurementController.ts";

export const server = fastify();

const controller = new MeasurementController();

server.post("/upload", controller.handleMeasurement);

const startServer = async () => {
  await server.listen({ port: 80 });
  console.log("Server listening at 80");
};
startServer();
runSeed();
