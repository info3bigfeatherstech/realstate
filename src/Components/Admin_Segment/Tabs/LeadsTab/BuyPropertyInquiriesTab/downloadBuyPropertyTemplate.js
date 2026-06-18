// ✅ CORRECT — JSX ke saath
import { pdf } from "@react-pdf/renderer";
import { BuyPropertyTemplatePdf } from "./BuyPropertyTemplatePdf";

export const downloadBuyPropertyTemplate = async () => {
    const blob = await pdf(React.createElement(BuyPropertyTemplatePdf)).toBlob();
    //                                    ^^^^^^^^^^^^^^^^^^^^
    //                                    React.createElement use karo
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Buy-Property-Inquiry-Form.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
};