import type { DatabaseSync } from 'node:sqlite';
import type { BaseRepostiory } from './baseRepository.ts';
import type { Customer } from '../schemas/customerSchema.ts';

export class CustomerRepository implements BaseRepostiory<Customer> {
  constructor(private database: DatabaseSync) {}

  save(obj: Customer): Customer {
    const statement = this.database.prepare(`
                INSERT INTO customer (customer_code) VALUES (?)
            `);
    statement.run(obj.customer_code);

    const customer: Customer = {
      customer_code: obj.customer_code,
    };

    return customer;
  }

  findById(id: string): Customer {
    const statement = this.database.prepare(`
                SELECT * FROM customer WHERE customer_code = ?
            `);

    const customer = statement.get(id);

    if (customer) return customer;
    return null;
  }

  findAll(): Customer[] {
    throw new Error('Method not implemented.');
  }

  update(obj: { customer_code?: string }): { customer_code?: string } {
    throw new Error('Method not implemented.');
  }
}
