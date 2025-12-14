export default function Button({ children, type = "button", loading, ...props }) {
  return (
    <button
      type={type}
      disabled={loading}
      className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
