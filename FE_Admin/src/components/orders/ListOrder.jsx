import { useEffect, useState } from "react";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import Order from "./Order";

const ListOrder = ({ orders }) => {
    const [activeOrder, setActiveOrder] = useState(0);
    const [startOrder, setStartOrder] = useState(0);
    useEffect(() => {
        setActiveOrder(orders?.length > 8 ? 8 : orders?.length);
        setStartOrder(0);
    }, [orders])
    return (
        <table className="table-auto w-full ">
            <thead className="h-[50px] w-full text-[14px] text-[#637381] ">
                <tr className="w-full">
                    <th className="text-center w-[5%] font-medium">Mã đơn</th>
                    <th className="text-center w-[15%] font-medium">Người nhận</th>
                    <th className="text-center w-[20%] font-medium">Địa chỉ</th>
                    <th className="text-center w-[5%] font-medium">Số lượng</th>
                    <th className="text-center w-[10%] font-medium">Tổng tiền</th>
                    <th className="text-center w-[10%] font-medium">Ngày tạo</th>
                    <th className="text-center w-[10%] font-medium">Ngày cập nhật</th>
                    <th className="text-center w-[10%] font-medium">Trạng thái</th>
                    <th className="text-center w-[5%] font-medium"></th>
                    <th className="text-center pr-[24px] font-medium">Thao tác</th>
                </tr>
            </thead>
            <tbody className="w-full">
                {orders?.length
                    ? <>
                        {Array.isArray(orders) && orders?.slice(startOrder, activeOrder)?.map((order, index) => (
                            <Order key={index} order={order} />
                        ))}
                        <tr className="w-full bg-white px-6 h-[50px] text-[14px] border-t-[1px] ">
                            <td colSpan={7} className="text-end w-[10%] font-medium">
                                <p>{startOrder + 1} - {activeOrder} trên {orders?.length}</p>
                            </td>
                            <td className="text-center font-medium pr-2">
                                <div className="flex flex-row justify-center gap-1">
                                    <div className={`p-2 flex justify-center items-center
                                        ${startOrder ? "cursor-pointer rounded-[50%] hover:bg-[rgb(230,230,230)]" : "text-[#637381]"}`}
                                        onClick={() => {
                                            if (startOrder) {
                                                setStartOrder(startOrder - 8);
                                                if (startOrder != activeOrder - 1)
                                                    setActiveOrder(activeOrder - 8 > 8 ? activeOrder - 8 : 8);
                                                else setActiveOrder(activeOrder - 1);
                                            }
                                        }}
                                    >
                                        <MdArrowBackIos />
                                    </div>
                                    <div className={`p-2 flex justify-center items-center
                                        ${activeOrder < orders?.length ? "rounded-[50%] hover:bg-[rgb(230,230,230)] cursor-pointer " : "text-[#637381]"}`}
                                        onClick={() => {
                                            if (activeOrder >= orders?.length) return;
                                            setActiveOrder(activeOrder + 8 < orders?.length ? activeOrder + 8 : orders.length)
                                            setStartOrder(startOrder + 8)
                                        }}
                                    >
                                        <MdArrowForwardIos />
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </>
                    : <tr className="w-full bg-white">
                        <td colSpan={8} className="text-center">
                            <div className="h-[15rem] w-full flex flex-col justify-center items-center">
                                <h3 className="font-black text-xl my-4">Không tìm được!</h3>
                                <p className="font-normal text-sm my-2 text-gray-500">
                                    Không có đơn hàng nào phù hợp với tìm kiếm của bạn
                                </p>
                                <p className="font-normal text-sm text-gray-500">
                                    Hãy thử tìm lại bằng từ khóa khác
                                </p>
                            </div>
                        </td>
                    </tr>
                }
            </tbody>
        </table>
    );
}

export default ListOrder;
