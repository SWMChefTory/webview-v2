import { Loader2 } from "lucide-react";
import { IoClose } from "react-icons/io5";


function FormInput({
  value,
  onChange,
  isError,
  errorMessage,
  placeholder,
  isDisabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  isError: boolean;
  errorMessage: string;
  placeholder: string;
  isDisabled?: boolean;
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
          className={`w-full px-4 py-3 border rounded-lg outline-none ${
            isError
              ? "border-red-500 focus:border-red-600"
              : "border-gray-300 focus:border-black"
          }`}
        />
        {value && (
          <button
            onClick={() => {
              onChange("");
            }}
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoClose size={20} />
          </button>
        )}
      </div>

      {isError && (
        <div className="text-red-500 text-sm mt-2 ml-1">{errorMessage}</div>
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
      className={`w-full h-14 rounded-lg text-lg font-medium transition-colors ${
        isSubmittable
          ? "bg-[#FB6836] hover:bg-[#e55a2d] text-white"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
    >
      {isLoading ? <Loader2 className="size-[20] animate-spin" /> : label}
    </button>
  );
}

export { FormInput, FormButton };
