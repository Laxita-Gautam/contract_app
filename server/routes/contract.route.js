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

// Get contract by ID
contractRouter.get(
  "/:id",
  getContract
);

// Update a section
contractRouter.put(
  "/:id/sections/:sectionId",
  updateSection
);

export default contractRouter;