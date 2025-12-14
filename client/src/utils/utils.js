import toast from 'react-hot-toast';

export const makeToast = (message, type) => {
    if (type === 'success') {
        toast.success(message, { theme: "dark" });
    } else if (type === 'error') {
        toast.error(message, { theme: "dark" });
    } else {
        toast.info(message, { theme: "dark" });
    }
};