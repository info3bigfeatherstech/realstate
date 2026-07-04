import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  User,
  MapPin,
  Mail,
  Phone,
  MessageSquare,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useSubmitGeneralInquiryMutation } from "../../../../REDUX_FEATURES/REDUX_SLICES/userGeneralInquiryApi/userGeneralInquiryApi";
import { toast, getApiErrorMessage } from "../../../Shared/ToastConfig";
import {
  InputField,
  TextAreaField,
  SectionHeader,
} from "../Shared/InquiryFormFields";
import DetailModal from "./Shared/DetailModal";

const INITIAL = {
  fullName: "",
  contactNumber: "",
  email: "",
  city: "",
  subject: "",
  message: "",
};

const GeneralInquiry = () => {
  const { user } = useSelector((state) => state.customerAuth || {});
  const [submitGeneralInquiry, { isLoading: submitting }] =
    useSubmitGeneralInquiryMutation();
  const [form, setForm] = useState({
    ...INITIAL,
    fullName: user?.fullName || "",
    contactNumber: user?.mobile || "",
    email: user?.email || "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState(null);

  const set = (field) => (val) => setForm((p) => ({ ...p, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.contactNumber || !form.city || !form.message) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await submitGeneralInquiry({
        fullName: form.fullName,
        contactNumber: form.contactNumber,
        email: form.email || null,
        city: form.city,
        subject: form.subject || null,
        message: form.message,
        source: "website",
      }).unwrap();

      toast.success(response.message || "Inquiry submitted successfully!");
      setSubmittedInquiry(response.data);
      setShowSuccessModal(true);

      // Reset form
      setForm({
        ...INITIAL,
        fullName: user?.fullName || "",
        contactNumber: user?.mobile || "",
        email: user?.email || "",
      });
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to submit inquiry"));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">General Inquiry</h1>
          <p className="text-sm text-slate-500 mt-1">
            Get in touch with us for general queries, partnerships or support
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal details */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <SectionHeader icon={User} title="Personal Details" />
          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              label="Full Name"
              required
              value={form.fullName}
              onChange={set("fullName")}
              placeholder="Enter your full name"
            />
            <InputField
              label="Contact Number"
              required
              value={form.contactNumber}
              onChange={set("contactNumber")}
              placeholder="Enter 10-digit mobile number"
            />
            <InputField
              label="Email Address"
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="Enter email address"
            />
            <InputField
              label="City"
              required
              value={form.city}
              onChange={set("city")}
              placeholder="Enter your city"
            />
          </div>
        </div>

        {/* Message details */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <SectionHeader icon={MessageSquare} title="Inquiry Message" />
          <div className="space-y-4">
            <InputField
              label="Subject"
              value={form.subject}
              onChange={set("subject")}
              placeholder="Enter inquiry subject"
            />
            <TextAreaField
              label="Your Message"
              required
              value={form.message}
              onChange={set("message")}
              placeholder="Type your detailed message here (minimum 10 characters)..."
              maxLength={5000}
              rows={6}
            />
          </div>
        </div>

        <div className="flex justify-end pb-8">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-all duration-200"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Inquiry
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {showSuccessModal && (
        <DetailModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          inquiry={submittedInquiry}
        />
      )}
    </div>
  );
};

export default GeneralInquiry;
