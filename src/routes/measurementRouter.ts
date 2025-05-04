import type { FastifyInstance } from "fastify";
import { MeasurementController } from "../controllers/measurementController.ts";
import { MeasurementService } from "../services/measurementService.ts";
import { CustomerRepository } from "../repositories/customerRepository.ts";
import { database } from "../shared/database/db.ts";
import { MeasurementRepository } from "../repositories/measurementRepository.ts";

const customerRepository = new CustomerRepository(database);
const measurementRepository = new MeasurementRepository(database);
const measurementService = new MeasurementService(
  customerRepository,
  measurementRepository
);
const measurementController = new MeasurementController(measurementService);

export const measurementRoutes = async (server: FastifyInstance) => {
  server.post("/upload", measurementController.handleMeasurement);
  server.get(`/images/:id${".jpeg"}`, measurementController.handleTempImage);
  server.patch("/confirm", measurementController.handleConfirmMeasurement);
};
