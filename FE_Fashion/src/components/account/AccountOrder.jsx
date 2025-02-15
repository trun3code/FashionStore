import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatDate, formatPrice } from "../../utils/format"
import { Link } from "react-router-dom";
import { cancelOrder, getOrders } from "../../api/order";
import { MdDelete } from 'react-icons/md';
import { getImage } from "../../api/product";
import { getUserId } from "../../api/user";
import Modal from "../../layouts/Modal";
import orderImg from '../../assets/order.png'

const OrderDetail = ({ order, removeItem, index }) => {
    const { t } = useTranslation("global");
    const [openInfo, setOpenInfo] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const status = order?.status == "pending"
        ? t("account.order.status.progress")
        : order?.status == "delivered"
            ? t("account.order.status.delivered")
            : t("account.order.status.delivering");
    const handleancelOrder = async () => {
        const response = await cancelOrder(order?.id);
        if (response.status == 200)
            removeItem(index);
        setOpenModal(false);
    }
    return (
        <div className="w-full pr-[1rem]">
            <div className="w-full py-4 bg-[rgb(237,183,96)] flex md:flex-row md:flex-nowrap flex-wrap"
                onClick={() => setOpenInfo(!openInfo)}>
                <div className="md:w-1/3 w-full flex px-2 md:border-r-2 border-[rgb(230,230,230)] justify-center text-center md:mb-0 mb-6">
                    <div className="space-y-4 flex flex-col justify-between md:min-w-0 min-w-[130px]">
                        <p className="md:text-lg font-bold opacity-80">{t('account.order.id')}</p>
                        <p className="md:text-xl font-bold truncate w-full">#{order?.id}</p>
                    </div>
                </div>
                <div className="md:w-1/3 w-1/2 px-2 md:border-r-2 md:mb-0 mb-6 border-[rgb(230,230,230)] flex justify-center">
                    <div className="space-y-4 flex flex-col justify-between text-center min-w-[120px]">
                        <p className="md:text-lg font-bold opacity-80">{t('account.order.total')}</p>
                        <p className="md:text-xl font-bold">{formatPrice(order?.total)}</p>
                    </div>
                </div>
                <div className="md:w-1/3 w-1/2 px-2 md:border-r-2 md:mb-0 mb-6 border-[rgb(230,230,230)] flex justify-center">
                    <div className="space-y-4 flex flex-col justify-between text-center">
                        <p className="md:text-lg font-bold opacity-80">{t('account.order.estimated')}</p>
                        <p className="md:text-xl font-bold">{formatDate(order?.updateAt ?? order?.createAt)}</p>
                    </div>
                </div>
            </div>
            {openInfo &&
                <div className="w-full border-2 py-2 px-6">
                    {order?.items?.map((item, index) => (
                        <div key={index} className="w-full  border-b-2 py-4 flex md:space-x-8 space-x-4">
                            <Link to={"/product/" + item.item?.product.id}>
                                <img className="md:min-w-[10rem] md:min-h-[10rem] min-w-[6rem] max-h-[6rem] object-contain max-w-[6rem] shadow-lg md:rounded-none rounded-lg"
                                    src={getImage(item.image)} alt="product-img" />
                            </Link>
                            <div className="w-full flex flex-col justify-around">
                                <div className="flex flex-row justify-between items-start">
                                    <p className="md:text-xl text-sm font-bold">{item?.name}</p>
                                    <p className="md:text-lg text-sm font-bold">{formatPrice(item?.price)}</p>
                                </div>
                                <div className="font-semibold opacity-70 md:text-lg text-sm flex flex-col w-fit">
                                    <span className="capitalize">
                                        {t("cart.color")}
                                        {"   "}
                                        <div className={` inline-block h-[0.7rem] w-[2rem]`}
                                            style={{ backgroundColor: item?.color }}>
                                        </div>
                                    </span>
                                    <span> {t("cart.size")} {item?.size}</span>
                                    <span> {t("cart.quantity")}: {item?.amount}  </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="pt-2">
                        {t("checkout.confirm.receiver")}
                        <span className="font-bold">{order?.user}</span>
                    </div>
                    <div >
                        {t("checkout.confirm.address")}
                        <span className="font-bold">{order?.shippingAddress.name}</span>
                    </div>
                    <div className="w-full md:space-x-4 md:space-y-0 space-y-2 py-1 flex md:flex-row flex-col md:justify-between">
                        <div className="flex flex-row items-center">
                            <p className="md:text-xl font-semibold capitalize border-[3px] p-2 w-fit text-nowrap"
                                style={{
                                    backgroundColor: order?.status == "delivered"
                                        ? "rgba(228, 180, 47,0.2)"
                                        : order?.status == "pending"
                                            ? "rgba(74,188,120,0.1)"
                                            : "rgba(145,192,238, 0.2)",
                                    color: order?.status == "delivered"
                                        ? "rgb(228, 180, 47)"
                                        : order?.status == "pending"
                                            ? "rgb(74,188,120)"
                                            : "rgb(145,192,238)",
                                    borderColor: order?.status == "delivered"
                                        ? "rgb(228, 180, 47)"
                                        : order?.status == "pending"
                                            ? "rgb(74,188,120)"
                                            : "rgb(145,192,238)"
                                }}>
                                {status}
                            </p>
                            <p className="text-xl md:flex hidden flex-grow font-medium ml-2">
                                {order?.status == "pending"
                                    ? t('account.order.status.title')
                                    : order?.status == "delivered"
                                        ? t('account.order.status.title2')
                                        : t('account.order.status.title3')
                                }
                            </p>
                        </div>
                        {order?.status == "pending" &&
                            <button className="bg-[rgb(62,24,0)] text-white font-bold md:h-[3rem] h-[2.5rem] w-[9rem]"
                                onClick={() => setOpenModal(true)}>
                                {t('account.order.cancel')}
                            </button>
                        }
                    </div>
                </div>
            }
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <div className="w-56 h-full flex justify-center items-center flex-col space-y-2">
                    <MdDelete className="w-[3rem] h-[3rem] text-[rgb(255,86,48)]" />
                    <h3 className="text-lg font-black text-gray-800">{t('account.order.cancel')}</h3>
                    <p className="text-[12px] text-center text-gray-500">
                        {t('account.order.id')}: #{order?.id}
                    </p>
                    <div className="flex gap-2 w-full">
                        <button className="py-2 px-4 b bg-[rgb(246,246,246)] text-red-500 font-semibold w-1/2 text-center rounded-xl shadow"
                            onClick={handleancelOrder}>
                            {t("ok")}
                        </button>
                        <button className="py-2 px-4 bg-[rgb(36,212,212)] text-white font-semibold w-1/2 text-center rounded-xl shadow" onClick={() => setOpenModal(false)}>
                            {t("cancel")}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

const AccountOrder = () => {
    const { t } = useTranslation("global");
    const [orders, setOrders] = useState([]);
    const fetchData = async () => {
        setOrders(await getOrders(getUserId()));
    }
    useEffect(() => {
        fetchData();
    }, [])
    return (
        <div className="w-full space-y-6">
            {(orders == null || orders.length == 0)
                ? <div className="w-full flex flex-col sm:space-y-4 space-y-2 items-center justify-center">
                    <img className="sm:h-[15rem] h-[10rem] w-[10rem] sm:w-[15rem] rounded-[50%]" src={orderImg} alt="" />
                    <p className="sm:text-lg font-bold text-center">{t("account.order.no-order")}</p>
                    <Link to="/products">
                        <button className="sm:w-[25rem] w-[20rem] text-xl py-3 bg-[rgb(62,24,0)] text-white font-semibold">
                            {t("cart.order.back")}
                        </button>
                    </Link>
                </div>
                : <>
                    <p className="md:text-2xl text-xl font-bold">{t("account.order.title")}
                        <span>({orders?.length})</span>
                    </p>
                    {Array.isArray(orders) && orders?.map((order, index) => (
                        <OrderDetail key={order?.id} order={order} index={index}
                            removeItem={(i) => {
                                orders.splice(i, 1);
                                setOrders([...orders]);
                            }} />
                    ))}
                </>}
        </div>
    )
}

export default AccountOrder;
