type InputProps = {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Input({
  label,
  name,
  value,
  placeholder,
  onChange,
}: InputProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <input
        required
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full rounded-xl border border-slate-300
          px-4 py-3 outline-none
          focus:border-indigo-500
          focus:ring-2
          focus:ring-indigo-100
        "
      />
    </label>
  );
}