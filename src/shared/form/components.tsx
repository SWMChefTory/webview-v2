import { Loader2 } from "lucide-react";
import { IoClose } from "react-icons/io5";


function FormInput({
  value,
  onChange,
  isError,
  errorMessage,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  isError: boolean;
  errorMessage: string;
  placeholder: string;
}) {
  return (
    <>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.currentTarget.focus({ preventScroll: true });
          }}
          className={`w-full px-4 py-3 lg:px-5 lg:py-4 lg:text-base border rounded-lg lg:rounded-xl outline-none transition-colors ${
            isError
              ? "border-red-500 focus:border-red-600"
              : "border-gray-300 focus:border-black lg:hover:border-gray-400"
          }`}
        />
        {value && (
          <button
            onClick={() => {
              onChange("");
            }}
            type="button"
            className="absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoClose size={20} className="lg:w-6 lg:h-6" />
          </button>
        )}
      </div>

      {isError && (
        <div className="text-red-500 text-sm lg:text-base mt-2 ml-1">{errorMessage}</div>
      )}
    </>
  );
}

function FormButton({
  onSubmit,
  isSubmittable,
  label,
  isLoading = false,
}: {
  onSubmit: () => void;
  isSubmittable: boolean;
  label: string;
  isLoading?: boolean;
}) {
  return (
    <button
      onClick={onSubmit}
      disabled={!isSubmittable}
      type="button"
      className={`w-full h-14 lg:h-16 rounded-lg lg:rounded-xl text-lg lg:text-xl font-medium transition-all ${
        isSubmittable
          ? "bg-[#FB6836] hover:bg-[#e55a2d] text-white lg:hover:-translate-y-0.5 lg:hover:shadow-lg"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
    >
      {isLoading ? <Loader2 className="size-[20] lg:size-[24] animate-spin" /> : label}
    </button>
  );
}

export { FormInput, FormButton };
