import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "../../api/axios";
import { BillContext } from "../../context/BillContext";

export default function UploadBill() {
  const navigate = useNavigate();

  const {
    setItems,
    setTax,
    setDiscount,
    setBillTotal,   // optional if you added this in context
  } = useContext(BillContext);

  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("bill", file);

    try {
      setLoading(true);

      const res = await axios.post("/bill/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Backend Response:", res.data);

      let structured;

      try {
        structured =
          typeof res.data.structuredData === "string"
            ? JSON.parse(res.data.structuredData)
            : res.data.structuredData;
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        alert("AI parsing failed. Try clearer image.");
        setLoading(false);
        return;
      }

      // 🔹 Items (use line total for splitting)
      if (structured.items && structured.items.length > 0) {
        const formattedItems = structured.items.map((item, index) => ({
          id: Date.now() + index,
          name: item.name,
          price: Number(item.total || item.price || 0), // prefer line total
          quantity: Number(item.quantity || 1),
          assignedTo: [],
        }));

        setItems(formattedItems);
      }

      // 🔹 Tax = CGST + SGST
      const taxAmount =
        Number(structured.cgst || 0) +
        Number(structured.sgst || 0);

      setTax(taxAmount);

      // 🔹 Discount (if present)
      setDiscount(Number(structured.discount || 0));

      // 🔹 Total (optional)
      if (setBillTotal) {
        setBillTotal(Number(structured.total || 0));
      }

      setLoading(false);
      navigate("/preview", { state: { structured } });


    } catch (err) {
      console.error("Upload error:", err.response?.data || err);
      alert("Upload failed. Check console.");
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleUpload}
        className="mb-4"
      />

      {loading && (
        <p className="text-indigo-600 font-semibold">
          Processing bill... 🤖
        </p>
      )}
    </div>
  );
}
