import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    model: { type: String, required: true },
    pricePerKm: { type: Number, required: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);
export default Car;
