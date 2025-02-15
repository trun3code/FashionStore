import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaPlus,FaUpload } from "react-icons/fa6";
import { dismissToast, showErrorNoti, showLoadingNoti, showSuccessNoti } from "../../utils/toastify";
import { updateAI } from "../../api/product";

const FilterProducts = ({ products, setProducts }) => {
    const navigate = useNavigate();
    const [showSort, setShowSort] = useState(false);
    const [sortIndex, setSortIndex] = useState(0);
    const values = [
        {
            value: "newest",
            title: "Thời gian tạo: mới nhất"
        },
        {
            value: "oldest",
            title: "Thời gian tạo: cũ nhất"
        },
        {
            value: "high-rating",
            title: "Đánh giá: cao -> thấp"
        },
        {
            value: "low-rating",
            title: "Đánh giá: thấp -> cao"
        },
        {
            value: "high-price",
            title: "Giá: cao -> thấp"
        },
        {
            value: "low-price",
            title: "Giá: thấp -> cao"
        }
    ]
    const handleSort = (value, event) => {
        event.stopPropagation();
        setSortIndex(value);
        setShowSort(false);
    }
    const handleUpdateAI = async () => {
        const loadingId = showLoadingNoti("Vui lòng đợi...");
        const response = await updateAI();
        dismissToast(loadingId);
        if (response?.status == 200)
            showSuccessNoti("Cập nhật thành công")
        else showErrorNoti("Có lỗi sảy ra, vui lòng thử lại sau")
    }
    useEffect(() => {
        if (!products) return;
        const sortType = values[sortIndex].value;
        sortType == "newest"
            ? products.sort((a, b) => new Date(b.createAt) - new Date(a.createAt))
            : sortType == "oldest"
                ? products.sort((a, b) => new Date(a.createAt) - new Date(b.createAt))
                : sortType == "high-rating"
                    ? products.sort((a, b) => b.rating - a.rating)
                    : sortType == "low-rating"
                        ? products.sort((a, b) => a.rating - b.rating)
                        : sortType == "high-price"
                            ? products.sort((a, b) => b.price - a.price)
                            : products.sort((a, b) => a.price - b.price);
        setProducts([...products]);
    }, [sortIndex])
    return (
        <div className="w-full p-6 bg-white flex flex-row justify-between rounded-t-[16px] items-center">
            <div className="flex flex-row items-center space-x-6 w-[75%]">
                <div className="space-x-2 flex flex-row items-center">
                    <label className="font-medium">Sắp xếp theo:</label>
                    <div className={`cursor-pointer text-[#637381] py-2 px-3 rounded-[8px] justify-around w-[14rem] flex flex-row items-center relative 
                        ${showSort ? "border-[rgb(24,119,242)] border-[1px] pointer-events-none" : "border-[1px]"}`}
                        onClick={() => { setShowSort(true); }}>
                        <span>{values[sortIndex].title}</span>
                        <MdKeyboardArrowDown />
                        {showSort &&
                            <ul className={`list-none absolute bg-white shadow-xl top-[41px] rounded-[8px]
                                transform transition-all duration-300 ease-in-out ${showSort && "pointer-events-auto"}`}>
                                {values?.map((value, index) => (
                                    <li key={index}
                                        className={`py-2 px-5 w-[14rem] first:rounded-t-[8px] last-rounded-b-[8px]
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
            <div className="flex space-x-2">
                <button className="flex flex-row items-center rounded-[8px] bg-[rgb(70,120,120)] text-white space-x-2 py-2 px-3"
                    onClick={handleUpdateAI}>
                    <FaUpload />
                    <span>Cập nhật AI</span>
                </button>
                <button className="flex flex-row items-center rounded-[8px] bg-[rgb(33,43,54)] text-white space-x-2 py-2 px-3"
                    onClick={() => navigate('/product/edit/0')}>
                    <FaPlus />
                    <span>Thêm sản phẩm</span>
                </button>
            </div>
        </div>
    );
}
export default FilterProducts;