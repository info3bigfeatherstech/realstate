import React from "react";
import { KeyRound } from "lucide-react";
import { useGetConstantsQuery } from "../../../REDUX_FEATURES/REDUX_SLICES/constantsApi/constantsApi";
import SelectFieldWithOther, { NumberInputField } from "./SelectFieldWithOther";
import { OTHER_OPTION } from "../../../utils/propertyFormPayload";

const labelCls =
  "block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5";

const CheckItem = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 rounded accent-blue-600" />
    <span className="text-sm text-slate-700">{label}</span>
  </label>
);

const Section = ({ title, children }) => (
  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden lg:col-span-2">
    <div className="px-6 py-4 flex items-center gap-3 border-b">
      <KeyRound className="w-5 h-5 text-blue-600" />
      <span className="text-base font-semibold text-slate-800">{title}</span>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const inputCls =
  "w-full h-10 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm";

const DateField = ({ label, value, onChange }) => (
  <div>
    <label className={labelCls}>{label}</label>
    <input className={inputCls} type="date" value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const OtherRentalSelect = ({ label, fieldKey, rentalDetails, onChange, options }) => {
  const otherValues = rentalDetails.otherValues || {};
  return (
    <SelectFieldWithOther
      label={label}
      value={rentalDetails[fieldKey] || ""}
      otherValue={otherValues[fieldKey] || ""}
      onChange={(val) => {
        onChange(`rentalDetails.${fieldKey}`, val);
        if (val !== OTHER_OPTION) {
          onChange("rentalDetails.otherValues", { ...otherValues, [fieldKey]: "" });
        }
      }}
      onOtherChange={(val) =>
        onChange("rentalDetails.otherValues", { ...otherValues, [fieldKey]: val })
      }
      options={options}
    />
  );
};

const RentalDetailsSection = ({ rentalDetails = {}, onChange }) => {
  const { data: constants } = useGetConstantsQuery();

  const toggleArray = (field, item) => {
    const current = rentalDetails[field] || [];
    const next = current.includes(item)
      ? current.filter((x) => x !== item)
      : [...current, item];
    onChange(`rentalDetails.${field}`, next);
  };

  const securityDeposit = rentalDetails.securityDeposit || "";

  return (
    <Section title="Rental Details">
      <div className="space-y-6">
        <div>
          <label className={labelCls}>Tenant Type Allowed</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
            {(constants?.TENANT_TYPES ?? []).map((item) => (
              <CheckItem
                key={item}
                label={item}
                checked={rentalDetails.tenantTypeAllowed?.includes(item)}
                onChange={() => toggleArray("tenantTypeAllowed", item)}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <OtherRentalSelect
            label="Occupation Preference"
            fieldKey="occupationPreference"
            rentalDetails={rentalDetails}
            onChange={onChange}
            options={constants?.OCCUPATION_PREFERENCES}
          />
          <OtherRentalSelect
            label="Rental Agreement Duration"
            fieldKey="rentalAgreementDuration"
            rentalDetails={rentalDetails}
            onChange={onChange}
            options={constants?.RENTAL_AGREEMENT_DURATIONS}
          />
          <OtherRentalSelect
            label="Minimum Stay Duration"
            fieldKey="minimumStayDuration"
            rentalDetails={rentalDetails}
            onChange={onChange}
            options={constants?.MINIMUM_STAY_DURATIONS}
          />
          <OtherRentalSelect
            label="Lock-in Period"
            fieldKey="lockInPeriod"
            rentalDetails={rentalDetails}
            onChange={onChange}
            options={constants?.LOCK_IN_PERIODS}
          />
          <OtherRentalSelect
            label="Availability"
            fieldKey="availability"
            rentalDetails={rentalDetails}
            onChange={onChange}
            options={constants?.AVAILABILITY_OPTIONS}
          />
          {rentalDetails.availability === "Specific Date" && (
            <DateField
              label="Availability Date"
              value={rentalDetails.availabilityDate || ""}
              onChange={(val) => onChange("rentalDetails.availabilityDate", val)}
            />
          )}
          <OtherRentalSelect
            label="Food Preference"
            fieldKey="foodPreference"
            rentalDetails={rentalDetails}
            onChange={onChange}
            options={constants?.FOOD_PREFERENCES}
          />
          <OtherRentalSelect
            label="Security Deposit"
            fieldKey="securityDeposit"
            rentalDetails={rentalDetails}
            onChange={onChange}
            options={constants?.SECURITY_DEPOSIT_OPTIONS}
          />
          {securityDeposit === "Custom Amount" && (
            <NumberInputField
              label="Security Deposit Custom Amount (₹)"
              value={rentalDetails.securityDepositCustomAmount ?? ""}
              onChange={(val) => onChange("rentalDetails.securityDepositCustomAmount", val)}
            />
          )}
          <OtherRentalSelect
            label="Preferred Move-in Date"
            fieldKey="preferredMoveInDate"
            rentalDetails={rentalDetails}
            onChange={onChange}
            options={constants?.AVAILABILITY_OPTIONS}
          />
          {rentalDetails.preferredMoveInDate === "Specific Date" && (
            <DateField
              label="Preferred Move-in Date (Specific)"
              value={rentalDetails.preferredMoveInDateSpecific || ""}
              onChange={(val) => onChange("rentalDetails.preferredMoveInDateSpecific", val)}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <OtherRentalSelect
            label="Pets"
            fieldKey="pets"
            rentalDetails={rentalDetails}
            onChange={onChange}
            options={constants?.ALLOWANCE_POLICY_OPTIONS}
          />
          <OtherRentalSelect
            label="Smoking"
            fieldKey="smoking"
            rentalDetails={rentalDetails}
            onChange={onChange}
            options={constants?.ALLOWANCE_POLICY_OPTIONS}
          />
          <OtherRentalSelect
            label="Alcohol"
            fieldKey="alcohol"
            rentalDetails={rentalDetails}
            onChange={onChange}
            options={constants?.ALLOWANCE_POLICY_OPTIONS}
          />
          <OtherRentalSelect
            label="Guest Policy"
            fieldKey="guestPolicy"
            rentalDetails={rentalDetails}
            onChange={onChange}
            options={constants?.GUEST_POLICY_OPTIONS}
          />
        </div>

        <div>
          <label className={labelCls}>Employment Verification Required</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
            {(constants?.EMPLOYMENT_VERIFICATION ?? []).map((item) => (
              <CheckItem
                key={item}
                label={item}
                checked={rentalDetails.employmentVerification?.includes(item)}
                onChange={() => toggleArray("employmentVerification", item)}
              />
            ))}
          </div>
        </div>

        <div>
          <label className={labelCls}>Tenant Verification Required</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
            {(constants?.TENANT_VERIFICATION ?? []).map((item) => (
              <CheckItem
                key={item}
                label={item}
                checked={rentalDetails.tenantVerification?.includes(item)}
                onChange={() => toggleArray("tenantVerification", item)}
              />
            ))}
          </div>
        </div>

        <CheckItem
          label="Government Employee Preferred"
          checked={Boolean(rentalDetails.governmentEmployeePreferred)}
          onChange={(val) => onChange("rentalDetails.governmentEmployeePreferred", val)}
        />
      </div>
    </Section>
  );
};

export default RentalDetailsSection;
