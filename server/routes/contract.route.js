import express from "express";
import upload from "../middlewares/multer.js";

import {
  uploadContract,
  getContract,
  updateSection,
} from "../controllers/contract.controller.js";

const contractRouter = express.Router();

// ========================================
// POST /api/contract/analyze
// Upload and analyze contract
// ========================================
contractRouter.post(
  "/analyze",
  upload.single("contract"),
  uploadContract
);

// ========================================
// GET /api/contract/:id
// Get contract by MongoDB ID
// ========================================
contractRouter.get(
  "/:id",
  getContract
);

// ========================================
// PUT /api/contract/:id/sections/:sectionId
// Update section content
// ========================================
contractRouter.put(
  "/:id/sections/:sectionId",
  updateSection
);

export default contractRouter;
