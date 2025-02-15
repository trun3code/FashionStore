import { getImage } from "../../api/product";
import { formatPrice } from "../../utils/format";
import  deleted  from "../../assets/deleted.jpg"

const OrderItem = ({ order }) => {
    return (
        <td colSpan={10} >
            <table className="table-auto ml-1 ">
                <thead className="h-[40px] text-[14px] text-[#637381]">
                    <tr>
                        <th className="w-[20%] text-center font-medium">Tên sản phẩm</th>
                        <th className="w-[10%] text-center font-medium">Kích thước</th>
                        <th className="w-[15%] text-center font-medium">Màu sắc</th>
                        <th className="w-[15%] text-center font-medium">Số lượng</th>
                        <th className="w-[15%] text-center font-medium">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {order?.items?.map((item, index) => (
                        <tr key={index} className=" text-[14px]">
                            <td className="w-[35%] text-start font-medium">
                                <div className="flex flex-row items-center justify-start space-x-2 py-1">
                                    <img src={item?.image != null ? getImage(item?.image) : deleted}
                                        className="w-[70px] h-[70px] object-contain rounded-md"
                                        alt=""
                                    />
                                    <p>{item?.name}</p>
                                </div>
                            </td>
                            <td className="text-center w-[10%]">{item?.size}</td>
                            <td className="text-center w-[15%]">
                                {item?.color != null &&
                                    <input type="color" required disabled value={item?.color}
                                        className='w-[2.5rem] h-[2.5rem] rounded-full border-none '
                                    />
                                }
                            </td>
                            <td className="text-center w-[20%]">{item?.amount}</td>
                            <td className="font-medium text-center">{formatPrice(item?.price)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </td>
    )
}

export default OrderItem;
