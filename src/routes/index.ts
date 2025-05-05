import type { FastifyInstance } from 'fastify';
import { measurementRoutes } from './measurementRouter.js';

export const routesRegistration = (server: FastifyInstance) => {
  server.register(measurementRoutes);
};
