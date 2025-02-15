import { useEffect, useState } from "react";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import User from "./User";

const ListUser = ({ users,setUsers }) => {
    const [activeUser, setActiveUser] = useState(0)
    const [startUser, setStartUser] = useState(0)
    useEffect(() => {
        setActiveUser(users?.length > 8 ? 8 : users?.length)
    }, [users]);
    return (
        <table className="table-auto w-full">
            <thead className="h-[50px] w-full text-[14px] text-[#637381] ">
                <tr className="w-full ">
                    <th className="text-start pl-[24px] w-1/4 font-medium">Tên người dùng</th>
                    <th className="text-start w-1/5 font-medium">Email</th>
                    <th className="text-center w-[10%] font-medium">Giới tính</th>
                    <th className="text-center w-[15%] font-medium">Ngày tạo</th>
                    <th className="text-center w-[15%] font-medium">Ngày cập nhật</th>
                    <th className="text-center pr-[24px] font-medium">Thao tác</th>
                </tr>
            </thead>
            <tbody className="w-full">
                {users?.length
                    ? <>
                        {Array.isArray(users) && users?.slice(startUser, activeUser)?.map((user, index) => (
                            <User
                                key={user?.id}
                                user={user}
                                removeUserInList={() => {
                                    setUsers(users.filter((_, i) => i !== index));
                                }} />
                        ))}
                        <tr className="w-full bg-white px-6 h-[50px] text-[14px] border-t-[1px]">
                            <td colSpan={6} className="text-right font-medium pr-10">
                                <p>{startUser + 1} - {activeUser} trên {users?.length}</p>
                            </td>
                            <td className="text-center font-medium pr-2">
                                <div className="flex flex-row justify-center gap-1">
                                    <div className={`p-2 flex justify-center items-center
                                        ${startUser ? "cursor-pointer rounded-[50%] hover:bg-[rgb(230,230,230)]" : "text-[#637381]"}`}
                                        onClick={() => {
                                            if (!startUser) return;
                                            setStartUser(startUser - 8);
                                            if (startUser != activeUser - 1)
                                                setActiveUser(activeUser - 8 > 8 ? activeUser - 8 : 8);
                                            else setActiveUser(activeUser - 1);
                                        }}>
                                        <MdArrowBackIos />
                                    </div>
                                    <div className={`p-2 flex justify-center items-center
                                        ${activeUser < users?.length ? "rounded-[50%] hover:bg-[rgb(230,230,230)] cursor-pointer" : "text-[#637381]"}`}
                                        onClick={() => {
                                            if (activeUser >= users?.length) return;
                                            setActiveUser(activeUser + 8 < users?.length ? activeUser + 8 : users?.length);
                                            setStartUser(startUser + 8);
                                        }}>
                                        <MdArrowForwardIos />
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </>
                    : <tr className="w-full bg-white">
                        <td colSpan={7} className="text-center">
                            <div className="h-[14rem] w-full flex flex-col justify-center items-center">
                                <h3 className="font-black text-xl my-4">Không tìm được!</h3>
                                <p className="font-normal text-sm my-2 text-gray-500">
                                    Không có người dùng nào có chứa chuỗi bạn vừa nhập.
                                </p>
                                <p className="font-normal text-sm text-gray-500">
                                    Hãy thử kiếm tra lỗi chính tả hoặc
                                    điền đầy đủ tên người dùng cần tìm.
                                </p>
                            </div>
                        </td>
                    </tr>
                }
            </tbody>
        </table>
    )
}

export default ListUser;