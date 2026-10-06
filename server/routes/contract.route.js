import express from "express";
import upload from "../middlewares/multer.js";

import {
  uploadContract,
  getContract,
  updateSection,
} from "../controllers/contract.controller.js";

const contractRouter = express.Router();

// Upload and analyze contract
contractRouter.post(
  "/analyze",
  upload.single("contract"),
  uploadContract
);

// Edit section
contractRouter.put(
  "/:id/sections/:sectionId",
  updateSection
);

// Get contract
contractRouter.get(
  "/:id",
  getContract
);

export default contractRouter;
