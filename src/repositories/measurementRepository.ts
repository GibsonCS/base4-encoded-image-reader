import type { DatabaseSync } from "node:sqlite";
import type {
  ConfirmMeasurement,
  Measurement,
} from "../schemas/measurementSchema.ts";
import type { BaseRepostiory } from "./baseRepository.ts";

interface MeasurementEntity {
  measure_uuid?: string;
  measure_datetime?: string;
  measure_value?: number;
  measure_type?: string;
  has_confirmed?: number;
  customer_code?: string;
}

export class MeasurementRepository
  implements BaseRepostiory<Measurement | ConfirmMeasurement>
{
  constructor(private database: DatabaseSync) {}

  save(measurement: MeasurementEntity): MeasurementEntity {
    const statement = this.database.prepare(`
                INSERT INTO measurement (measure_uuid, measure_datetime, measure_value, measure_type, has_confirmed, customer_code)
                VALUES (@measure_uuid,@measure_datetime,@measure_value,@measure_type,@has_confirmed,@customer_code)
            `);
    statement.run({ ...measurement });

    return measurement;
  }

  async findById(id: string): Promise<MeasurementEntity> {
    const statement = this.database.prepare(`
                SELECT * from measurement where measure_uuid = ?
            `);
    const measurement = statement.get(id);
    return measurement;
  }

  findByCustomerCode(customerId: string): Measurement[] {
    const statement = this.database.prepare(`
                SELECT * FROM measurement WHERE customer_code = ?
            `);

    const measurements = statement.all(customerId);
    return measurements;
  }

  findAll(): {
    image?: string;
    customer_code?: string;
    measure_datetime?: string;
    measure_type?: string;
  }[] {
    throw new Error("Method not implemented.");
  }
  update(obj: ConfirmMeasurement): MeasurementEntity {
    const statement = this.database.prepare(`
            UPDATE measurement set measure_value = ?, has_confirmed = ? where measure_uuid = ?
        `);
    statement.run(obj.confirmed_value, 1, obj.measure_uuid);
    return;
  }
}
