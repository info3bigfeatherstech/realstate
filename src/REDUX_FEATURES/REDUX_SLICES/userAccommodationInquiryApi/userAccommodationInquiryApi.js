import { createApi } from "@reduxjs/toolkit/query/react";
import axiosInstance from "../../../SERVICES/Axiosinstance";

const axiosBaseQuery = () => async ({ url, method, body, params, headers }) => {
  try {
    const config = { url, method, data: body, params, headers: { ...headers } };
    if (body instanceof FormData) {
      for (const key in config.headers) {
        if (key.toLowerCase() === "content-type") {
          delete config.headers[key];
        }
      }
      config.headers["Content-Type"] = undefined;
    }
    const response = await axiosInstance(config);
    return { data: response.data };
  } catch (error) {
    return { error: { status: error.response?.status, data: error.response?.data } };
  }
};

const MULTIPART_SCALAR_FIELDS = [
  "fullName",
  "mobile",
  "email",
  "alternativeMobile",
  "requirementType",
  "occupantType",
  "genderPreference",
  "monthlyBudget",
  "propertyType",
  "bhkRequirement",
  "tenantTypePreference",
  "foodPreference",
  "petPreference",
  "smokingPreference",
  "alcoholPreference",
  "sharingPreference",
  "furnishingPreference",
  "moveInPriority",
  "remarks",
  "message",
  "saveAsDraft",
];

export const buildInquirySubmitBody = (payload) => {
  const hasFiles =
    (payload.referenceImages?.length || 0) > 0 ||
    (payload.otherFiles?.length || 0) > 0;

  if (!hasFiles) {
    const {
      referenceImages: _referenceImages,
      otherFiles: _otherFiles,
      city,
      area,
      landmark,
      ...rest
    } = payload;

    return {
      ...rest,
      location: {
        city: city || "",
        area: area || "",
        landmark: landmark || null,
      },
      amenitiesRequired: payload.amenitiesRequired || [],
      saveAsDraft: Boolean(payload.saveAsDraft),
    };
  }

  const formData = new FormData();

  MULTIPART_SCALAR_FIELDS.forEach((field) => {
    const value = payload[field];
    if (value !== undefined && value !== null && value !== "") {
      formData.append(field, String(value));
    }
  });

  formData.append(
    "location",
    JSON.stringify({
      city: payload.city || "",
      area: payload.area || "",
      landmark: payload.landmark || null,
    })
  );

  formData.append(
    "amenitiesRequired",
    JSON.stringify(payload.amenitiesRequired || [])
  );

  formData.append("saveAsDraft", payload.saveAsDraft ? "true" : "false");

  (payload.referenceImages || []).forEach((file) => {
    formData.append("referenceImages", file);
  });

  (payload.otherFiles || []).forEach((file) => {
    formData.append("otherFiles", file);
  });

  return formData;
};

export const userAccommodationInquiryApi = createApi({
  reducerPath: "userAccommodationInquiryApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    submitAccommodationInquiry: builder.mutation({
      query: (payload) => ({
        url: "/user/accommodation-inquiries",
        method: "POST",
        body: buildInquirySubmitBody(payload),
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useSubmitAccommodationInquiryMutation } = userAccommodationInquiryApi;
