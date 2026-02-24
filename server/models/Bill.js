import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  participants: [String],
  items: [{
    name: String,
    price: Number,
    assignedTo: [String]
  }],
  payments: [{
    person: String,
    amount: Number
  }],
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: Number,
  settlements: [{
    from: String,
    to: String,
    amount: Number
  }]
}, { timestamps: true });

export default mongoose.model("Bill", billSchema);
