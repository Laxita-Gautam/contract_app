import express from "express";
import upload from "../middlewares/multer.js";

import {
  uploadContract,
  getContract,
  updateSection,
  updateSectionStatus,
} from "../controllers/contract.controller.js";

const contractRouter = express.Router();

// Analyze/upload contract FIRST
contractRouter.post(
  "/analyze",
  upload.single("contract"),
  uploadContract
);

// Get contract
contractRouter.get("/:id", getContract);

// Update section
contractRouter.put("/:id/sections/:sectionId", updateSection);

// Update section status
contractRouter.put("/:id/sections/:sectionId/status", updateSectionStatus);

export default contractRouter;
