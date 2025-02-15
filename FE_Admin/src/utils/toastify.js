import { toast } from "react-toastify";

const toastOption = {
    position: "top-right",
    autoClose: 2000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
}
const toastWaitingOption = {
    position: "top-right",
    pauseOnHover: true,
    draggable: true,
    theme: "light",
}
export const showSuccessNoti = (msg) => {
    return toast.success(msg, toastOption);
}
export const showErrorNoti = (msg) => {
    return toast.error(msg, toastOption);
}
export const showLoadingNoti = (msg) => {
    return toast.loading(msg, toastWaitingOption);
}
export const dismissToast=(toastId)=>{
    toast.dismiss(toastId);
}