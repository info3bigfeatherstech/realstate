import React from "react";
import { pdf } from "@react-pdf/renderer";
import { SellPropertyTemplatePdf } from "./SellPropertyTemplatePdf";

export const downloadSellPropertyTemplate = async () => {
    const blob = await pdf(React.createElement(SellPropertyTemplatePdf)).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Sell-Property-Inquiry-Form.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
};