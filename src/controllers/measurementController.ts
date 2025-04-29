import type { FastifyReply, FastifyRequest } from "fastify";
import type { MeasurementService } from "../services/measurementService.js";

export class MeasurementController {
  constructor(private service: MeasurementService) {}
  handleMeasurement = async (request: FastifyRequest, reply: FastifyReply) => {
    console.log(request.body);
    this.service.getMeasurement(request.body);
    reply.code(200).send({
      image_url: "url_image",
      measure_value: 500,
      measure_uuid: "uuid123",
    });
  };
}
