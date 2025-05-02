import type { DatabaseSync } from "node:sqlite";
import type { Measurement } from "../schemas/measurementSchema.ts";
import type { BaseRepostiory } from "./baseRepository.ts";

interface MeasurementEntity {
    measure_uuid: string;
    measure_datetime: string;
    measure_value: number
    measure_type: string;
    has_confirmed: number;
    customer_code: string
}

export class MeasurementRepository implements BaseRepostiory<Measurement> {
    constructor(private database: DatabaseSync) { }

    save(measurement: MeasurementEntity): MeasurementEntity {
        const statement = this.database.prepare(`
                INSERT INTO measurement (measure_uuid, measure_datetime, measure_value, measure_type, has_confirmed, customer_code)
                VALUES (@measure_uuid,@measure_datetime,@measure_value,@measure_type,@has_confirmed,@customer_code)
            `)
        statement.run({ ...measurement });

        return measurement
    }

    findById(id: string): Measurement {
        // const statement = this.database.prepare(`
        //         SELECT * from measurement where customer_code = ?
        //     `)

        return

    }

    findByCustomerCode(customerId: string): Measurement {
        const statement = this.database.prepare(`
                SELECT * FROM measurement WHERE customer_code = ?
            `)

        const measurements = statement.get(customerId)
        return measurements
    }

    findAll(): { image?: string; customer_code?: string; measure_datetime?: string; measure_type?: string; }[] {
        throw new Error("Method not implemented.");
    }
    update(obj: { image?: string; customer_code?: string; measure_datetime?: string; measure_type?: string; }): { image?: string; customer_code?: string; measure_datetime?: string; measure_type?: string; } {
        throw new Error("Method not implemented.");
    }

}