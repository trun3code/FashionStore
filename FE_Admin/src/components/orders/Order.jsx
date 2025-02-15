import { useState } from "react";
import { MdOutlineKeyboardDoubleArrowDown, MdDeliveryDining, MdDone, MdDelete } from "react-icons/md";
import { formatDate, formatPrice } from "../../utils/format";
import { updateOrderStatus } from "../../api/order";
import { showSuccessNoti } from "../../utils/toastify";
import Modal from "../../layouts/Modal";
import OrderItem from "./OrderItem";

const Order = ({ order }) => {
    const [openModal, setOpenModal] = useState(false);
    const [openItems, setOpenItems] = useState(false);
    const [orderStatus, setOrderStatus] = useState("");
    const [show, setShow] = useState(true);
    const handleUpdateOrder = async (status) => {
        setOrderStatus(status);
        setOpenModal(true);
    }
    const updateOrder = async () => {
        await updateOrderStatus({ id: order?.id, status: orderStatus });
        order['status'] = orderStatus;
        if (orderStatus == "cancel") 
            setShow(false);
        setOpenModal(false);
        showSuccessNoti("Cập nhật trạng thái thành công");
    }
    return (
        show && <>
            <tr className="bg-white h-[75px] hover:bg-transparent text-[14px] border-[2px] border-separate border border-slate-850 ">
                <td className="text-center w-[5%] font-semibold ">
                    {order?.id}
                </td>
                <td className="text-center w-[15%] font-semibold">
                    <span>{order?.user}</span>
                    <div>{order?.phoneNumber}</div>
                </td>
                <td className="text-center w-[20%] font-semibold">
                    <div>{order?.shippingAddress?.name}</div>
                </td>
                <td className="text-center w-[5%] font-medium">
                    {order?.amount}
                </td>
                <td className="text-center w-[10%] font-medium">
                    {formatPrice(order?.total)}
                </td>
                <td className="text-center w-[10%] font-medium">
                    {formatDate(order?.createAt)}
                </td>
                <td className="text-center w-[10%] font-medium">
                    {formatDate(order?.updateAt)}
                </td>
                <td className="text-center w-[10%] font-medium px-3">
                    <div className={`py-1 rounded-full ${order?.status == "pending"
                        ? "bg-[rgba(24,119,242,0.3)] text-[rgb(24,119,242)]"
                        : order?.status == "delivered"
                            ? "bg-[rgba(255,86,48,0.3)] text-[rgb(255,86,48)]"
                            : "bg-[rgba(61,216,88,0.3)] text-[rgb(61,216,88)]"
                        }`}>
                        {order?.status == "pending"
                            ? "Đang xử lý"
                            : order?.status == "delivered"
                                ? "Đã giao"
                                : "Đang giao"
                        }
                    </div>
                </td>
                <td className="text-center w-[5%] font-medium p-5 flex">
                    <div className={` p-2 rounded-[50%] cursor-pointer transition-all duration-300
                            ${openItems ? "rotate-180 bg-[rgba(0,0,0,0.3)]" : "text-[rgb(114,117,115)] bg-[rgba(114,117,115,0.3)] "}`}
                        onClick={() => setOpenItems(!openItems)}
                    >
                        <MdOutlineKeyboardDoubleArrowDown className="w-[1.2rem] h-[1.2rem]" />
                    </div>
                </td>
                <td >
                    <div className="flex flex-row justify-center items-center space-x-1 ">
                        {order?.status == "pending"
                            ? <>
                                <div className="p-2 rounded-[50%] cursor-pointer bg-[rgba(24,119,242,0.3)] text-[rgb(24,119,242)]"
                                    onClick={() => handleUpdateOrder("delivering")}>
                                    <MdDeliveryDining className="w-[1.2rem] h-[1.2rem]" />
                                </div>
                                <div className="p-2 rounded-[50%] cursor-pointer bg-[rgba(216,61,61,0.3)] text-[rgb(216,61,61)]"
                                    onClick={() => handleUpdateOrder("cancel")}>
                                    <MdDelete className="w-[1.2rem] h-[1.2rem]" />
                                </div>
                            </>
                            : order?.status == "delivering"
                                ? <>
                                    <div className="p-2 rounded-[50%] cursor-pointer bg-[rgba(61,216,88,0.3)] text-[rgb(61,216,88)]"
                                        onClick={() => handleUpdateOrder("delivered")}>
                                        <MdDone className="w-[1.2rem] h-[1.2rem]" />
                                    </div>
                                    <div className="p-2 rounded-[50%] cursor-pointer bg-[rgba(216,61,61,0.3)] text-[rgb(216,61,61)]"
                                        onClick={() => handleUpdateOrder("cancel")}>
                                        <MdDelete className="w-[1.2rem] h-[1.2rem]" />
                                    </div>
                                </>
                                : null
                        }
                    </div>
                </td>
                <td>
                    <Modal open={openModal} onClose={() => setOpenModal(false)}>
                        <div className="w-56 h-full flex justify-center items-center flex-col space-y-2">
                            {
                                orderStatus == "delivering"
                                    ? <MdDeliveryDining className="p-1 rounded-[50%] w-[3rem] h-[3rem] bg-[rgba(24,119,242,0.3)] text-[rgb(24,119,242)]" />
                                    : orderStatus == "delivered"
                                        ? <MdDone className="p-1 rounded-[50%] w-[3rem] h-[3rem] bg-[rgba(61,216,88,0.3)] text-[rgb(61,216,88)]" />
                                        : <MdDelete className="p-1 rounded-[50%] w-[3rem] h-[3rem] bg-[rgba(255,61,61,0.3)] text-[rgb(216,61,61)]" />
                            }

                            <h3 className="text-lg font-black text-gray-800 font-medium">Cập nhật trạng thái</h3>
                            <p className="font-medium text-[20px]">
                                {orderStatus == "pending"
                                    ? "Đang xử lý"
                                    : orderStatus == "delivered"
                                        ? "Đã giao"
                                        : orderStatus == "delivering"
                                            ? "Đang giao"
                                            : "Hủy"
                                }
                            </p>
                            <p className="text-[12px] text-center text-gray-500">
                                Bạn có chắc là muốn cập nhật trạng thái đơn hàng của:
                                <span className="font-black"> {order?.user}</span>
                            </p>
                            <div className="flex gap-2 w-full">
                                <button className="py-2 px-4 b bg-[rgb(246,246,246)] 
                                text-blue-500 font-semibold w-1/2 text-center rounded-xl shadow" onClick={updateOrder} >
                                    Cập nhật
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
            <tr className="bg-slate-100">
                {openItems && <OrderItem order={order} />}
            </tr>
        </>
    )
}
export default Order;