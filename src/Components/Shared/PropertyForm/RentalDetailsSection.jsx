import React from "react";
import { KeyRound } from "lucide-react";
import { useGetConstantsQuery } from "../../../REDUX_FEATURES/REDUX_SLICES/constantsApi/constantsApi";

const inputCls =
  "w-full h-10 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm";
const labelCls =
  "block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5";

const Field = ({ label, children }) => (
  <div>
    <label className={labelCls}>{label}</label>
    {children}
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <Field label={label}>
    <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select</option>
      {(options || []).map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </Field>
);

const InputField = ({ label, type = "text", value, onChange }) => (
  <Field label={label}>
    <input className={inputCls} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
  </Field>
);

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

const RentalDetailsSection = ({ rentalDetails = {}, onChange }) => {
  const { data: constants } = useGetConstantsQuery();

  const set = (field) => (val) => onChange(`rentalDetails.${field}`, val);

  const toggleArray = (field, item) => {
    const current = rentalDetails[field] || [];
    const next = current.includes(item)
      ? current.filter((x) => x !== item)
      : [...current, item];
    set(field)(next);
  };

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
          <SelectField
            label="Occupation Preference"
            value={rentalDetails.occupationPreference || ""}
            onChange={set("occupationPreference")}
            options={constants?.OCCUPATION_PREFERENCES}
          />
          <SelectField
            label="Rental Agreement Duration"
            value={rentalDetails.rentalAgreementDuration || ""}
            onChange={set("rentalAgreementDuration")}
            options={constants?.RENTAL_AGREEMENT_DURATIONS}
          />
          <SelectField
            label="Minimum Stay Duration"
            value={rentalDetails.minimumStayDuration || ""}
            onChange={set("minimumStayDuration")}
            options={constants?.MINIMUM_STAY_DURATIONS}
          />
          <SelectField
            label="Lock-in Period"
            value={rentalDetails.lockInPeriod || ""}
            onChange={set("lockInPeriod")}
            options={constants?.LOCK_IN_PERIODS}
          />
          <SelectField
            label="Availability"
            value={rentalDetails.availability || ""}
            onChange={set("availability")}
            options={constants?.AVAILABILITY_OPTIONS}
          />
          {rentalDetails.availability === "Specific Date" && (
            <InputField
              label="Availability Date"
              type="date"
              value={rentalDetails.availabilityDate || ""}
              onChange={set("availabilityDate")}
            />
          )}
          <SelectField
            label="Food Preference"
            value={rentalDetails.foodPreference || ""}
            onChange={set("foodPreference")}
            options={constants?.FOOD_PREFERENCES}
          />
          <SelectField
            label="Security Deposit"
            value={rentalDetails.securityDeposit || ""}
            onChange={set("securityDeposit")}
            options={constants?.SECURITY_DEPOSIT_OPTIONS}
          />
          {rentalDetails.securityDeposit === "Custom Amount" && (
            <InputField
              label="Security Deposit Custom Amount (₹)"
              type="number"
              value={rentalDetails.securityDepositCustomAmount ?? ""}
              onChange={set("securityDepositCustomAmount")}
            />
          )}
          <SelectField
            label="Preferred Move-in Date"
            value={rentalDetails.preferredMoveInDate || ""}
            onChange={set("preferredMoveInDate")}
            options={constants?.AVAILABILITY_OPTIONS}
          />
          {rentalDetails.preferredMoveInDate === "Specific Date" && (
            <InputField
              label="Preferred Move-in Date (Specific)"
              type="date"
              value={rentalDetails.preferredMoveInDateSpecific || ""}
              onChange={set("preferredMoveInDateSpecific")}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectField
            label="Pets"
            value={rentalDetails.pets || ""}
            onChange={set("pets")}
            options={constants?.ALLOWANCE_POLICY_OPTIONS}
          />
          <SelectField
            label="Smoking"
            value={rentalDetails.smoking || ""}
            onChange={set("smoking")}
            options={constants?.ALLOWANCE_POLICY_OPTIONS}
          />
          <SelectField
            label="Alcohol"
            value={rentalDetails.alcohol || ""}
            onChange={set("alcohol")}
            options={constants?.ALLOWANCE_POLICY_OPTIONS}
          />
          <SelectField
            label="Guest Policy"
            value={rentalDetails.guestPolicy || ""}
            onChange={set("guestPolicy")}
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
          onChange={set("governmentEmployeePreferred")}
        />
      </div>
    </Section>
  );
};

export default RentalDetailsSection;
