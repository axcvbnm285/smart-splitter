import Bill from "../models/Bill.js";

export const saveBill = async (req, res) => {
  try {
    const { title, participants, items, payments, tax, discount, total, settlements } = req.body;
    
    const bill = await Bill.create({
      userId: req.userId,
      title,
      participants,
      items,
      payments,
      tax,
      discount,
      total,
      settlements
    });

    res.status(201).json({ success: true, bill });
  } catch (error) {
    console.error("Save bill error:", error);
    res.status(500).json({ error: "Failed to save bill" });
  }
};

export const getBills = async (req, res) => {
  try {
    const bills = await Bill.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, bills });
  } catch (error) {
    console.error("Get bills error:", error);
    res.status(500).json({ error: "Failed to fetch bills" });
  }
};

export const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findOne({ _id: req.params.id, userId: req.userId });
    if (!bill) {
      return res.status(404).json({ error: "Bill not found" });
    }
    res.json({ success: true, bill });
  } catch (error) {
    console.error("Get bill error:", error);
    res.status(500).json({ error: "Failed to fetch bill" });
  }
};

export const deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!bill) {
      return res.status(404).json({ error: "Bill not found" });
    }
    res.json({ success: true, message: "Bill deleted" });
  } catch (error) {
    console.error("Delete bill error:", error);
    res.status(500).json({ error: "Failed to delete bill" });
  }
};
