import { before, describe, it } from "node:test";
import sinon from "sinon";
import { expect } from "chai";
import { MeasurementController } from "../../src/controllers/measurementController.ts";
import { runSeed } from "../../src/shared/database/db.ts";

before(() => {
  runSeed()
})

describe("MeasurementController suite tests", () => {
  describe("handleMeasurement", () => {
    it("should call service and response with status 200 and a valid json", async () => {
      const mockService: any = {
        getMeasurement: sinon.stub().resolves({
          image_url: "http://example.com/image.jpg",
          measure_value: 42.7,
          measure_uuid: "abc-123",
        }),
      };

      const measurementController = new MeasurementController(mockService);

      const mockRequest = {
        body: {
          image: "base64string",
          customer_code: "ABC123",
          measure_datetime: "2024-01-01T12:00:00Z",
          measure_type: "WATER",
        },
      };

      const reply = {
        code: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };

      await measurementController.handleMeasurement(
        mockRequest as any,
        reply as any
      );

      const statusCode = reply.code.firstCall.args[0];
      expect(statusCode).to.be.equal(200);

      const responsePayload = reply.send.firstCall.args[0];
      expect(responsePayload).to.containSubset({
        image_url: (val: string) => typeof val === "string",
        measure_value: (val: number) => typeof val === "number",
        measure_uuid: (val: string) => typeof val === "string",
      });
    });

    it("should return a status code 400 and a valid json with erro information", async () => {
      const mockService: any = {
        getMeasurement: sinon.stub().resolves({
          image_url: "http://example.com/image.jpg",
          measure_value: 42.7,
          measure_uuid: "abc-123",
        }),
      };

      const measurementController = new MeasurementController(mockService);

      const mockRequest = {
        body: {
          image: "base64",
          customer_code: "ABC123",
          measure_datetime: "2024-01-01T12:00:00",
          measure_type: "WATER",
        },
      };

      const reply = {
        code: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };

      await measurementController.handleMeasurement(
        mockRequest as any,
        reply as any
      );

      const statusCode = reply.code.firstCall.args[0];
      expect(statusCode).to.equal(400);

      const expectedPaylod = {
        error_code: "INVALID_DATA",
        error_description:
          "Os dados fornecidos no corpo da requisição são inválidos",
      };

      const responsePayload = reply.send.firstCall.args[0];
      expect(responsePayload).to.be.deep.equal(expectedPaylod);
    });

    it("should return status code 409 and a valid json if there is a reading in current month", async () => {
      const mockService: any = {
        getMeasurement: sinon.stub().resolves({
          error_code: "DOUBLE_REPORT",
          error_description: "Leitura do mês já realizada",
        }),
      };

      const measurementController: MeasurementController =
        new MeasurementController(mockService);
      const mockRequest = {
        body: {
          image: "base64string",
          customer_code: "ABC123",
          measure_datetime: "2024-01-01T12:00:00Z",
          measure_type: "WATER",
        },
      };
      const reply = {
        code: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };
      await measurementController.handleMeasurement(
        mockRequest as any,
        reply as any
      );

      const statusCode = reply.code.firstCall.args[0];
      expect(statusCode).to.be.equal(409);

      const expectedPaylod = {
        error_code: "DOUBLE_REPORT",
        error_description: "Leitura do mês já realizada",
      };
      const payload = reply.send.firstCall.args[0];
      expect(payload).to.deep.equal(expectedPaylod);
    });
  });
});
