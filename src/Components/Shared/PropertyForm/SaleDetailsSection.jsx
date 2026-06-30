import React from "react";
import { Tag } from "lucide-react";
import { useGetConstantsQuery } from "../../../REDUX_FEATURES/REDUX_SLICES/constantsApi/constantsApi";

const inputCls =
  "w-full h-10 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm";
const labelCls =
  "block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5";

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className={labelCls}>{label}</label>
    <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select</option>
      {(options || []).map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);

const SaleDetailsSection = ({ saleDetails = {}, onChange }) => {
  const { data: constants } = useGetConstantsQuery();

  const set = (field) => (val) => onChange(`saleDetails.${field}`, val);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden lg:col-span-2">
      <div className="px-6 py-4 flex items-center gap-3 border-b">
        <Tag className="w-5 h-5 text-blue-600" />
        <span className="text-base font-semibold text-slate-800">Sale Details</span>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Possession Status"
            value={saleDetails.possessionStatus || ""}
            onChange={set("possessionStatus")}
            options={constants?.POSSESSION_STATUSES}
          />
          <SelectField
            label="Loan Availability"
            value={saleDetails.loanAvailability || ""}
            onChange={set("loanAvailability")}
            options={constants?.LOAN_AVAILABILITY}
          />
        </div>
      </div>
    </div>
  );
};

export default SaleDetailsSection;
