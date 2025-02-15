import { useState } from "react";
import { formatDate } from "../../utils/format";
import { FaArrowLeft, FaTrashCan, FaCheck } from "react-icons/fa6";
import { MdDone, MdDelete } from "react-icons/md";
import { removeRoute, updateOrderStatus, completeRoute } from "../../api/order";
import { showSuccessNoti } from "../../utils/toastify";
import img from "../../assets/delivery.jpg";
import Modal from "../../layouts/Modal";

const MapOrderInfo = ({ order, route }) => {
    const [openModal, setOpenModal] = useState(false);
    const [show, setShow] = useState(true);
    const handleDeleteOrderFromRoute = async () => {
        await updateOrderStatus({ "id": order.id, "status": "pending" });
        setShow(false);
        setOpenModal(false);
    }
    return (
        show && <div className='flex flex-row items-center space-x-2 justify-between'>
            <div className='text-sm'>
                <p>Đơn hàng của:<span className='font-bold text-[16px]'> {order?.user} - {order.phoneNumber}</span></p>
                <p className='text-[12px]'>{order?.shippingAddress?.name}</p>
            </div>
            {route.status == 0 &&
                <div className="p-2 rounded-[50%] cursor-pointer bg-[rgba(216,61,61,0.3)] text-[rgb(216,61,61)]"
                    onClick={() => setOpenModal(true)}>
                    <MdDelete className="w-[1.2rem] h-[1.2rem]" />
                </div>
            }
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <div className="w-56 h-full flex justify-center items-center flex-col space-y-2">
                    <MdDelete className="p-1 rounded-[50%] w-[3rem] h-[3rem] bg-[rgba(255,61,61,0.3)] text-[rgb(216,61,61)]" />
                    <h3 className="text-lg font-black text-gray-800 font-medium">
                        Giao không thành công
                    </h3>
                    <p className="text-[12px] text-center text-gray-500">
                        Xác nhận đơn hàng đã giao nhưng không thành công
                    </p>
                    <div className="flex gap-2 w-full">
                        <button className="py-2 px-4 b bg-[rgb(246,246,246)] text-blue-500 font-semibold w-1/2 text-center rounded-xl shadow"
                            onClick={handleDeleteOrderFromRoute}>
                            Đồng ý
                        </button>
                        <button className="py-2 px-4 bg-[rgb(36,212,212)] text-white font-semibold w-1/2 text-center rounded-xl shadow"
                            onClick={() => setOpenModal(false)}>
                            Hủy
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
const MapRouteInfo = ({ route, setViewDetailRoute, forceUpdate }) => {
    const [openModal, setOpenModal] = useState(false);
    const [routeStatus, setRouteStatus] = useState(0);
    const handleChangeStatusRoute = (status) => {
        setOpenModal(status != 0);
        setRouteStatus(status);
    }
    const updateRouteStatus = async () => {
        switch (routeStatus) {
            case 1:
                await completeRoute(route.id);
                showSuccessNoti("Cập nhật thành công");
                break;
            case 2:
                await removeRoute(route.id);
                showSuccessNoti("Xóa thành công");
                break;
        }
        setOpenModal(false);
        setViewDetailRoute(false);
        forceUpdate();
    }
    return (
        <div className="h-[85%]">
            <div className="my-[1rem] flex flex-row justify-between">
                <FaArrowLeft className="cursor-pointer size-5"
                    onClick={() => { setViewDetailRoute(false); forceUpdate(); }} />
                {route.status == 0 &&
                    <div className="flex space-x-3 ">
                        <FaCheck className="cursor-pointer size-5" onClick={() => handleChangeStatusRoute(1)} />
                        <FaTrashCan className="cursor-pointer size-5" onClick={() => handleChangeStatusRoute(2)} />
                    </div>
                }
            </div>
            <div className='flex flex-col space-y-2  overflow-y-auto divide-y-2 divide-dashed'>
                <div className='flex flex-row items-center space-x-1'>
                    <div className='text-sm'>
                        <p className='font-bold'>Điểm bắt đầu hành trình</p>
                        <p className='text-[12px]'>{route.start}</p>
                    </div>
                </div>
                {route?.orders.map((order) =>
                    <MapOrderInfo
                        key={order.id}
                        order={order}
                        route={route}
                    />
                )}
                <div className='flex flex-row items-center space-x-2'>
                    <div className='text-sm'>
                        <p className='font-bold'>Điểm kết thúc hành trình</p>
                        <p className='text-[12px]'>{route.end}</p>
                    </div>
                </div>
            </div>
            <Modal open={openModal} onClose={() => handleChangeStatusRoute(0)}>
                <div className="w-56 h-full flex justify-center items-center flex-col space-y-2">
                    {
                        routeStatus == 1
                            ? <MdDone className="p-1 rounded-[50%] w-[3rem] h-[3rem] bg-[rgba(61,216,88,0.3)] text-[rgb(61,216,88)]" />
                            : <MdDelete className="p-1 rounded-[50%] w-[3rem] h-[3rem] bg-[rgba(255,61,61,0.3)] text-[rgb(216,61,61)]" />
                    }
                    <h3 className="text-lg font-black text-gray-800 font-medium">
                        {
                            routeStatus == 1
                                ? "Xác nhận thành công"
                                : "Xoá lộ trình "
                        }
                    </h3>
                    <p className="text-[12px] text-center text-gray-500">
                        {routeStatus == 1
                            ? "Xác nhận đã giao hàng thành công toàn bộ đơn hàng"
                            : "Bạn có chắc muốn xóa lộ trình này không?"
                        }
                    </p>
                    <div className="flex gap-2 w-full">
                        <button className="py-2 px-4 b bg-[rgb(246,246,246)] text-blue-500 font-semibold w-1/2 text-center rounded-xl shadow"
                            onClick={updateRouteStatus}>
                            Đồng ý
                        </button>
                        <button className="py-2 px-4 bg-[rgb(36,212,212)] text-white font-semibold w-1/2 text-center rounded-xl shadow"
                            onClick={() => handleChangeStatusRoute(0)}>
                            Hủy
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
const MapRouteList = ({ forceUpdate, routes }) => {
    const [viewDetailRoute, setViewDetailRoute] = useState(false);
    const [curRoute, setCurRoute] = useState(null)
    const viewRoute = (route) => {
        setCurRoute(route);
        setViewDetailRoute(true);
    }
    return (
        routes?.length
            ? <>{viewDetailRoute
                ? <MapRouteInfo route={curRoute} forceUpdate={forceUpdate} setViewDetailRoute={setViewDetailRoute} />
                : <div className='h-[85%] space-y-4'>
                    <p className='w-fit border px-4 py-2 text-sm rounded-lg font-medium bg-[rgba(255,86,48,0.2)] text-[rgb(255,86,48)]'>
                        Số lộ trình đã tạo ({routes?.length})
                    </p>
                    <div className='flex flex-col space-y-2 h-[90%] overflow-y-auto scrollbar'>
                        {routes?.map((route, index) => (
                            <div key={index} className='p-2 rounded-xl text-[11px] space-y-2'>
                                <div className='flex flex-row font-medium justify-between items-center'>
                                    <div className='flex flex-row space-x-2'>
                                        <div className='px-2 py-[2px] rounded-[50%] bg-[rgba(24,119,242,0.3)] text-[rgb(24,119,242)]'>
                                            {index + 1}
                                        </div>
                                        <button className='bg-[rgba(24,119,242,0.3)] text-[rgb(24,119,242)] px-2 py-[2px] rounded-md'
                                            onClick={() => viewRoute(route)}
                                        >
                                            Chi tiết lộ trình
                                        </button>
                                        {route?.status != 0
                                            ? <div className='bg-[rgba(24,242,133,0.3)] text-[rgb(24,242,115)] px-2 py-[2px] rounded-md'>
                                                Đã giao
                                            </div>
                                            : <div className='bg-[rgba(242,35,24,0.3)] text-[rgb(242,24,24)] px-2 py-[2px] rounded-md'>
                                                Chưa giao
                                            </div>
                                        }
                                    </div>
                                    <div>{formatDate(route?.updateAt ?? route?.createAt)}</div>
                                </div>
                                <div className='space-x-1'>
                                    <span className='px-[6px] py-[1px] rounded-[50%] bg-[rgba(255,86,48,0.3)] text-[rgb(0,0,0)]'>
                                        S
                                    </span>
                                    <span className='font-bold'>{route?.start}</span>
                                </div>
                                {route?.orders?.map((order, index) => (
                                    <div key={index} className='space-x-1 flex flex-row items-center'>
                                        <span className='px-[6px] py-[1px] rounded-[50%] bg-[rgba(255,86,48,0.3)] text-[rgb(0,0,0)]'>
                                            {index + 1}
                                        </span>
                                        <div className='flex flex-col '>
                                            <p >
                                                Đơn hàng của <span className='font-bold'>{order?.user} - {order?.phoneNumber}</span>
                                            </p>
                                            <p className='text-[11px]'>
                                                {order?.shippingAddress?.name}
                                                {order?.replace &&
                                                    <span className='font-bold'>{" "}({order?.replace.name})</span>
                                                }
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div className='space-x-1'>
                                    <span className='px-[6px] py-[1px] rounded-[50%] bg-[rgba(255,86,48,0.3)] text-[rgb(0,0,0)]'>E</span>
                                    <span className='font-bold'>{route?.end}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            }
            </>
            : <div className='h-[80%] space-y-4 w-full flex flex-col justify-center items-center'>
                <img src={img} className='w-full h-auto' />
                <p className='font-semibold'>Bạn chưa lưu lộ trình nào</p>
            </div>
    );
}
export default MapRouteList;