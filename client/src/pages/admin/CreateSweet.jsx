import { useState } from "react";
import { createSweet } from "../../services/sweets.api";
import { useNavigate } from "react-router-dom";

export default function CreateSweet() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    image: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.category || form.price === "") {
      return setError("Name, category and price are required");
    }

    if (Number(form.price) < 0 || Number(form.quantity) < 0) {
      return setError("Price / quantity cannot be negative");
    }

    try {
      setLoading(true);

      await createSweet({
        name: form.name.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        quantity: Number(form.quantity || 0),
        image: form.image || undefined,
      });

      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create sweet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white p-6 rounded shadow"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Create Sweet
        </h2>

        {error && (
          <p className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <input
          name="name"
          placeholder="Sweet name"
          className="w-full border p-2 mb-3 rounded"
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Category (Milk, Sugar, etc)"
          className="w-full border p-2 mb-3 rounded"
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          className="w-full border p-2 mb-3 rounded"
          onChange={handleChange}
        />

        <input
          type="number"
          name="quantity"
          placeholder="Initial quantity"
          className="w-full border p-2 mb-3 rounded"
          onChange={handleChange}
        />

        <input
          name="image"
          placeholder="Image URL (optional)"
          className="w-full border p-2 mb-4 rounded"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Sweet"}
        </button>
      </form>
    </div>
  );
}
