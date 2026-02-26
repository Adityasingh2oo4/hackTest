export default function InputBox({ label,onChange, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        className="px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
      />
    </div>
  );
}