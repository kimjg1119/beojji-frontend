import { toast, ToastOptions } from 'react-toastify';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const showSuccessToast = (message: string, options?: ToastOptions) => {
  toast.success(message, {
    ...defaultOptions,
    ...options,
    icon: FaCheckCircle,
    className: "bg-green-100 text-green-800 border-l-4 border-green-500",
  });
};

export const showErrorToast = (message: string, options?: ToastOptions) => {
  toast.error(message, {
    ...defaultOptions,
    ...options,
    autoClose: 5000,
    icon: FaExclamationCircle,
    className: "bg-red-100 text-red-800 border-l-4 border-red-500",
  });
};

export const showInfoToast = (message: string, options?: ToastOptions) => {
  toast.info(message, {
    ...defaultOptions,
    ...options,
    icon: FaInfoCircle,
    className: "bg-blue-100 text-blue-800 border-l-4 border-blue-500",
  });
};