import { Info } from "lucide-react";
import React from "react";
import { CgClose } from "react-icons/cg";

const ErrorAlert = ({
  error,
  setError,
}: {
  error: string | null;
  setError: (status: string | null) => void;
}) => {

  return (
    <p className={`${error ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} duration-700 px-4 py-2 mb-6 rounded-lg bg-red-100 text-red-700 flex items-center justify-between gap-x-4`}>
      <span className="flex items-center gap-x-4">
        <Info size={16} /> {error}
      </span>
      <button
        className="cursor-pointer hover:scale-125 active:scale-100"
        onClick={() => setError(null)}
      >
        <CgClose size={20} />
      </button>
    </p>
  );
};

export default ErrorAlert;
