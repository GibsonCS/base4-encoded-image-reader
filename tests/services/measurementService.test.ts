import { before, describe, it } from "node:test";
import { expect } from "chai";
import getMeasurementMocks from './mocks/getMeasurement-mocks.json' with {type: "json"}
import { MeasurementService } from "../../src/services/measurementService.ts";
import { CustomerRepository } from "../../src/repositories/customerRepository.js";
import { MeasurementRepository } from "../../src/repositories/measurementRepository.js";
import { database, runSeed } from '../../src/shared/database/db.js'
import sinon from 'sinon'

describe("MeasurementService", () => {
  let customerRepository: CustomerRepository
  let measurementRepository: MeasurementRepository
  let measurementService: MeasurementService

  before(() => {
    runSeed()
    measurementRepository = new MeasurementRepository(database)
    customerRepository = new CustomerRepository(database)
    measurementService = new MeasurementService(customerRepository, measurementRepository)
  })

  describe('getMeasurement()', () => {
    it("should return valid json", async () => {
      sinon.stub(measurementService, "getMeasurement").resolves(
        {
          image_url: "string",
          measure_value: 500,
          measure_uuid: "454545-54151-51531-354135-5341"
        }
      )

      const inputData = getMeasurementMocks.inputValidMock
      const result = await measurementService.getMeasurement(inputData)
      expect(result).to.containSubset({
        image_url: (val: string) => typeof val === "string",
        measure_value: (val: number) => typeof val === "number",
        measure_uuid: (val: string) => typeof val === "string"
      })
    });
  })

  describe('confirmMeasurement', () => {
    it('should return a json with attibute sucesse and value true', async () => {
      const mockInput = {
        measure_uuid: "5454-35453-35415-351-3541",
        confirmed_value: 501
        }
        const expected = {
          success: true
        }
        
        const result = await measurementService.confirmMeasurement(mockInput)
        expect(result).to.be.deep.equal(expected)
      })
      
    it('should return a error json if the measurement has not found', async () => {
      const mockInput = {
        measure_uuid: "54531-451351-543115-54351-35135",
        confirmed_value: 500
        }
      const expected = {
        error_code: "MEASURE_NOT_FOUND",
        error_description: "Leitura do mês já realizada"
        }
      
      const result = await measurementService.confirmMeasurement(mockInput)
      expect(result).to.be.deep.equal(expected)
    })

    it('should return a json error stating that the measurement was confirmed', async () => {
      const mockInput = {
        measure_uuid: "5454-35453-35415-351-3541",
        confirmed_value: 500
      }
      
      const expected = {
        error_code: "CONFIRMATION_DUPLICATE",
        error_description: "Leitura do mês já realizada"
      }

      const result = await measurementService.confirmMeasurement(mockInput)

      expect(result).to.be.deep.equal(expected)
    })
  })
});
