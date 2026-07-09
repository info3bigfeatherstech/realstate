import React from "react";
import { Tag } from "lucide-react";
import { useGetConstantsQuery } from "../../../REDUX_FEATURES/REDUX_SLICES/constantsApi/constantsApi";
import SelectFieldWithOther from "./SelectFieldWithOther";
import { OTHER_OPTION } from "../../../utils/propertyFormPayload";

const OtherSaleSelect = ({ label, fieldKey, saleDetails, onChange, options }) => {
  const otherValues = saleDetails.otherValues || {};
  return (
    <SelectFieldWithOther
      label={label}
      value={saleDetails[fieldKey] || ""}
      otherValue={otherValues[fieldKey] || ""}
      onChange={(val) => {
        onChange(`saleDetails.${fieldKey}`, val);
        if (val !== OTHER_OPTION) {
          onChange("saleDetails.otherValues", { ...otherValues, [fieldKey]: "" });
        }
      }}
      onOtherChange={(val) =>
        onChange("saleDetails.otherValues", { ...otherValues, [fieldKey]: val })
      }
      options={options}
    />
  );
};

const SaleDetailsSection = ({ saleDetails = {}, onChange }) => {
  const { data: constants } = useGetConstantsQuery();

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden lg:col-span-2">
      <div className="px-6 py-4 flex items-center gap-3 border-b">
        <Tag className="w-5 h-5 text-blue-600" />
        <span className="text-base font-semibold text-slate-800">Sale Details</span>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <OtherSaleSelect
            label="Possession Status"
            fieldKey="possessionStatus"
            saleDetails={saleDetails}
            onChange={onChange}
            options={constants?.POSSESSION_STATUSES}
          />
          <OtherSaleSelect
            label="Loan Availability"
            fieldKey="loanAvailability"
            saleDetails={saleDetails}
            onChange={onChange}
            options={constants?.LOAN_AVAILABILITY}
          />
        </div>
      </div>
    </div>
  );
};

export default SaleDetailsSection;
