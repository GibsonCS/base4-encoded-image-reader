import type { CustomerRepository } from "../repositories/customerRepository.ts";
import type {
  ConfirmMeasurement,
  Measurement,
} from "../schemas/measurementSchema.js";
import type { MeasurementRepository } from "../repositories/measurementRepository.js";
import crypto from "node:crypto";
import { writeFile } from "node:fs/promises";
import { readFile } from "node:fs/promises";
import dayjs from "dayjs";
import { makeRequestToGoogleAI } from "../lib/google-api.js";

export class MeasurementService {
  constructor(
    private customerRepository: CustomerRepository,
    private measurementRepository: MeasurementRepository
  ) {}

  getMeasurement = async (measureData: Measurement) => {
    const { image, measure_datetime, measure_type, customer_code } =
      measureData;

    const imageId: string = crypto.randomUUID();
    await writeFile(
      `${process.cwd()}/src/images/${imageId}.jpeg`,
      Buffer.from(image, "base64")
    );

    const customer = this.customerRepository.findById(customer_code);
    if (!customer) {
      this.customerRepository.save(measureData);

      const valueOfMeasure = await makeRequestToGoogleAI(image);
      const measurement = {
        measure_uuid: crypto.randomUUID(),
        measure_datetime,
        measure_value: parseInt(valueOfMeasure),
        measure_type,
        has_confirmed: 0,
        customer_code,
      };

      this.measurementRepository.save(measurement);

      const log = {
        imageId,
        expiresAt: Date.now() + 1 * 60 * 1000,
      };

      const imagesLog = JSON.parse(
        await readFile(`${process.cwd()}/src/images/imageLog.json`, "utf8")
      );

      imagesLog.push(log);

      await writeFile(
        `${process.cwd()}/src/images/imageLog.json`,
        JSON.stringify(imagesLog)
      );

      return {
        image_url: `http://localhost:3000/images/${imageId}.jpeg`,
        measure_value: measurement.measure_value,
        measure_uuid: measurement.measure_uuid,
      };
    }

    const measurements =
      this.measurementRepository.findByCustomerCode(customer_code);
    const lastMeasurement = measurements[measurements.length - 1];

    const isWithin30Days = (
      lastMeasurement: string,
      currentMeasurement: string
    ) => {
      const lastMeasurementTimeStemp = new Date(lastMeasurement).valueOf();
      const todayLess30Days = dayjs(currentMeasurement)
        .subtract(30, "day")
        .valueOf();
      return todayLess30Days < lastMeasurementTimeStemp;
    };

    const DOUBLE_REPORT = {
      error_code: "DOUBLE_REPORT",
      error_description: "Leitura do mês já realizada",
    };

    if (isWithin30Days(lastMeasurement.measure_datetime, measure_datetime))
      return DOUBLE_REPORT;

    const valueOfMeasure = await makeRequestToGoogleAI(image);
    const measurement = {
      measure_uuid: crypto.randomUUID(),
      measure_datetime,
      measure_value: parseInt(valueOfMeasure),
      measure_type,
      has_confirmed: 0,
      customer_code: measureData.customer_code,
    };

    this.measurementRepository.save(measurement);

    const log = {
      imageId,
      expiresAt: Date.now() + 1 * 60 * 1000,
    };

    const imagesLog = JSON.parse(
      await readFile(`${process.cwd()}/src/images/imageLog.json`, "utf8")
    );

    imagesLog.push(log);

    await writeFile(
      `${process.cwd()}/src/images/imageLog.json`,
      JSON.stringify(imagesLog)
    );

    return {
      image_url: `http://localhost:3000/images/${imageId}.jpeg`,
      measure_value: measurement.measure_value,
      measure_uuid: measurement.measure_uuid,
    };
  };

  confirmMeasurement = async (dataMeasurement: ConfirmMeasurement) => {
    const { measure_uuid, confirmed_value } = dataMeasurement;

    const measurement = await this.measurementRepository.findById(measure_uuid);
    if (measurement?.has_confirmed === 1)
      return {
        error_code: "CONFIRMATION_DUPLICATE",
        error_description: "Leitura do mês já realizada",
      };

    if (!measurement)
      return {
        error_code: "MEASURE_NOT_FOUND",
        error_description: "Leitura do mês já realizada",
      };

    this.measurementRepository.update({ measure_uuid, confirmed_value });

    return {
      success: true,
    };
  };
}
