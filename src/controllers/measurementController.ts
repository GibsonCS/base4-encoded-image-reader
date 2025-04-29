import type { FastifyReply, FastifyRequest } from "fastify";
import type { MeasurementService } from "../services/measurementService.js";
import { measurementSchema } from "../schemas/measurementSchema.ts";

export class MeasurementController {
  constructor(private service: MeasurementService) {}
  handleMeasurement = async (request: FastifyRequest, reply: FastifyReply) => {
    const result = measurementSchema.safeParse(request.body);

    if (!result.success) {
      reply.code(400).send({
        error_code: "INVALID_DATA",
        error_description:
          "Os dados fornecidos no corpo da requisição são inválidos",
      });
      return;
    }

    this.service.getMeasurement(result.data);

    try {
      reply.code(200).send({
        image_url: "url_image",
        measure_value: 500,
        measure_uuid: "uuid123",
      });
    } catch (error) {
      reply.code(500);
    }
  };
}
