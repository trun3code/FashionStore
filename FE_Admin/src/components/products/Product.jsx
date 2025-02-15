import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { MdDelete, MdEdit, MdOutlineKeyboardDoubleArrowDown } from "react-icons/md";
import { getImage, removeProduct } from "../../api/product";
import { formatDate, formatPrice } from "../../utils/format";
import { showSuccessNoti } from "../../utils/toastify";
import Modal from "../../layouts/Modal";
import ProductItems from "./ProductItems";

const Product = ({ product, removeProductInList }) => {
    const navigate = useNavigate();
    const [openItems, setOpenItems] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const handleDelete = async () => {
        await removeProduct(product?.id);
        setOpenModal(false);
        removeProductInList();
        showSuccessNoti("Xóa sản phẩm thành công!");
    }
    return (
        <>
            <tr className="bg-white hover:bg-transparent text-[14px] border-t-[1px]">
                <td className="text-start pl-[24px] w-1/4 font-semibold ">
                    <div className="flex flex-row items-center space-x-2 py-1">
                        <img loading="lazy" src={getImage(product?.productImage)} className="h-[70px] w-[70px] rounded-md object-contain" alt="" />
                        <span>{product?.productName}</span>
                    </div>
                </td>
                <td className="text-start w-[10%] font-medium">
                    <div className="flex flex-col pl-6">
                        <span>
                            {product?.category?.gender == "male" ? "Nam" : product?.category?.gender == "female" ? "Nữ" : "Trẻ em"}
                        </span>
                        <span>
                            {product?.category?.category == "shoes" ? "Giày" : product?.category?.category == "clothes" ? "Quần áo" : "Phụ kiện"}
                        </span>
                        <span className="capitalize">
                            {product?.category?.brand}
                        </span>
                    </div>
                </td>
                <td className="text-center w-[10%] font-medium">{formatPrice(product?.price)}</td>
                <td className="text-center w-[6%] font-medium">{product?.sale != 0 ? ("- " + product?.sale + "%") : ""}</td>
                <td className="text-center w-[6%] font-medium">
                    <div className="flex flex-row items-center justify-center space-x-1">
                        <span>{product?.rating}</span>
                        <AiFillStar className="w-[1rem] h-[2rem] text-[rgb(244,189,98)]" />
                    </div>
                </td>
                <td className="text-center w-[14%]">{formatDate(product?.createAt)}</td>
                <td className="text-center w-[14%]">{formatDate(product?.updateAt)}</td>
                <td className="pr-[24px] ">
                    <div className="flex justify-center space-x-2">
                        <div className={`p-2 rounded-[50%] cursor-pointer transition-all duration-300
                            ${openItems ? "rotate-180 bg-[rgba(0,0,0,0.3)]" : "text-[rgb(114,117,115)] bg-[rgba(114,117,115,0.3)] "}`}
                            onClick={() => setOpenItems(!openItems)}
                        >
                            <MdOutlineKeyboardDoubleArrowDown className="w-[1.2rem] h-[1.2rem]" />
                        </div>
                        <div className="bg-[rgba(24,119,242,0.3)] p-2 rounded-[50%] cursor-pointer"
                            onClick={() => navigate(`/product/edit/${product?.id}`)}
                        >
                            <MdEdit className="w-[1.2rem] h-[1.2rem] text-[rgb(24,119,242)]" />
                        </div>
                        <div className="bg-[rgba(255,86,48,0.3)] p-2 rounded-[50%] cursor-pointer"
                            onClick={() => setOpenModal(true)}
                        >
                            <MdDelete className="w-[1.2rem] h-[1.2rem] text-[rgb(255,86,48)]" />
                        </div>

                    </div>
                </td>
                <td>
                    <Modal open={openModal} onClose={() => setOpenModal(false)}>
                        <div className="w-56 h-full flex justify-center items-center flex-col space-y-2">
                            <MdDelete className="w-[3rem] h-[3rem] text-[rgb(255,86,48)]" />
                            <h3 className="text-lg font-black text-gray-800">Xóa sản phẩm</h3>
                            <p className="text-[12px] text-center text-gray-500">
                                Bạn có chắc là muốn xóa sản phẩm
                                <span className="font-black"> {product?.productName}</span>
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
            <tr>
                {openItems && product?.items && <ProductItems open={openItems} items={product?.items} />}
            </tr>
        </>
    )
}

export default Product;
