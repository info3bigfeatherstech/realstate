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

// ─── SELL PROPERTY CONSTANTS ──────────────────────────────────────────
const SELL_PROPERTY_TYPES = [
    "Flat / Apartment", "Independent House", "Villa", "Plot / Land", "Farm House",
    "Shop", "Office Space", "Warehouse", "Commercial Property", "Industrial Property"
];

const PROPERTY_SUITABLE_FOR = [
    "Residential Use", "Office", "Retail Shop", "Restaurant / Cafe", "Bank Branch",
    "ATM", "Gym / Fitness Center", "Salon / Spa", "Clinic", "Hospital",
    "Pharmacy", "Coaching Institute", "School", "Showroom", "Warehouse",
    "Manufacturing Unit", "Co-Living", "PG", "Hostel", "Hotel / Guest House", "Multiple Uses"
];

const FACING_DIRECTIONS = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];
const PROPERTY_CONDITIONS = ["Ready to Move", "Under Construction", "Resale", "New Property"];
const OWNERSHIP_TYPES = ["Self Owned", "Joint Ownership", "Company Owned", "Partnership Owned", "Builder Owned", "Inherited Property", "Power of Attorney Holder", "Other"];
const LEGAL_DOCUMENT_TYPES = ["Registered Sale Deed (Registry)", "Agreement to Sell", "Conveyance Deed", "Gift Deed", "Builder Buyer Agreement", "Allotment Letter", "Possession Letter", "GPA", "Will Based Property", "Inherited Property Documents", "Government Lease Property", "Company Ownership Documents", "Other"];
const TITLE_STATUSES = ["Clear Title", "Encumbered", "Under Verification", "To Be Discussed"];
const ADDITIONAL_DOCUMENTS = ["Title Deed", "OC", "CC", "Approved Building Plan", "Building Approval", "RERA Certificate", "NOC", "Property Tax Receipt", "Electricity Bill", "Water Bill", "Mutation Certificate", "Khata Certificate", "Khata Extract", "Patta", "EC", "Society Share Certificate", "Fire NOC", "Trade License", "GST Registration", "Business License", "Other"];
const DOCUMENT_STATUSES = ["All Documents Available", "Most Documents Available", "Some Documents Available", "Documents Under Process", "Documents Not Available", "To Be Discussed"];
const SELL_PRIORITIES = ["Immediate", "Within 15 Days", "Within 1 Month", "Within 3 Months", "Within 6 Months", "No Fixed Timeline"];

export const SellPropertyTemplatePdf = () => (
    <Document title="Sell Property Inquiry Form" author="Mehta Estates">
        <Page size="A4" style={styles.page} wrap>
            <View style={styles.header}>
                <Text style={styles.brand}>MEHTA ESTATES</Text>
                <Text style={styles.title}>SELL PROPERTY INQUIRY FORM</Text>
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
                </View>
            </Section>

            <Section title="2. Property Details">
                <Text style={styles.subLabel}>Property Type *</Text>
                <RadioGroup options={SELL_PROPERTY_TYPES} columns={3} />
                <Text style={styles.subLabel}>Property Suitable For</Text>
                <CheckboxGroup options={PROPERTY_SUITABLE_FOR} />
            </Section>

            <Section title="3. Property Location">
                <View style={styles.grid2}>
                    <BlankField label="Property City *" half />
                    <BlankField label="Property Area / Address *" half />
                </View>
                <BlankField label="Landmark" />
            </Section>

            <Section title="4. Property Specifications">
                <BlankField label="Property Size *" />
                <Text style={styles.subLabel}>Unit</Text>
                <RadioGroup options={["Sq. Ft.", "Sq. Yard", "Acre", "Hectare"]} columns={4} />
                <Text style={styles.subLabel}>BHK</Text>
                <RadioGroup options={["Studio", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK", "Not Applicable"]} columns={3} />
                <View style={styles.grid2}>
                    <BlankField label="Floor Number" half />
                    <BlankField label="Total Floors" half />
                </View>
                <Text style={styles.subLabel}>Parking Available</Text>
                <RadioGroup options={["Yes", "No"]} columns={2} />
                <Text style={styles.subLabel}>Facing</Text>
                <RadioGroup options={FACING_DIRECTIONS} columns={4} />
                <BlankField label="Expected Selling Price *" />
                <Text style={styles.subLabel}>Property Condition</Text>
                <RadioGroup options={PROPERTY_CONDITIONS} columns={2} />
            </Section>

            <Section title="5. Property Ownership & Legal Documents">
                <Text style={styles.subLabel}>Ownership Type</Text>
                <RadioGroup options={OWNERSHIP_TYPES} columns={2} />
                <Text style={styles.subLabel}>Legal Document Type *</Text>
                <RadioGroup options={LEGAL_DOCUMENT_TYPES} columns={2} />
                <Text style={styles.subLabel}>Title Status</Text>
                <RadioGroup options={TITLE_STATUSES} columns={2} />
                <Text style={styles.subLabel}>Additional Documents Available</Text>
                <CheckboxGroup options={ADDITIONAL_DOCUMENTS} />
                <Text style={styles.subLabel}>Document Status</Text>
                <RadioGroup options={DOCUMENT_STATUSES} columns={3} />
            </Section>

            <Section title="6. Priority / Expected Sale Timeline" hint="Select one option">
                <RadioGroup options={SELL_PRIORITIES} columns={3} />
            </Section>

            <Section title="7. Remarks & Message">
                <Text style={styles.subLabel}>Remarks & Special Conditions</Text>
                <View style={styles.textAreaLarge} />
                <Text style={styles.subLabel}>Message / Detailed Property Description</Text>
                <View style={styles.textAreaLarge} />
            </Section>

            <Section title="8. Property Images Upload">
                <View style={styles.grid2}>
                    <BlankField label="Front View" half />
                    <BlankField label="Back View" half />
                    <BlankField label="Living Room" half />
                    <BlankField label="Bedroom" half />
                    <BlankField label="Kitchen" half />
                    <BlankField label="Washroom" half />
                    <BlankField label="Balcony" half />
                    <BlankField label="Exterior Images" half />
                    <BlankField label="Floor Plan" half />
                    <BlankField label="Location Images" half />
                    <BlankField label="Other Images" half />
                </View>
            </Section>

            <Section title="9. Legal Documents Upload">
                <View style={styles.grid2}>
                    <BlankField label="Registry / Sale Deed" half />
                    <BlankField label="Agreement to Sell" half />
                    <BlankField label="Title Deed" half />
                    <BlankField label="OC" half />
                    <BlankField label="CC" half />
                    <BlankField label="Approved Plan" half />
                    <BlankField label="Tax Receipt" half />
                    <BlankField label="NOC" half />
                    <BlankField label="RERA Certificate" half />
                    <BlankField label="Other Documents" half />
                </View>
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

export default SellPropertyTemplatePdf;