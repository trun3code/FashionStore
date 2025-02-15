import { MdClose } from "react-icons/md";

const Modal = ({ open, onClose, children }) => {
    return (
        <div className={`fixed inset-0 z-30 flex justify-center w-full h-full transition-colors ${open ? "visible bg-black/20" : "invisible"}`}>
            <div className={`bg-white rounded-xl shadow p-6 transition-all relative h-fit mt-40 ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`} >
                <button className="absolute right-3 top-3" onClick={onClose}>
                    <MdClose className="w-[1rem] h-[1rem] text-[#637381]" />
                </button>
                {children}
            </div>
        </div>
    )
}

export default Modal;