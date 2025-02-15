import { getImage } from "../../api/product";
import { formatPrice } from "../../utils/format";

const ProductItems = ({ open, items }) => {
    return (
        <td className={`transform transition-all overflow-hidden duration-300 py-2
            ${open ? "translate-y-0 opacity-100 z-0" : "-translate-y-1/4 opacity-0 -z-50 invisible"}`} colSpan={8}>
            <table className="table-auto w-full">
                <thead className="h-[50px] text-[14px] text-[#637381]">
                    <tr>
                        <th className="w-[20%] font-medium" colSpan={2}>Hình ảnh</th>
                        <th className="w-[15%] font-medium">Giá trả thêm</th>
                        <th className="font-medium w-[10%] text-center">Màu sắc</th>
                        <th className="font-medium w-[10%] text-center">Kích thước</th>
                        <th className="font-medium w-[10%] text-center">Trong kho</th>
                        <th className="flex-grow"></th>
                    </tr>
                </thead>
                <tbody className="h-0">
                    {items?.map(item => (
                        <tr key={item?.id} className="bg-white hover:bg-transparent text-[14px]">
                            <td className="w-[20%] text-center font-medium" colSpan={2}>
                                <div className="flex flex-row items-center justify-center space-x-2 py-1">
                                    <img src={getImage(item?.productImage)} className="w-[70px] h-[70px] object-contain rounded-md" alt="" />
                                </div>
                            </td>
                            <td className="w-[15%] text-center font-medium">{formatPrice(item?.bonusPrice)}</td>
                            <td className="font-medium capitalize text-center">
                                <input type="color" disabled className=' w-[2.5rem] h-[2.5rem] rounded-full' value={item?.color} />
                            </td>
                            <td className="font-medium text-center">{item?.size}</td>
                            <td className="font-medium text-center">{item?.quantity}</td>
                            <td></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </td>
    )
}

export default ProductItems;
