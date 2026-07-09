import React from "react";

const inputCls =
  "w-full h-10 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm";
const labelCls =
  "block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5";

export const OTHER_OPTION = "Other";

const Field = ({ label, required, children }) => (
  <div>
    <label className={labelCls}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

export const withOtherOption = (options = []) => {
  const list = options.filter((o) => o !== OTHER_OPTION);
  return [...list, OTHER_OPTION];
};

export const SelectFieldWithOther = ({
  label,
  required,
  value,
  otherValue = "",
  onChange,
  onOtherChange,
  options = [],
  otherPlaceholder = "Please specify",
}) => {
  const selectOptions = withOtherOption(options);

  return (
    <div className="space-y-2">
      <Field label={label} required={required}>
        <select
          className={inputCls}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select</option>
          {selectOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>
      {value === OTHER_OPTION && (
        <Field label={`${label} (custom)`} required={required}>
          <input
            className={inputCls}
            type="text"
            placeholder={otherPlaceholder}
            value={otherValue}
            onChange={(e) => onOtherChange(e.target.value)}
          />
        </Field>
      )}
    </div>
  );
};

const clampNonNegative = (raw) => {
  if (raw === "" || raw === null || raw === undefined) return "";
  const n = Number(raw);
  if (!Number.isFinite(n)) return "";
  return String(Math.max(0, n));
};

export const NumberInputField = ({
  label,
  required,
  placeholder,
  value,
  onChange,
  min = 0,
  max,
}) => (
  <Field label={label} required={required}>
    <input
      className={inputCls}
      type="number"
      min={min}
      max={max}
      placeholder={placeholder}
      value={value ?? ""}
      onChange={(e) => {
        let next = e.target.value;
        if (next !== "" && min >= 0) {
          next = clampNonNegative(next);
        }
        onChange(next);
      }}
      onKeyDown={(e) => {
        if (min >= 0 && (e.key === "-" || e.key === "e" || e.key === "E")) {
          e.preventDefault();
        }
      }}
    />
  </Field>
);

export default SelectFieldWithOther;
