import mongoose from "mongoose";

const routineEntrySchema = new mongoose.Schema(
  {
    step: { type: String, required: true },
    productId: { type: String, required: true }
  },
  { _id: false }
);

const routineSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    morning: [routineEntrySchema],
    night: [routineEntrySchema]
  },
  { timestamps: true }
);

const Routine = mongoose.model("Routine", routineSchema);

export default Routine;
