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

// ─── ACCOMMODATION LISTING CONSTANTS ──────────────────────────────────
const LISTING_TYPES = ["Rental Property", "PG Accommodation", "Co-Living Accommodation"];
const LISTING_PROPERTY_TYPES = ["Flat / Apartment", "Independent House", "Studio Apartment", "PG", "Co-Living"];
const OCCUPANT_SUITABILITY = ["Families", "Bachelors", "Students", "Working Professionals", "Corporate Leasing", "Male Occupants", "Female Occupants", "Couples", "Any"];
const BUSINESS_USE_TYPES = ["Office", "Retail Shop", "Restaurant / Cafe", "Bank Branch", "ATM", "Gym", "Salon / Spa", "Clinic", "Pharmacy", "Coaching Institute", "Warehouse", "Showroom", "Not Applicable"];
const LISTING_BHK_OPTIONS = ["Studio", "1 BHK", "2 BHK", "3 BHK", "4+ BHK", "Not Applicable"];
const OCCUPANCY_RULES = ["Families Allowed", "Bachelors Allowed", "Students Allowed", "Working Professionals Allowed", "Male Only", "Female Only", "Vegetarian Only", "Non-Vegetarian Allowed", "Pets Allowed", "Smoking Allowed", "Alcohol Allowed"];
const LISTING_AMENITIES = ["Wi-Fi", "AC", "Food / Mess", "Housekeeping", "Laundry", "Lift", "Parking", "Security", "CCTV", "Power Backup", "RO Water", "Attached Washroom", "Gym", "Study Area", "Balcony"];
const AVAILABLE_FROM_OPTIONS = ["Immediately Available", "Within 7 Days", "Within 15 Days", "Within 1 Month", "Specific Date"];
const LISTING_URGENCY_OPTIONS = ["Need Tenant Immediately", "Within 15 Days", "Within 1 Month", "Within 3 Months", "No Hurry"];

export const AccommodationListingTemplatePdf = () => (
    <Document title="Accommodation Listing Inquiry Form" author="Mehta Estates">
        <Page size="A4" style={styles.page} wrap>
            <View style={styles.header}>
                <Text style={styles.brand}>MEHTA ESTATES</Text>
                <Text style={styles.title}>ACCOMMODATION LISTING INQUIRY FORM</Text>
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

            <Section title="2. Listing Type" hint="Select one option">
                <RadioGroup options={LISTING_TYPES} columns={3} />
            </Section>

            <Section title="3. Property Details">
                <BlankField label="Property Name (Optional)" />
                <Text style={styles.subLabel}>Property Type</Text>
                <RadioGroup options={LISTING_PROPERTY_TYPES} columns={3} />
                <Text style={styles.subLabel}>Property Suitable For</Text>
                <CheckboxGroup options={OCCUPANT_SUITABILITY} />
                <Text style={styles.subLabel}>Property Suitable For Business Use</Text>
                <CheckboxGroup options={BUSINESS_USE_TYPES} />
            </Section>

            <Section title="4. Property Location">
                <View style={styles.grid2}>
                    <BlankField label="Property City *" half />
                    <BlankField label="Property Area / Address *" half />
                </View>
                <BlankField label="Landmark" />
            </Section>

            <Section title="5. Property Specifications">
                <BlankField label="Property Size" />
                <Text style={styles.subLabel}>Unit</Text>
                <RadioGroup options={["Sq. Ft.", "Sq. Yard"]} columns={2} />
                <Text style={styles.subLabel}>BHK</Text>
                <RadioGroup options={LISTING_BHK_OPTIONS} columns={3} />
                <View style={styles.grid2}>
                    <BlankField label="Floor Number" half />
                    <BlankField label="Total Floors" half />
                </View>
            </Section>

            <Section title="6. PG / Co-Living Details">
                <View style={styles.grid2}>
                    <BlankField label="Total Beds" half />
                    <BlankField label="Available Beds" half />
                </View>
            </Section>

            <Section title="7. Pricing">
                <BlankField label="Expected Monthly Rent *" />
                <BlankField label="Security Deposit" />
                <BlankField label="Maintenance Charges" />
                <BlankField label="Rent Per Bed" />
            </Section>

            <Section title="8. Occupancy Rules" hint="Select all that apply">
                <CheckboxGroup options={OCCUPANCY_RULES} />
            </Section>

            <Section title="9. Furnishing Status" hint="Select one option">
                <RadioGroup options={["Fully Furnished", "Semi-Furnished", "Unfurnished"]} columns={3} />
            </Section>

            <Section title="10. Amenities Available" hint="Select all that apply">
                <CheckboxGroup options={LISTING_AMENITIES} />
            </Section>

            <Section title="11. Ownership & Legal Documents">
                <Text style={styles.subLabel}>Ownership Type</Text>
                <RadioGroup options={["Self Owned", "Joint Ownership", "Company Owned", "Partnership Owned", "Builder Owned", "Other"]} columns={3} />
                <Text style={styles.subLabel}>Legal Document Type *</Text>
                <RadioGroup options={["Registered Sale Deed (Registry)", "Lease Deed", "Rent Agreement", "Builder Buyer Agreement", "Allotment Letter", "Possession Letter", "Company Ownership Documents", "Government Lease Property", "Other"]} columns={3} />
                <Text style={styles.subLabel}>Title Status</Text>
                <RadioGroup options={["Clear Title", "Under Verification", "To Be Discussed"]} columns={3} />
                <Text style={styles.subLabel}>Additional Documents Available</Text>
                <CheckboxGroup options={["Title Deed", "OC", "CC", "Approved Plan", "RERA Registration", "NOC", "Property Tax Receipt", "Electricity Bill", "Water Bill", "Fire NOC", "Trade License", "Other"]} />
                <Text style={styles.subLabel}>Document Status</Text>
                <RadioGroup options={["All Documents Available", "Most Documents Available", "Some Documents Available", "Documents Under Process", "Documents Not Available", "To Be Discussed"]} columns={3} />
            </Section>

            <Section title="12. Available From" hint="Select one option">
                <RadioGroup options={AVAILABLE_FROM_OPTIONS} columns={3} />
            </Section>

            <Section title="13. Priority / Listing Urgency" hint="Select one option">
                <RadioGroup options={LISTING_URGENCY_OPTIONS} columns={3} />
            </Section>

            <Section title="14. Remarks & Message">
                <Text style={styles.subLabel}>Remarks & Special Conditions</Text>
                <View style={styles.textAreaLarge} />
                <Text style={styles.subLabel}>Message / Detailed Property Description</Text>
                <View style={styles.textAreaLarge} />
            </Section>

            <Section title="15. Property Images Upload">
                <View style={styles.grid2}>
                    <BlankField label="Front View" half />
                    <BlankField label="Back View" half />
                    <BlankField label="Living Room" half />
                    <BlankField label="Bedroom" half />
                    <BlankField label="Kitchen" half />
                    <BlankField label="Washroom" half />
                    <BlankField label="Balcony" half />
                    <BlankField label="Amenities Photos" half />
                    <BlankField label="Building Exterior" half />
                    <BlankField label="Location Photos" half />
                    <BlankField label="Other Images" half />
                </View>
            </Section>

            <Section title="16. Legal Documents Upload">
                <View style={styles.grid2}>
                    <BlankField label="Registry / Sale Deed" half />
                    <BlankField label="Lease Deed" half />
                    <BlankField label="Rent Agreement" half />
                    <BlankField label="Title Deed" half />
                    <BlankField label="Approved Building Plan" half />
                    <BlankField label="OC" half />
                    <BlankField label="CC" half />
                    <BlankField label="NOC" half />
                    <BlankField label="Property Tax Receipt" half />
                    <BlankField label="Electricity Bill" half />
                    <BlankField label="Water Bill" half />
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

export default AccommodationListingTemplatePdf;



