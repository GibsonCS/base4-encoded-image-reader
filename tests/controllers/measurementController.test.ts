import { describe, it } from "node:test";
import sinon from "sinon";
import { expect } from "chai";
import type { MeasurementService } from "../../src/modules/measurement/services/measurementService.ts";
import { MeasurementController } from "../../src/modules/measurement/controllers/measurementController.ts";

describe("MeasurementController suite tests", () => {
  describe("handleMeasurement", () => {
    it("should call service and respond with status 200 and a valid json", async () => {
      const mockService: MeasurementService = {
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
      });
    });
  });
});
