import express, { Router } from "express";
import inventoryRouter from "./inventoryRouter";

const router: Router = express.Router();

router.use('/api/v1/inventory', inventoryRouter);

export default router;
