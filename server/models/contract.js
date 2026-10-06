import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    content: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    status: {
  type: String,
  enum: ["pending", "approved", "rejected", "completed"],
  default: "pending",
}
  },
  { _id: false }
);

const contractSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      required: true,
    },

    contractText: {
      type: String,
      required: true,
    },

    sections: {
      type: [sectionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Contract = mongoose.model(
  "Contract",
  contractSchema
);

export default Contract;