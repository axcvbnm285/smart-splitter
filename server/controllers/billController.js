import fs from "fs";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const uploadBill = async (req, res) => {
  try {
    console.log("Upload route hit");

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;

    // Convert image to base64
    const imageBase64 = fs.readFileSync(filePath, {
      encoding: "base64",
    });

    // Delete file after reading
    fs.unlinkSync(filePath);

    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct", // check latest model name
      messages: [
        {
          role: "system",
          content: `
You are a strict financial receipt extraction engine.

Extract:
- items (name, price, quantity, total)
- subtotal
- cgst
- sgst
- discount (if any)
- final total

Return ONLY valid JSON.
Do NOT include explanation.
Ensure subtotal = sum of item totals.
Ensure total = subtotal + cgst + sgst - discount.

Format:
{
  "items": [
    {
      "name": "",
      "price": 0,
      "quantity": 0,
      "total": 0
    }
  ],
  "subtotal": 0,
  "cgst": 0,
  "sgst": 0,
  "discount": 0,
  "total": 0
}
`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract structured data from this receipt image."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      temperature: 0,
      response_format: { type: "json_object" }
    });

    const structured = completion.choices[0].message.content;

    res.json({
      success: true,
      structuredData: structured,
    });

  } catch (error) {
    console.error("PROCESS ERROR:", error);
    res.status(500).json({ error: "Processing Failed" });
  }
};
