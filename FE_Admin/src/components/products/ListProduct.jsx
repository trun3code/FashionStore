import { useEffect, useState } from "react";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import Product from "./Product";

const ListProduct = ({ products, setProducts }) => {
    const [activeProduct, setActiveProduct] = useState(0);
    const [startProduct, setStartProduct] = useState(0);
    useEffect(() => {
        setActiveProduct(products?.length > 8 ? 8 : products?.length);
    }, [products]);
    return (
        <table className="table-auto w-full">
            <thead className="h-[50px] w-full text-[14px] text-[#637381] ">
                <tr className="w-full ">
                    <th className="text-start pl-[24px] w-1/4 font-medium">Tên sản phẩm</th>
                    <th className="text-start w-[10%] font-medium pl-6">Danh mục</th>
                    <th className="text-center w-[10%] font-medium">Giá</th>
                    <th className="text-center w-[6%] font-medium">Giảm giá</th>
                    <th className="text-center w-[6%] font-medium">Đánh giá</th>
                    <th className="text-center w-[14%] font-medium">Ngày tạo</th>
                    <th className="text-center w-[14%] font-medium">Ngày cập nhật</th>
                    <th className="text-center pr-[24px] font-medium">Thao tác</th>
                </tr>
            </thead>
            <tbody className="w-full">
                {products?.length
                    ? <>
                        {Array.isArray(products) && products?.slice(startProduct, activeProduct)?.map((product, index) => (
                            <Product
                                key={product?.id}
                                product={product}
                                removeProductInList={() => {
                                    setProducts(products.filter((_, i) => i !== index));
                                }} />
                        ))}
                        <tr className="w-full bg-white px-6 h-[50px] text-[14px] border-t-[1px]">
                            <td className="text-start pl-[24px] w-1/4 font-medium"></td>
                            <td className="text-start w-[10%] font-medium"></td>
                            <td className="text-center w-[10%] font-medium"></td>
                            <td className="text-center w-[10%] font-medium"></td>
                            <td className="text-center w-[10%] font-medium"></td>
                            <td className="text-center w-[10%] font-medium"></td>
                            <td className="text-center w-[30%] font-medium">
                                <p>{startProduct + 1} - {activeProduct} trong số {products?.length} sản phẩm</p>
                            </td>
                            <td className="text-center font-medium pr-2">
                                <div className="flex flex-row justify-center gap-1">
                                    <div className={`p-2 flex justify-center items-center
                                        ${startProduct ? "cursor-pointer rounded-[50%] hover:bg-[rgb(230,230,230)]" : "text-[#637381]"}`}
                                        onClick={() => {
                                            if (!startProduct) return;
                                            setStartProduct(startProduct - 8);
                                            if (startProduct != activeProduct - 1)
                                                setActiveProduct(activeProduct - 8 > 8 ? activeProduct - 8 : 8);
                                            else setActiveProduct(activeProduct - 1);
                                        }}
                                    >
                                        <MdArrowBackIos />
                                    </div>
                                    <div className={`p-2 flex justify-center items-center
                                        ${activeProduct < products?.length ? "rounded-[50%] hover:bg-[rgb(230,230,230)] cursor-pointer " : "text-[#637381]"}`}
                                        onClick={() => {
                                            if (activeProduct < products?.length) {
                                                setActiveProduct(activeProduct + 8 < products?.length ? activeProduct + 8 : products?.length);
                                                setStartProduct(startProduct + 8);
                                            }
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
                                    Không có sản phẩm nào phù hợp với tìm kiếm của bạn
                                </p>
                                <p className="font-normal text-sm text-gray-500">
                                    Hãy thử kiếm tra lỗi chính tả hoặc
                                    điền đầy đủ tên sản phẩm cần tìm.
                                </p>
                            </div>
                        </td>
                    </tr>
                }
            </tbody>
        </table>
    )
}
export default ListProduct;
