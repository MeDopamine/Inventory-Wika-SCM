import express, { Router } from "express";
import UserController from "../controllers/inventoryContorller";

const router: Router = express.Router();

router.get('/', UserController.getTest);
router.get('/export', UserController.getAllDataExportExcel);
router.get('/exportFilter', UserController.getFilterDataExportExcel);
router.get('/data', UserController.getData);
router.get('/lazyData', UserController.getLazyData);
router.get('/materialyQty', UserController.getTotalMaterialQty);
router.get('/dashboardData', UserController.geDataDashboard);
router.get('/dashboardDataTest', UserController.geDataDashboardTest);
router.post('/upload', UserController.saveData);

export default router;
