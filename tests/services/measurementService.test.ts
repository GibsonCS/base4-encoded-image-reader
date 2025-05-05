import { before, describe, it, afterEach } from "node:test";
import { expect } from "chai";
import getMeasurementMocks from './mocks/getMeasurement-mocks.json' with {type: "json"}
import { MeasurementService } from "../../src/services/measurementService.ts";
import { CustomerRepository } from "../../src/repositories/customerRepository.js";
import { MeasurementRepository } from "../../src/repositories/measurementRepository.js";
import { database, runSeed } from '../../src/shared/database/db.js'
import sinon from 'sinon'
import { array } from "zod";

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

  afterEach(() => {
    sinon.restore()
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
      sinon.stub(measurementRepository, "findById").withArgs("5454-35453-35415-351-3541").resolves({
        measure_uuid: 'c36ba395-eaae-437e-bdf9-491d71dae42d',
        measure_datetime: '2025-04-29T09:54:50Z',
        measure_value: 5,
        measure_type: 'GAS',
        has_confirmed: 0,
        customer_code: 'string'
      })
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
      sinon.stub(measurementRepository, 'findById').withArgs("c36ba395-eaae-437e-bdf9-491d71dae42d").resolves({
        measure_uuid: 'c36ba395-eaae-437e-bdf9-491d71dae42d',
        measure_datetime: '2025-04-29T09:54:50Z',
        measure_value: 5,
        measure_type: 'GAS',
        has_confirmed: 1,
        customer_code: 'string'
      })

      const mockInput = {
        measure_uuid: "c36ba395-eaae-437e-bdf9-491d71dae42d",
        confirmed_value: 500
      }
      
      const expected = {
        error_code: "CONFIRMATION_DUPLICATE",
        error_description: "Leitura do mês já realizada"
      }

      const result = await measurementService.confirmMeasurement(mockInput)
      expect(result).to.be.deep.equal(expected)
    })

    it('should return a array list from all measurement', async () => {
        const customerCode = "632b0f38-291a-479b-ae94-aee4d7c94aa8"
        const measureType = "GAS"
    
      const result = await measurementService.getAllMeasurementByCustomerCode(customerCode,measureType)
      expect(result).to.containSubset({
        customer_code: (val: string) => typeof val === "string",
        measures: (val: string) => typeof val === "object"
      })
    })
  })
});
