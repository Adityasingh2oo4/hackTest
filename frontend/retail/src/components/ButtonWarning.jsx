import { Link } from "react-router-dom";

export default function ButtonWarning({ text, buttonText, linkTo }) {
  return (
    <p className="text-sm text-center text-slate-600">
      {text}{" "}
      <Link
        to={linkTo}
        className="text-blue-600 hover:underline font-medium"
      >
        {buttonText}
      </Link>
    </p>
  );
}