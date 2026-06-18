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
  // ... Baaki styles copy from AccommodationInquiryTemplatePdf.jsx
});

// Buy Property fields
const BUY_PROPERTY_TYPES = [
  "Flat / Apartment", "Independent House", "Villa", "Plot / Land",
  "Farm House", "Shop", "Office Space", "Warehouse",
  "Commercial Property", "Industrial Property", "Other"
];

const INTENDED_USES = [
  "Self Use", "Investment", "Rental Income", "Office",
  "Retail Shop", "Restaurant / Cafe", "Bank Branch", "ATM",
  "Gym / Fitness Center", "Clinic / Hospital", "Pharmacy",
  "Showroom", "Warehouse / Storage", "Educational Institute",
  "Hotel / Guest House", "Co-Living", "PG", "Other"
];

const BUY_BUDGET_RANGES = [
  "Under ₹25 Lakh", "₹25–50 Lakh", "₹50 Lakh–1 Crore",
  "₹1–2 Crore", "₹2–5 Crore", "Above ₹5 Crore"
];

const BUY_BHK_OPTIONS = ["Studio", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"];

const PROPERTY_STATUSES = [
  "Ready to Move", "Under Construction", "Newly Launched", "Any"
];

const BUY_PRIORITIES = [
  "Immediate (Within 7 Days)", "Within 15 Days", "Within 1 Month",
  "Within 3 Months", "Within 6 Months", "Just Exploring"
];

const BUY_AMENITIES = [
  "Parking", "Lift", "Security", "CCTV", "Power Backup",
  "Garden", "Club House", "Gym", "Swimming Pool", "Children's Play Area"
];

// Reuse RadioGroup, CheckboxGroup, Section, BlankField components from AccommodationInquiryTemplatePdf.jsx

export const BuyPropertyTemplatePdf = ({ constants = {} }) => {
  const c = constants;

  return (
    <Document title="Buy Property Inquiry Form" author="Mehta Estates">
      <Page size="A4" style={styles.page} wrap>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>MEHTA ESTATES</Text>
          <Text style={styles.title}>BUY PROPERTY INQUIRY FORM</Text>
        </View>

        <View style={styles.metaRow}>
          <Text>Date: _______________________</Text>
          <Text>Form ID: _______________________</Text>
        </View>

        {/* 1. Personal Details */}
        <Section title="1. Personal Details">
          <View style={styles.grid2}>
            <BlankField label="Full Name" half />
            <BlankField label="Mobile No." half />
            <BlankField label="Email" half />
            <BlankField label="City" half />
          </View>
        </Section>

        {/* 2. Property Type */}
        <Section title="2. Property Type" hint="Select one option">
          <RadioGroup options={BUY_PROPERTY_TYPES} columns={3} />
        </Section>

        {/* 3. Intended Use */}
        <Section title="3. Intended Use" hint="Select all that apply">
          <CheckboxGroup options={INTENDED_USES} columns={3} />
        </Section>

        {/* 4. Location */}
        <Section title="4. Location Requirement">
          <View style={styles.grid2}>
            <BlankField label="Preferred City" half />
            <BlankField label="Preferred Area / Locality" half />
          </View>
          <BlankField label="Landmark" />
        </Section>

        {/* 5. Budget */}
        <Section title="5. Budget Range" hint="Select one option">
          <RadioGroup options={BUY_BUDGET_RANGES} columns={3} />
        </Section>

        {/* 6. BHK Requirement */}
        <Section title="6. BHK Requirement" hint="Select one option">
          <RadioGroup options={BUY_BHK_OPTIONS} columns={3} />
        </Section>

        {/* 7. Minimum Property Size */}
        <Section title="7. Minimum Property Size">
          <BlankField label="Size in Sq. Ft. / Sq. Yard / Acre / Hectare" />
        </Section>

        {/* 8. Property Status Preference */}
        <Section title="8. Property Status Preference" hint="Select one option">
          <RadioGroup options={PROPERTY_STATUSES} columns={2} />
        </Section>

        {/* 9. Priority */}
        <Section title="9. Priority / Required By" hint="Select one option">
          <RadioGroup options={BUY_PRIORITIES} columns={3} />
        </Section>

        {/* 10. Amenities */}
        <Section title="10. Amenities Preferred" hint="Select all that apply">
          <CheckboxGroup options={BUY_AMENITIES} columns={2} />
        </Section>

        {/* 11. Remarks */}
        <Section title="11. Remarks & Special Conditions">
          <View style={styles.textArea} />
        </Section>

        {/* 12. Message */}
        <Section title="12. Message / Detailed Requirement">
          <View style={styles.textAreaLarge} />
        </Section>

        {/* 13. Attachments */}
        <Section title="13. Attachments">
          <BlankField label="Reference Images" />
          <BlankField label="Floor Images" />
          <BlankField label="Location Images" />
          <BlankField label="Other Files" />
        </Section>

        {/* Declaration */}
        <Section title="Declaration" wrap={false}>
          <Text style={{ fontSize: 7.5, marginBottom: 6 }}>
            I declare that all information provided above is true and correct.
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 7.5 }}>Signature: _________________________</Text>
            <Text style={{ fontSize: 7.5 }}>Date: _________________________</Text>
          </View>
        </Section>

        {/* Office Use */}
        <Section title="For Office Use Only" office wrap={false}>
          <View style={styles.grid2}>
            <BlankField label="Received By" half />
            <BlankField label="Date Received" half />
          </View>
          <Text style={styles.subLabel}>Lead Status</Text>
          <RadioGroup
            options={["New", "Assigned", "Contacted", "Converted", "Closed", "Rejected"]}
            columns={3}
          />
          <Text style={{ fontSize: 7.5, marginTop: 4, marginBottom: 2 }}>Admin Remarks</Text>
          <View style={styles.textArea} />
        </Section>
      </Page>
    </Document>
  );
};

export default BuyPropertyTemplatePdf;