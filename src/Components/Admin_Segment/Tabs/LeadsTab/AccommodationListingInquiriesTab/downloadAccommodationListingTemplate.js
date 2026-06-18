import React from "react";
import { pdf } from "@react-pdf/renderer";
import { AccommodationListingTemplatePdf } from "./AccommodationListingTemplatePdf";

export const downloadAccommodationListingTemplate = async () => {
    const blob = await pdf(React.createElement(AccommodationListingTemplatePdf)).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Accommodation-Listing-Inquiry-Form.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
};