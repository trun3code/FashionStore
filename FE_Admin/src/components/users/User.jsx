import { useState } from "react";
import { MdDelete} from "react-icons/md";
import { formatDate } from "../../utils/format";
import { showSuccessNoti } from "../../utils/toastify";
import { getImage, removeUser } from "../../api/user";
import userLogo from "../../assets/navbar/ic_user.svg";
import Modal from "../../layouts/Modal";

const User = ({ user, removeUserInList }) => {
    const [openModal, setOpenModal] = useState(false);
    const handleDelete = async () => {
        await removeUser(user?.id)
        removeUserInList();
        setOpenModal(false);
        showSuccessNoti("Xóa người dùng thành công!");
    }
    return (
        <tr className="bg-white hover:bg-transparent h-[64px] text-[14px] border-t-[1px]">
            <td className="text-start pl-[24px] w-1/4 font-semibold ">
                <div className="flex flex-row items-center space-x-2">
                    <img src={getImage(user?.avatar) || userLogo} className="h-[100px] w-[100px] rounded-[50%]" alt="" />
                    <span>{user?.name}</span>
                </div>
            </td>
            <td className="text-start w-1/5">{user.email}</td>
            <td className="text-center w-[10%]">{user.gender == 0 ? "Nam" : "Nữ"}</td>
            <td className="text-center w-[15%]">{formatDate(user.createAt)}</td>
            <td className="text-center w-[15%]">{formatDate(user.updateAt)}</td>
            <td className="pr-[24px] ">
                <div className="flex justify-center space-x-2">
                    <div className="bg-[rgba(255,86,48,0.3)] p-2 rounded-[50%] cursor-pointer" onClick={() => setOpenModal(true)}>
                        <MdDelete className="w-[1.2rem] h-[1.2rem] text-[rgb(255,86,48)]" />
                    </div>
                </div>
            </td>
            <td>
                <Modal open={openModal} onClose={() => setOpenModal(false)}>
                    <div className="w-56 h-full flex justify-center items-center flex-col space-y-2">
                        <MdDelete className="w-[3rem] h-[3rem] text-[rgb(255,86,48)]" />
                        <h3 className="text-lg font-black text-gray-800">Xóa người dùng</h3>
                        <p className="text-[12px] text-center text-gray-500">
                            Bạn có chắc là muốn xóa người dùng
                            <span className="font-black"> {user?.name}</span>
                        </p>
                        <div className="flex gap-2 w-full">
                                <button className="py-2 px-4 b bg-[rgb(246,246,246)] 
                                text-red-500 font-semibold w-1/2 text-center rounded-xl shadow" onClick={handleDelete}>
                                    Xóa
                                </button>
                                <button className="py-2 px-4 bg-[rgb(36,212,212)] 
                                text-white font-semibold w-1/2 text-center rounded-xl shadow" onClick={() => setOpenModal(false)}>
                                    Hủy
                                </button>
                            </div>
                    </div>
                </Modal>
            </td>
        </tr>
    )
}
export default User;