import { before, describe, it, after } from "node:test";
import { expect } from "chai";
import { MeasurementController } from "../../src/modules/measurement/controllers/measurementController.js";
import { server } from "../../src/index.ts";

describe("MeasurementController suite tests", () => {
  let measurementController: MeasurementController;

  before(async () => {
    // await startServer();
    await server.listen({ port: 80 });
    measurementController = new MeasurementController();
  });

  after(async () => {
    await server.close();
    console.log("Server close");
  });

  describe("handleMeasurement", () => {
    it("Should return http status 200 and a valid json", async () => {
      const inputData = {
        image: "base64",
        customer_code: "string",
        measure_datetime: "datetime",
        measure_type: "WATER",
      };
      const expected = {
        image_url: "url_image",
        measure_value: 500,
        measure_uuid: "uuid123",
      };

      const response = await fetch("http://localhost:80/upload", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(inputData),
      });
      const result = await response.json();
      expect(result).to.be.deep.equal(expected);
    });
  });
});
