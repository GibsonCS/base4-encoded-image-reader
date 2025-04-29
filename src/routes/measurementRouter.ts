import type { FastifyInstance } from "fastify";
import { MeasurementController } from "../controllers/measurementController.ts";
import { MeasurementService } from "../services/measurementService.ts";

const measurementController = new MeasurementController(
  new MeasurementService()
);
export const measurementRoutes = async (server: FastifyInstance) => {
  server.post("/upload", measurementController.handleMeasurement);
};
