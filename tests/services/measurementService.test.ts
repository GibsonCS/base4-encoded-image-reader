import { before, describe, it, afterEach, after } from "mocha";
import { expect } from "chai";
import getMeasurementMocks from './mocks/getMeasurement-mocks.json' with {type: "json"}
import { MeasurementService } from "../../src/modules/measurement/services/measurementService.ts";

describe("MeasurementService", () => {
  let measurementService: MeasurementService

  beforeEach(() => {
    measurementService = new MeasurementService()
  })

  describe('getMeasurement()', () => {
    it("should return valid json", async () => {
      const inputData = getMeasurementMocks.inputValidMock
      const expectedResult = getMeasurementMocks.outputValidMock
      const result = await measurementService.getMeasurement(inputData)
      expect(result).to.be.deep.equals(expectedResult)
    });
  })
});
