import React from "react";
import { toast as notify, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getApiErrorMessage } from "./apiErrorUtils";

export { getApiErrorMessage };

/** Single source for all toast timing, theme, and styling. */
export const APP_TOAST_SETTINGS = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    newestOnTop: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
};

const withDefaults = (options = {}) => ({
    ...APP_TOAST_SETTINGS,
    ...options,
});

/** @deprecated Use getApiErrorMessage — kept as alias for existing imports. */
export const formatApiErrorMessage = getApiErrorMessage;

/** Use this everywhere instead of importing react-toastify directly. */
export const toast = {
    success: (message, options) => notify.success(message, withDefaults(options)),
    error: (message, options) => notify.error(message, withDefaults(options)),
    info: (message, options) => notify.info(message, withDefaults(options)),
    warning: (message, options) => notify.warning(message, withDefaults(options)),
    warn: (message, options) => notify.warn(message, withDefaults(options)),
};

const ToastConfig = () => {
    return (
        <ToastContainer
            position={APP_TOAST_SETTINGS.position}
            autoClose={APP_TOAST_SETTINGS.autoClose}
            hideProgressBar={APP_TOAST_SETTINGS.hideProgressBar}
            newestOnTop={APP_TOAST_SETTINGS.newestOnTop}
            closeOnClick={APP_TOAST_SETTINGS.closeOnClick}
            pauseOnHover={APP_TOAST_SETTINGS.pauseOnHover}
            draggable={APP_TOAST_SETTINGS.draggable}
            theme={APP_TOAST_SETTINGS.theme}
            className="!w-72 sm:!w-96 !max-w-[90vw] !fixed !top-4 !right-4 !left-auto"
            toastClassName="!bg-white !border !border-slate-200 !rounded-xl !shadow-lg !text-xs sm:!text-sm !text-slate-800 !min-h-[48px] !mb-2"
            bodyClassName="!text-xs sm:!text-sm !font-medium !text-slate-800 !p-1"
            progressClassName="!bg-blue-700"
        />
    );
};

export default ToastConfig;
