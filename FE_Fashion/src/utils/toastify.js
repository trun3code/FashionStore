import { toast } from "react-toastify";

const toastOption = {
    position: "top-right",
    autoClose: 1000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
}

export const showSuccessNoti = (msg) => {
    toast.success(msg, toastOption);
}
export const showErrorNoti = (msg) => {
    toast.error(msg, toastOption);
}