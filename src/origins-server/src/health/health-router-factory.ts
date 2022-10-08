import express from "express";
import { HealthProvider } from "./HealthProvider";

// TODO: Inject this if needed in future
const healthProvider = new HealthProvider();

export const createHealthRouter = () => {
  const router = express.Router();

  router
    .get('/', async (req, res) => {
      return res.status(200).contentType('application/json').send(await healthProvider.getHealth());
    });
    
  return router;
}