import { useState } from "react";

type InputProps = {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
};

export function Input({ value, placeholder = "Ask a question…", onChange, onSubmit }: InputProps) {
  const [internalValue, setInternalValue] = useState(value ?? "");
  const currentValue = value ?? internalValue;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  const handleSubmit = () => {
    onSubmit?.(currentValue);
  };

  return (
    <div className="self-stretch shrink-0 bg-[#FAFAF9] border border-[#E4E4E0] rounded-full overflow-hidden flex justify-between items-center pt-2 pr-2 pb-2 pl-5.5">
      <input
        type="text"
        value={currentValue}
        onChange={handleChange}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSubmit();
          }
        }}
        placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent border-0 px-0 py-0 text-[15px] leading-normal text-[#111111] placeholder:text-[#6B6B6B] focus:outline-none"
      />
      <button
        type="button"
        onClick={handleSubmit}
        className="w-10 h-10 shrink-0 bg-[#111111] rounded-full overflow-hidden flex justify-center items-center text-[18px] font-bold text-[#FFFFFF] cursor-pointer transition-opacity hover:opacity-90"
        aria-label="Send question"
      >
        ↑
      </button>
    </div>
  );
}
