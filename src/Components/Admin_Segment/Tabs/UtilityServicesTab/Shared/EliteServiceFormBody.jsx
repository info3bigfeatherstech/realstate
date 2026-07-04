// src/Tabs/UtilityServicesTab/Shared/EliteServiceFormBody.jsx
import React from "react";
import { User, MapPin, Phone, Briefcase } from "lucide-react";

// ─── Schema-matched enums ─────────────────────────────────────────────────────
const ELITE_SERVICE_STATUSES = ["Available", "Busy"];
// ─────────────────────────────────────────────────────────────────────────────

const inputCls =
  "w-full h-10 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white";
const labelCls =
  "block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5";

const Field = ({ label, required, children }) => (
  <div>
    <label className={labelCls}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const InputField = ({
  label,
  required,
  type = "text",
  placeholder,
  value,
  onChange,
  maxLength,
}) => (
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

const SelectField = ({ label, required, value, onChange, options }) => (
  <Field label={label} required={required}>
    <select
      className={inputCls}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </Field>
);

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
      <Icon className="w-4 h-4 text-blue-600" />
    </div>
    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
      {title}
    </h3>
  </div>
);

const EliteServiceFormBody = ({ formData, onChange, roles = [] }) => {
  const set = (field) => (val) => onChange(field, val);

  return (
    <div className="space-y-6">

      {/* Card 1 — Role & Status */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <SectionHeader icon={Briefcase} title="Service Info" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SelectField
            label="Service Role"
            required
            value={formData.role}
            onChange={set("role")}
            options={roles}
          />
          <SelectField
            label="Status"
            value={formData.status}
            onChange={set("status")}
            options={ELITE_SERVICE_STATUSES}
          />
        </div>
      </div>

      {/* Card 2 — Provider Details */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <SectionHeader icon={User} title="Provider Details" />
        <div className="grid grid-cols-1 gap-5">
          <InputField
            label="Provider Name"
            required
            placeholder="Enter full name"
            value={formData.providerName}
            onChange={set("providerName")}
            maxLength={120}
          />
          <Field label="Shop Address" required>
            <textarea
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white resize-none"
              rows={3}
              placeholder="Enter shop address"
              value={formData.address}
              onChange={(e) => onChange("address", e.target.value)}
              maxLength={500}
            />
          </Field>
        </div>
      </div>

      {/* Card 3 — Contact */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <SectionHeader icon={Phone} title="Contact Numbers" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField
            label="Primary Mobile / whatsapp No."
            required
            type="tel"
            placeholder="+91 XXXXXXXXXX"
            value={formData.primaryMobile}
            onChange={set("primaryMobile")}
            maxLength={20}
          />
          <InputField
            label="Secondary Mobile"
            type="tel"
            placeholder="+91 XXXXXXXXXX (Optional)"
            value={formData.secondaryMobile}
            onChange={set("secondaryMobile")}
            maxLength={20}
          />
        </div>
      </div>

    </div>
  );
};

export default EliteServiceFormBody;