import type { FastifyReply, FastifyRequest } from "fastify";
import type { MeasurementService } from "../services/measurementService.js";
import { measurementSchema } from "../schemas/measurementSchema.ts";
import { readFile } from 'node:fs/promises'

export class MeasurementController {
  constructor(private service: MeasurementService) { }
  handleMeasurement = async (request: FastifyRequest, reply: FastifyReply) => {
    //we use safeParse to validade data safely, receiving a object with success, data or error.
    const result = measurementSchema.safeParse(request.body);

    const INVALID_DATA = {
      error_code: "INVALID_DATA",
      error_description: "Os dados fornecidos no corpo da requisição são inválidos",
    }

    if (result.error.issues[0].path[0] === "measure_type") return reply.code(400).send({ message: "Você precisa escolher somente entre WATER ou GAS" })
    if (!result.success) return reply.code(400).send(INVALID_DATA);

    const response: any = await this.service.getMeasurement(result.data);

    const ERRO_DOUBLE_REPORT = {
      error_code: "DOUBLE_REPORT",
      error_description: "Leitura do mês já realizada",
    }

    if (response.error_code === "DOUBLE_REPORT") return reply.code(409).send(ERRO_DOUBLE_REPORT);

    reply.code(200).send(response);
  };

  handleTempImage = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }

    const imagesLog = JSON.parse(await readFile(`${process.cwd()}/src/images/imageLog.json`, 'utf8'))
    const [log] = imagesLog.filter((i: any) => i.imageId === id)

    if (Date.now() > log.expiresAt) return reply.code(500).send({ message: 'Link Expirado' })

    reply.header('Content-type', 'image/jpeg').code(200).send(await readFile(`${process.cwd()}/src/images/${id}.jpeg`))
  }
}
