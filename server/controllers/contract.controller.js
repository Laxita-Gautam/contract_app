import dotenv  from "dotenv"
dotenv.config()
import fs from "fs/promises";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import OpenAI from "openai";
import Contract from "../models/contract.js";


const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const uploadContract = async (req, res) => {
  let filePath;

  try {
    if (!req.file) { 
      return res.status(400).json({
        message: "Contract file is required",
      });
    }

    filePath = req.file.path;
    console.log("UPLOAD PATH:", filePath);

    const fileBuffer = await fs.readFile(filePath);

    let contractText = "";

    if (req.file.mimetype === "application/pdf") {
      const parser = new PDFParse({
        data: fileBuffer,
      });

      const pdfData = await parser.getText();

      console.log("PDF DATA:", pdfData);

      contractText = pdfData.text || "";

      await parser.destroy();
    }
    // DOCX
    else if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const docxData = await mammoth.extractRawText({
        buffer: fileBuffer,
      });
      contractText = docxData.value;
    } else if (req.file.mimetype === "text/plain") {
      contractText = fileBuffer.toString("utf-8");
    } else {
      return res.status(400).json({
        message: "Only PDF, DOCX, and TXT files are supported",
      });
    }
    // clean
    contractText = contractText.replace(/\s+/g, " ").trim();

    if (!contractText) {
      return res.status(400).json({
        message: "Could not extract text from the contract",
      });
    }

    const response = await openai.responses.create({
      model: "openai/gpt-4o-mini",
      input: [
        {
          role: "system",
          content: `
You are a contract information extraction assistant.

Analyze the contract text and extract the following sections:

1. Parties
2. Effective Date
3. Expiry / Contract Term
4. Renewal
5. Termination
6. Notice Period
7. Obligations
8. Deadlines
9. Responsible Parties

Do not invent information.

If a section is not present in the contract, return null or an empty array.

Return ONLY valid JSON in this format:

{
  "sections": [
    {
      "id": 1,
      "title": "Parties",
      "content": "...",
      "status": "pending"
    }
  ]
}
      `,
        },
        {
          role: "user",
          content: contractText,
        },
      ],
    });

    const analysis = JSON.parse(response.output_text);
//     const contract = await Contract.create({
//   fileName: req.file.originalname,
//   fileType: req.file.mimetype,
//   contractText,
//   sections: analysis.sections,
// });
const sections = analysis.sections.map((section, index) => ({
  id: section.id || index + 1,
  title: section.title,
  content: section.content ?? null,
  status:
    section.status === "approved" ||
    section.status === "rejected"
      ? section.status
      : "pending",
}));

const contract = await Contract.create({
  fileName: req.file.originalname,
  fileType: req.file.mimetype,
  contractText,
  sections,
});

    console.log("Contract text extracted successfully");
return res.status(200).json({
  message: "Contract analyzed successfully",
  contractId: contract._id,
  fileName: contract.fileName,
  fileType: contract.fileType,
  sections: contract.sections,
});
  } catch (error) {
    console.error("Contract upload error:", error);

    return res.status(500).json({
      message: "Failed to process contract",
      error: error.message,
    });
  } finally {
    // Delete temporary uploaded file
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error("Could not delete temporary file:", error.message);
      }
    }
  }
};
export const getContract = async (req, res) => {
  try {
    const { id } = req.params;

    const contract = await Contract.findById(id);

    if (!contract) {
      return res.status(404).json({
        message: "Contract not found",
      });
    }

    return res.status(200).json(contract);
  } catch (error) {
    console.error("Get contract error:", error);

    return res.status(500).json({
      message: "Failed to get contract",
      error: error.message,
    });
  }
};
export const updateSection = async (req, res) => {
  try {
    const { id, sectionId } = req.params;
    const { content } = req.body;

    const contract = await Contract.findById(id);

    if (!contract) {
      return res.status(404).json({
        message: "Contract not found",
      });
    }

    const section = contract.sections.find(
      (section) => section.id === Number(sectionId)
    );

    if (!section) {
      return res.status(404).json({
        message: "Section not found",
      });
    }

    section.content = content;

    // Editing a section means it needs to be reviewed again
    section.status = "pending";

    await contract.save();

    return res.status(200).json({
      message: "Section updated successfully",
      section,
    });
  } catch (error) {
    console.error("Update section error:", error);

    return res.status(500).json({
      message: "Failed to update section",
      error: error.message,
    });
  }
};
