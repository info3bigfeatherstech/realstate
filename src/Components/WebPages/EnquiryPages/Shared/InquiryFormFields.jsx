export const inputCls =
  "w-full h-10 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white";

export const labelCls = "block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5";

export const Field = ({ label, required, children }) => (
  <div>
    <label className={labelCls}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

export const InputField = ({ label, required, type = "text", placeholder, value, onChange, maxLength }) => (
  <Field label={label} required={required}>
    <input
      className={inputCls}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={maxLength}
    />
  </Field>
);

export const SelectField = ({ label, required, value, onChange, options }) => (
  <Field label={label} required={required}>
    <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select</option>
      {(options || []).map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </Field>
);

export const TextAreaField = ({ label, value, onChange, maxLength = 2000, rows = 4, placeholder }) => (
  <Field label={label}>
    <textarea
      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white resize-none"
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={maxLength}
      placeholder={placeholder}
    />
  </Field>
);

export const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
      <Icon className="w-4 h-4 text-blue-600" />
    </div>
    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{title}</h3>
  </div>
);

export const CheckboxGroup = ({ label, options, selected, onChange }) => (
  <Field label={label}>
    <div className="flex flex-wrap gap-2">
      {(options || []).map((option) => {
        const isSelected = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              isSelected ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  </Field>
);

export const FileField = ({ label, multiple, accept, files, onChange }) => (
  <Field label={label}>
    <input type="file" accept={accept} multiple={multiple} onChange={(e) => onChange(Array.from(e.target.files || []))} className="text-sm text-slate-600" />
    {files?.length > 0 && <p className="text-xs text-slate-400 mt-1">{files.length} file(s) selected</p>}
  </Field>
);

export const toggleArrayValue = (arr, value) =>
  arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
