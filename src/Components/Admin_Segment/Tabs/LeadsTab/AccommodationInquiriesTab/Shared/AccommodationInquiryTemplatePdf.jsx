import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 32,
    paddingHorizontal: 32,
    fontSize: 8,
    fontFamily: "Helvetica",
    color: "#1e293b",
    lineHeight: 1.35,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: "#2563eb",
    paddingBottom: 6,
  },
  brand: { fontSize: 10, fontWeight: "bold", color: "#2563eb" },
  title: { fontSize: 11, fontWeight: "bold", textAlign: "right", maxWidth: 220 },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    fontSize: 7.5,
    color: "#64748b",
  },
  section: {
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 3,
    padding: 6,
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#0f172a",
    textTransform: "uppercase",
  },
  sectionHint: { fontSize: 7, color: "#64748b", marginBottom: 3 },
  subLabel: { fontSize: 7.5, fontWeight: "bold", marginBottom: 3, marginTop: 4 },
  grid2: { flexDirection: "row", flexWrap: "wrap" },
  grid2Item: { width: "50%", paddingRight: 8 },
  blankLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#94a3b8",
    marginBottom: 5,
    height: 14,
  },
  optionRow: { flexDirection: "row", flexWrap: "wrap" },
  optionHalf: { width: "50%", flexDirection: "row", alignItems: "center", marginBottom: 3, paddingRight: 6 },
  optionThird: { width: "33.33%", flexDirection: "row", alignItems: "center", marginBottom: 3, paddingRight: 4 },
  optionQuarter: { width: "25%", flexDirection: "row", alignItems: "center", marginBottom: 3, paddingRight: 4 },
  optionLabel: { fontSize: 7.5, flex: 1 },
  radioOuter: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    borderWidth: 1,
    borderColor: "#334155",
    marginRight: 4,
  },
  checkboxOuter: {
    width: 7,
    height: 7,
    borderWidth: 1,
    borderColor: "#334155",
    marginRight: 4,
  },
  textArea: { borderWidth: 1, borderColor: "#94a3b8", height: 28, marginBottom: 4 },
  textAreaLarge: { borderWidth: 1, borderColor: "#94a3b8", height: 40, marginBottom: 4 },
  officeSection: { backgroundColor: "#f8fafc" },
});

const pdfLabel = (value) =>
  String(value ?? "")
    .replace(/₹/g, "Rs.")
    .replace(/–/g, "-");

const BlankField = ({ label, half }) => (
  <View style={half ? styles.grid2Item : { marginBottom: 4 }}>
    <Text style={{ fontSize: 7.5, marginBottom: 1 }}>{label}</Text>
    <View style={styles.blankLine} />
  </View>
);

const RadioOption = ({ label }) => (
  <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
    <View style={styles.radioOuter} />
    <Text style={styles.optionLabel}>{pdfLabel(label)}</Text>
  </View>
);

const CheckboxOption = ({ label }) => (
  <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
    <View style={styles.checkboxOuter} />
    <Text style={styles.optionLabel}>{pdfLabel(label)}</Text>
  </View>
);

const RadioGroup = ({ options, columns = 2 }) => {
  const colStyle =
    columns === 4
      ? styles.optionQuarter
      : columns === 3
        ? styles.optionThird
        : styles.optionHalf;

  return (
    <View style={styles.optionRow}>
      {(options || []).map((option) => (
        <View key={option} style={colStyle}>
          <RadioOption label={option} />
        </View>
      ))}
    </View>
  );
};

const CheckboxGroup = ({ options }) => (
  <View style={styles.optionRow}>
    {(options || []).map((option) => (
      <View key={option} style={styles.optionThird}>
        <CheckboxOption label={option} />
      </View>
    ))}
  </View>
);

const Section = ({ title, hint, children, office, wrap = true }) => (
  <View wrap={wrap} style={[styles.section, office && styles.officeSection]}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {hint ? <Text style={styles.sectionHint}>{hint}</Text> : null}
    {children}
  </View>
);

const PageHeader = () => (
  <View fixed style={styles.header}>
    <Text style={styles.brand}>MEHTA ESTATES</Text>
    <Text style={styles.title}>ACCOMMODATION REQUIREMENT FORM</Text>
  </View>
);

export const AccommodationInquiryTemplatePdf = ({ constants = {} }) => {
  const c = constants;

  return (
    <Document
      title="Accommodation Requirement Form"
      author="Mehta Estates"
      subject="Offline accommodation inquiry template"
    >
      <Page size="A4" style={styles.page} wrap>
        <PageHeader />

        <View style={styles.metaRow}>
          <Text>Date: _______________________</Text>
          <Text>Form ID: _______________________</Text>
        </View>

        <Section title="1. Personal Details">
          <View style={styles.grid2}>
            <BlankField label="Full Name" half />
            <BlankField label="Mobile No." half />
            <BlankField label="Email" half />
            <BlankField label="Alternative Mobile" half />
          </View>
        </Section>

        <Section title="2. Requirement Type" hint="Select one option">
          <RadioGroup options={c.REQUIREMENT_TYPES} columns={3} />
        </Section>

        <Section title="3. Occupant Type" hint="Select one option">
          <RadioGroup options={c.OCCUPANT_TYPES} />
        </Section>

        <Section title="4. Gender Preference" hint="Select one option">
          <RadioGroup options={c.GENDER_PREFERENCES} columns={3} />
        </Section>

        <Section title="5. Preferred Location">
          <View style={styles.grid2}>
            <BlankField label="City" half />
            <BlankField label="Area / Locality" half />
          </View>
          <BlankField label="Landmark (optional)" />
        </Section>

        <Section title="6. Monthly Budget" hint="Select one option">
          <RadioGroup options={c.MONTHLY_BUDGETS} columns={3} />
        </Section>

        <Section title="7. Rental Property Requirements" hint="Fill only if Rental Property is selected">
          <Text style={styles.subLabel}>Property Type</Text>
          <RadioGroup options={c.INQUIRY_PROPERTY_TYPES} columns={3} />
          <Text style={styles.subLabel}>BHK Requirement</Text>
          <RadioGroup options={c.BHK_REQUIREMENTS} columns={3} />
        </Section>

        <Section title="8. Occupancy & Lifestyle Preferences">
          <Text style={styles.subLabel}>Tenant Type</Text>
          <RadioGroup options={c.TENANT_TYPE_PREFERENCES} />

          <Text style={styles.subLabel}>Food Preference</Text>
          <RadioGroup options={c.INQUIRY_FOOD_PREFERENCES} columns={3} />

          <Text style={styles.subLabel}>Pet Preference</Text>
          <RadioGroup options={c.INQUIRY_PET_PREFERENCES} columns={3} />

          <Text style={styles.subLabel}>Smoking Preference</Text>
          <RadioGroup options={c.INQUIRY_SMOKING_PREFERENCES} />

          <Text style={styles.subLabel}>Alcohol Preference</Text>
          <RadioGroup options={c.INQUIRY_ALCOHOL_PREFERENCES} columns={3} />

          <Text style={styles.subLabel}>Sharing Preference (PG / Co-Living)</Text>
          <RadioGroup options={c.SHARING_PREFERENCES} />

          <Text style={styles.subLabel}>Furnishing Preference</Text>
          <RadioGroup options={c.INQUIRY_FURNISHING_PREFERENCES} />
        </Section>

        <Section title="9. Amenities Required" hint="Select all that apply">
          <CheckboxGroup options={c.INQUIRY_AMENITIES} />
        </Section>

        <Section title="10. Move-in Priority" hint="Select one option">
          <RadioGroup options={c.MOVE_IN_PRIORITIES} columns={3} />
        </Section>

        <Section title="11. Remarks & Attachments" wrap={false}>
          <Text style={{ fontSize: 7.5, marginBottom: 2 }}>Remarks & Special Conditions</Text>
          <View style={styles.textArea} />
          <Text style={{ fontSize: 7.5, marginBottom: 2 }}>Message / Detailed Requirement</Text>
          <View style={styles.textAreaLarge} />
        </Section>

        <Section title="Declaration" wrap={false}>
          <Text style={{ fontSize: 7.5, marginBottom: 6 }}>
            I declare that all information provided above is true and correct to the best of my knowledge.
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 7.5 }}>Signature: _________________________</Text>
            <Text style={{ fontSize: 7.5 }}>Date: _________________________</Text>
          </View>
        </Section>

        <Section title="For Office Use Only" office wrap={false}>
          <View style={styles.grid2}>
            <BlankField label="Received By" half />
            <BlankField label="Date Received" half />
          </View>
          <Text style={styles.subLabel}>Status</Text>
          <RadioGroup
            options={c.ADMIN_INQUIRY_STATUSES || ["New", "Contacted", "Converted", "Lost", "Closed"]}
            columns={3}
          />
          <Text style={{ fontSize: 7.5, marginTop: 4, marginBottom: 2 }}>Admin Remarks</Text>
          <View style={styles.textArea} />
        </Section>
      </Page>
    </Document>
  );
};

export default AccommodationInquiryTemplatePdf;
