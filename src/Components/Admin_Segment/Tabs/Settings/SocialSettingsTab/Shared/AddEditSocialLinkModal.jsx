import React, { useEffect, useState, useRef } from "react";
import { X, Loader2, ChevronDown } from "lucide-react";
import {
  useCreateSocialLinkMutation,
  useUpdateSocialLinkMutation,
} from "../../../../../REDUX_FEATURES/REDUX_SLICES/userSocialApi/userSocialApi";
import { toast } from "../../../../../Shared/ToastConfig";

export const PLATFORM_OPTIONS = [
  {
    value: "facebook",
    label: "Facebook",
    defaultIcon: "📘",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="#1877F2"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    value: "instagram",
    label: "Instagram",
    defaultIcon: "📸",
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
            <stop offset="0%" stopColor="#fdf497" />
            <stop offset="5%" stopColor="#fdf497" />
            <stop offset="45%" stopColor="#fd5949" />
            <stop offset="60%" stopColor="#d6249f" />
            <stop offset="90%" stopColor="#285AEB" />
          </radialGradient>
        </defs>
        <rect width="24" height="24" rx="5" fill="url(#ig-grad)" />
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="4"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
        />
        <circle
          cx="12"
          cy="12"
          r="4.5"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
        />
        <circle cx="17.5" cy="6.5" r="1" fill="white" />
      </svg>
    ),
  },
  {
    value: "youtube",
    label: "YouTube",
    defaultIcon: "▶️",
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
          fill="#FF0000"
        />
        <polygon points="9.545,15.568 15.818,12 9.545,8.432" fill="white" />
      </svg>
    ),
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    defaultIcon: "💼",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="#0A66C2"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
      </svg>
    ),
  },
  {
    value: "twitter",
    label: "Twitter / X",
    defaultIcon: "🐦",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    value: "whatsapp",
    label: "WhatsApp",
    defaultIcon: "💬",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="#25D366"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
    ),
  },
  {
    value: "telegram",
    label: "Telegram",
    defaultIcon: "✈️",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="#26A5E4"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    value: "google",
    label: "Google Business / Maps",
    defaultIcon: "🌐",
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
  },
  {
    value: "other",
    label: "Other / Custom",
    defaultIcon: "🔗",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
];

const AddEditSocialLinkModal = ({ isOpen, onClose, linkToEdit }) => {
  const [createSocialLink, { isLoading: isCreating }] =
    useCreateSocialLinkMutation();
  const [updateSocialLink, { isLoading: isUpdating }] =
    useUpdateSocialLinkMutation();

  // Custom dropdown open/close state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [form, setForm] = useState({
    platform: "facebook",
    label: "",
    url: "",
    icon: "",
    displayOrder: 0,
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (linkToEdit) {
      setForm({
        platform: linkToEdit.platform || "facebook",
        label: linkToEdit.label || "",
        url: linkToEdit.url || "",
        icon: linkToEdit.icon || "",
        displayOrder: linkToEdit.displayOrder ?? 0,
      });
    } else {
      setForm({
        platform: "facebook",
        label: "",
        url: "",
        icon: "",
        displayOrder: 0,
      });
    }
  }, [linkToEdit, isOpen]);

  // Set default icon when platform changes
  const handlePlatformChange = (val) => {
    setForm((p) => ({
      ...p,
      platform: val,
      icon: "",
    }));
    setDropdownOpen(false);
  };

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.platform || !form.url) {
      toast.error("Platform and URL are required");
      return;
    }

    // Basic URL validation
    try {
      new URL(form.url);
    } catch (_) {
      toast.error(
        "Please enter a valid URL (starting with http:// or https://)",
      );
      return;
    }

    const payload = {
      platform: form.platform,
      label: form.label.trim(),
      url: form.url.trim(),
      icon: form.icon.trim(),
      displayOrder: Number(form.displayOrder),
    };

    try {
      if (linkToEdit) {
        await updateSocialLink({ id: linkToEdit._id, ...payload }).unwrap();
        toast.success("Social link updated successfully");
      } else {
        await createSocialLink(payload).unwrap();
        toast.success("Social link created successfully");
      }
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save social link");
    }
  };

  // Get currently selected platform object
  const selectedPlatform = PLATFORM_OPTIONS.find(
    (p) => p.value === form.platform,
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-base font-bold text-slate-800">
            {linkToEdit ? "Edit Social Link" : "Add New Social Link"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Platform <span className="text-red-500">*</span>
            </label>
            {/* Custom Dropdown — replaces native <select> so SVG icons render */}
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                disabled={!!linkToEdit}
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white disabled:bg-slate-100 disabled:text-slate-400 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                  {selectedPlatform?.icon}
                </span>
                <span className="flex-1 text-left text-slate-800">
                  {selectedPlatform?.label || "Select platform"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {dropdownOpen && !linkToEdit && (
                <ul className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg py-1 max-h-56 overflow-y-auto">
                  {PLATFORM_OPTIONS.map((opt) => (
                    <li
                      key={opt.value}
                      onClick={() => handlePlatformChange(opt.value)}
                      className={`flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer transition-colors ${
                        form.platform === opt.value
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                        {opt.icon}
                      </span>
                      {opt.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Display Label (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Follow us on Instagram"
              className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white"
              value={form.label}
              onChange={(e) => handleChange("label", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Target URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="https://instagram.com/yourprofile"
              className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white"
              value={form.url}
              onChange={(e) => handleChange("url", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Emoji Icon
              </label>
              <div className="flex justify-center items-center border border-slate-300 rounded-lg overflow-hidden focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                {/* SVG preview — platform ke according */}
                <span className="w-10 h-auto flex items-center justify-center bg-slate-50 flex-shrink-0">
                  {selectedPlatform?.icon}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                min={0}
                className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white"
                value={form.displayOrder}
                onChange={(e) => handleChange("displayOrder", e.target.value)}
              />
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-100 bg-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isCreating || isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Social Link"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditSocialLinkModal;
