export default function Button({ onClick, buttonText, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`bg-black hover:bg-yellow-700 text-white font-medium py-2 rounded-md transition ${className}`}
    >
      {buttonText}
    </button>
  );
}