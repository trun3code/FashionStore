import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { MdKeyboardArrowDown } from "react-icons/md";

const FilterOrders = ({ orders, setOrders }) => {
    const navigate = useNavigate()
    const [showSort, setShowSort] = useState(false);
    const [sortIndex, setSortIndex] = useState(0);
    const values = [
        {
            value: "newest",
            title: "Thời gian tạo: Mới nhất"
        },
        {
            value: "oldest",
            title: "Thời gian tạo: Cũ nhất"
        },
        {
            value: "update-newest",
            title: "Thời gian cập nhật: Mới nhất"
        },
        {
            value: "update-oldest",
            title: "Thời cập nhật: Cũ nhất"
        },
        {
            value: "pending",
            title: "Trạng thái: Đang xử lý"
        },
        {
            value: "delivered",
            title: "Trạng thái: Đã giao"
        },
        {
            value: "capital",
            title: "Thành phố Hà Nội"
        },
        {
            value: "non-capital",
            title: "Tỉnh/Tp khác "
        },
    ]
    const handleSort = (value, event) => {
        event.stopPropagation();
        setSortIndex(value);
        setShowSort(false);
    }
    useEffect(() => {
        if (!orders) return;
        const sortType = values[sortIndex].value;
        switch (sortType) {
            case "newest":
                orders.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
                break;
            case "oldest":
                orders.sort((a, b) => new Date(a.createAt) - new Date(b.createAt));
                break;
            case "update-newest":
                orders.sort((a, b) => new Date(b.updateAt) - new Date(a.updateAt));
                break;
            case "update-oldest":
                orders.sort((a, b) => new Date(a.updateAt) - new Date(b.updateAt));
                break;
            case "non-capital":
                orders.sort((a, b) => {
                    const isA = a.shippingAddress.city == "Thành phố Hà Nội" ? 1 : 0;
                    const isB = b.shippingAddress.city == "Thành phố Hà Nội" ? 1 : 0;
                    return isA - isB;
                });
                break;
            case "capital":
                orders.sort((a, b) => {
                    const isA = a.shippingAddress.city == "Thành phố Hà Nội" ? 1 : 0;
                    const isB = b.shippingAddress.city == "Thành phố Hà Nội" ? 1 : 0;
                    return isB - isA;
                });
                break;
            case "pending":
                orders.sort((a, b) => b.status.localeCompare(a.status));
                break;
            default:
                orders.sort((a, b) => a.status.localeCompare(b.status));
                break;
        }
        setOrders([...orders]);
    }, [sortIndex])
    return (
        <div className="w-full p-6 bg-white flex flex-row justify-between rounded-t-[16px] items-center">
            <div className="flex flex-row items-center space-x-6 w-[75%]">
                <div className="space-x-2 flex flex-row items-center">
                    <label className="font-medium">Sắp xếp theo:</label>
                    <div className={`cursor-pointer text-[#637381] 
                        py-2 px-3 rounded-[8px] justify-around w-[17rem] 
                        ${showSort ? "border-[rgb(24,119,242)] border-[1px] pointer-events-none" : "border-[1px]"} 
                        flex flex-row items-center relative `}
                        onClick={() => { setShowSort(true); }}>
                        <span>{values[sortIndex].title}</span>
                        <MdKeyboardArrowDown />
                        {showSort &&
                            <ul className={`list-none absolute bg-white shadow-xl top-[41px] rounded-[8px]
                                transform transition-all duration-300 ease-in-out ${showSort && "pointer-events-auto"}`} >
                                {values?.map((value, index) => (
                                    <li key={index}
                                        className={`py-2 px-5 w-[17rem] first:rounded-t-[8px] last-rounded-b-[8px]
                                        ${index == sortIndex ? "bg-[rgb(237,244,254)]" : "hover:bg-[rgb(245,245,245)]"}`}
                                        onClick={(event) => handleSort(index, event)}
                                        value={value.value}>
                                        {value.title}
                                    </li>
                                ))}
                            </ul>
                        }
                    </div>
                </div>
            </div>
            <button className="flex flex-row items-center rounded-[8px] bg-[rgb(33,43,54)] text-white space-x-2 py-2 px-3" onClick={() => navigate('/order/map')}>
                <FaPlus />
                <span>Tạo lộ trình</span>
            </button>
        </div>
    )
}

export default FilterOrders;
