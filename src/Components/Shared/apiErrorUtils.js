const FIELD_LABELS = {
  role: "Service role",
  providerName: "Provider name",
  address: "Address",
  primaryMobile: "Primary mobile",
  secondaryMobile: "Secondary mobile",
  status: "Status",
};

const formatFieldLabel = (field) => {
  if (!field) return "Field";
  if (FIELD_LABELS[field]) return FIELD_LABELS[field];
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
};

/**
 * Converts RTK Query / axios API errors into a user-friendly message.
 * Supports backend shape: { message, errorCode, details: [{ field, message }] }
 */
export const getApiErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  const data = error?.data;
  if (!data) return fallback;

  const { message, details, errorCode } = data;

  if (Array.isArray(details) && details.length > 0) {
    const lines = details.map((item) => {
      const label = formatFieldLabel(item.field);
      const text = item.message || "Invalid value";
      if (text.toLowerCase().includes(label.toLowerCase())) return text;
      return `${label}: ${text}`;
    });
    return lines.join("; ");
  }

  if (message && message !== "Internal server error") {
    return message;
  }

  if (errorCode === "VALIDATION_ERROR") {
    return "Please check the form and fix the highlighted fields.";
  }

  return fallback;
};

export default getApiErrorMessage;
