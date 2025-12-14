import { useAuth } from "../context/AuthContext";

export default function SweetCard({ sweet }) {
  const { user } = useAuth();

  return (
    <div className="border rounded-lg p-4 shadow">
      <img
        src={sweet.image || "https://placehold.co/300x200"}
        alt={sweet.name}
        className="rounded mb-3"
      />

      <h3 className="font-semibold text-lg">{sweet.name}</h3>
      <p className="text-gray-500">₹{sweet.price}</p>

      <button
        disabled={!user}
        className={`mt-3 w-full py-2 rounded ${
          user
            ? "bg-blue-600 text-white"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {user ? "Purchase" : "Login to Purchase"}
      </button>
    </div>
  );
}
