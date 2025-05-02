import { GoogleGenAI } from '@google/genai'
import type { CustomerRepository } from "../repositories/customerRepository.ts";
import type { Measurement } from "../schemas/measurementSchema.ts";
import type { MeasurementRepository } from '../repositories/measurementRepository.ts';
import crypto from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { readFile } from 'node:fs/promises';
import dayjs from 'dayjs'

export class MeasurementService {
  constructor(private customerRepository: CustomerRepository, private measurementRepository: MeasurementRepository) { }

  getMeasurement = async (measureData: Measurement) => {
    const customer = this.customerRepository.findById(measureData.customer_code)
    if (!customer) {

      const registedCustomer = this.customerRepository.save(measureData)
      const { image, measure_datetime, measure_type } = measureData

      // const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
      // const contents = [
      //   {
      //     inlineData: {
      //       mimeType: "image/jpeg",
      //       data: image,
      //     },
      //   },
      //   { text: "Return only number this image" },
      // ];

      // const response = await ai.models.generateContent({
      //   model: "gemini-2.0-flash",
      //   contents: contents
      // })

      const measurement = {
        measure_uuid: crypto.randomUUID(),
        measure_datetime,
        measure_value: 357,  //parseInt(response.text),
        measure_type,
        has_confirmed: 0,
        customer_code: registedCustomer.customer_code
      }

      const savedMeasurementt = this.measurementRepository.save(measurement)

      const { measure_uuid, measure_value } = savedMeasurementt

      const imageId: string = crypto.randomUUID()

      await writeFile(`${process.cwd()}/src/images/${imageId}.jpeg`, Buffer.from(measureData.image, 'base64'))

      const log = {
        imageId,
        expiresAt: Date.now() + 1 * 60 * 1000
      }

      const imagesLog = JSON.parse(await readFile(`${process.cwd()}/src/images/imageLog.json`, 'utf8'))

      imagesLog.push(log)

      await writeFile(`${process.cwd()}/src/images/imageLog.json`, JSON.stringify(imagesLog))

      return {
        image_url: `http://localhost:3000/images/${imageId}.jpeg`,
        measure_value,
        measure_uuid
      }
    }



    // const measurements = this.measurementRepository.findByCustomerCode("customerCodeUUID2")

    // const isWithin30Days = (date: string) => {
    //   const dateTimestemp = new Date(date)
    //   const now = new Date()

    //   console.log(dayjs(dateTimestemp).isBefore(now, 'days'))

    //   return
    // }

    // console.log(isWithin30Days(measurements.measure_datetime))



    return {}
  };
}
