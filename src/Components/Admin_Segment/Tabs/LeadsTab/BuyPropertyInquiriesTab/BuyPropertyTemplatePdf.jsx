import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 8, fontFamily: "Helvetica", color: "#1e293b", lineHeight: 1.35 },
    header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8, borderBottomWidth: 1.5, borderBottomColor: "#2563eb", paddingBottom: 6 },
    brand: { fontSize: 10, fontWeight: "bold", color: "#2563eb" },
    title: { fontSize: 11, fontWeight: "bold", textAlign: "right" },
    metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8, fontSize: 7.5, color: "#64748b" },
    section: { marginBottom: 6, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 3, padding: 6 },
    sectionTitle: { fontSize: 8, fontWeight: "bold", marginBottom: 4, color: "#0f172a", textTransform: "uppercase" },
    sectionHint: { fontSize: 7, color: "#64748b", marginBottom: 3 },
    subLabel: { fontSize: 7.5, fontWeight: "bold", marginBottom: 3, marginTop: 4 },
    grid2: { flexDirection: "row", flexWrap: "wrap" },
    grid2Item: { width: "50%", paddingRight: 8 },
    blankLine: { borderBottomWidth: 1, borderBottomColor: "#94a3b8", marginBottom: 5, height: 14 },
    optionRow: { flexDirection: "row", flexWrap: "wrap" },
    optionHalf: { width: "50%", flexDirection: "row", alignItems: "center", marginBottom: 3, paddingRight: 6 },
    optionThird: { width: "33.33%", flexDirection: "row", alignItems: "center", marginBottom: 3, paddingRight: 4 },
    optionLabel: { fontSize: 7.5, flex: 1 },
    radioOuter: { width: 7, height: 7, borderRadius: 3.5, borderWidth: 1, borderColor: "#334155", marginRight: 4 },
    checkboxOuter: { width: 7, height: 7, borderWidth: 1, borderColor: "#334155", marginRight: 4 },
    textArea: { borderWidth: 1, borderColor: "#94a3b8", height: 28, marginBottom: 4 },
    textAreaLarge: { borderWidth: 1, borderColor: "#94a3b8", height: 40, marginBottom: 4 },
    officeSection: { backgroundColor: "#f8fafc" },
});

const BlankField = ({ label, half }) => (
    <View style={half ? styles.grid2Item : { marginBottom: 4 }}>
        <Text style={{ fontSize: 7.5, marginBottom: 1 }}>{label}</Text>
        <View style={styles.blankLine} />
    </View>
);

const RadioOption = ({ label }) => (
    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <View style={styles.radioOuter} />
        <Text style={styles.optionLabel}>{label}</Text>
    </View>
);

const CheckboxOption = ({ label }) => (
    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <View style={styles.checkboxOuter} />
        <Text style={styles.optionLabel}>{label}</Text>
    </View>
);

const RadioGroup = ({ options, columns = 2 }) => {
    const colStyle = columns === 3 ? styles.optionThird : styles.optionHalf;
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

// ─── BUY PROPERTY CONSTANTS ───────────────────────────────────────────
const BUY_PROPERTY_TYPES = [
    "Flat / Apartment", "Independent House", "Villa", "Plot / Land", "Farm House",
    "Shop", "Office Space", "Warehouse", "Commercial Property", "Industrial Property", "Other"
];

const INTENDED_USES = [
    "Self Use", "Investment", "Rental Income", "Office", "Retail Shop",
    "Restaurant / Cafe", "Bank Branch", "ATM", "Gym / Fitness Center",
    "Clinic / Hospital", "Pharmacy", "Showroom", "Warehouse / Storage",
    "Educational Institute", "Hotel / Guest House", "Co-Living", "PG", "Other"
];

const BUY_BUDGET_RANGES = [
    "Under ₹25 Lakh", "₹25–50 Lakh", "₹50 Lakh–1 Crore",
    "₹1–2 Crore", "₹2–5 Crore", "Above ₹5 Crore"
];

const BUY_BHK_OPTIONS = ["Studio", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"];
const PROPERTY_STATUSES = ["Ready to Move", "Under Construction", "Newly Launched", "Any"];
const BUY_PRIORITIES = ["Immediate (Within 7 Days)", "Within 15 Days", "Within 1 Month", "Within 3 Months", "Within 6 Months", "Just Exploring"];
const BUY_AMENITIES = ["Parking", "Lift", "Security", "CCTV", "Power Backup", "Garden", "Club House", "Gym", "Swimming Pool", "Children's Play Area"];

export const BuyPropertyTemplatePdf = () => (
    <Document title="Buy Property Inquiry Form" author="Mehta Estates">
        <Page size="A4" style={styles.page} wrap>
            <View style={styles.header}>
                <Text style={styles.brand}>MEHTA ESTATES</Text>
                <Text style={styles.title}>BUY PROPERTY INQUIRY FORM</Text>
            </View>
            <View style={styles.metaRow}>
                <Text>Date: _______________________</Text>
                <Text>Form ID: _______________________</Text>
            </View>

            <Section title="1. Personal Details">
                <View style={styles.grid2}>
                    <BlankField label="Full Name *" half />
                    <BlankField label="Mobile No. *" half />
                    <BlankField label="Email" half />
                    <BlankField label="City" half />
                </View>
            </Section>

            <Section title="2. Property Type" hint="Select one option">
                <RadioGroup options={BUY_PROPERTY_TYPES} columns={3} />
            </Section>

            <Section title="3. Intended Use" hint="Select all that apply">
                <CheckboxGroup options={INTENDED_USES} />
            </Section>

            <Section title="4. Location Requirement">
                <View style={styles.grid2}>
                    <BlankField label="Preferred City *" half />
                    <BlankField label="Preferred Area / Locality *" half />
                </View>
                <BlankField label="Landmark" />
            </Section>

            <Section title="5. Budget Range" hint="Select one option">
                <RadioGroup options={BUY_BUDGET_RANGES} columns={3} />
            </Section>

            <Section title="6. BHK Requirement" hint="Select one option">
                <RadioGroup options={BUY_BHK_OPTIONS} columns={3} />
            </Section>

            <Section title="7. Minimum Property Size">
                <BlankField label="Size (Sq. Ft. / Sq. Yard / Acre / Hectare)" />
            </Section>

            <Section title="8. Property Status Preference" hint="Select one option">
                <RadioGroup options={PROPERTY_STATUSES} columns={2} />
            </Section>

            <Section title="9. Priority / Required By" hint="Select one option">
                <RadioGroup options={BUY_PRIORITIES} columns={3} />
            </Section>

            <Section title="10. Amenities Preferred" hint="Select all that apply">
                <CheckboxGroup options={BUY_AMENITIES} />
            </Section>

            <Section title="11. Remarks & Special Conditions">
                <View style={styles.textAreaLarge} />
            </Section>

            <Section title="12. Message / Detailed Requirement">
                <View style={styles.textAreaLarge} />
            </Section>

            <Section title="13. Attachments">
                <BlankField label="Reference Images" />
                <BlankField label="Floor Images" />
                <BlankField label="Location Images" />
                <BlankField label="Other Files" />
            </Section>

            <Section title="Declaration" wrap={false}>
                <Text style={{ fontSize: 7.5, marginBottom: 6 }}>I declare that all information provided above is true and correct.</Text>
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
                <Text style={styles.subLabel}>Lead Status</Text>
                <RadioGroup options={["New", "Assigned", "Contacted", "Converted", "Closed", "Rejected"]} columns={3} />
                <Text style={{ fontSize: 7.5, marginTop: 4, marginBottom: 2 }}>Admin Remarks</Text>
                <View style={styles.textArea} />
            </Section>
        </Page>
    </Document>
);

export default BuyPropertyTemplatePdf;