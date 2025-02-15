import { IoIosPricetag } from "react-icons/io";
import { IoBarChartSharp, IoDocument, IoPersonAdd} from "react-icons/io5";
import { formatPrice } from "../../utils/format"
import AreaView from "./AreaView";

const Overview = ({data}) => {
    return (
        <AreaView title={"Tổng quan"}>
            <div className="w-full flex flex-row justify-between mb-5">
                <div className="w-[25%] p-4 flex flex-col space-y-4 bg-[rgb(255,226,230)] rounded-xl">
                    <div className="w-[2.5rem] h-[2.5rem] flex rounded-[50%] justify-center items-center bg-[rgb(250,90,126)]">
                        <IoBarChartSharp className="w-[1.2rem] h-[1.2rem] text-white" />
                    </div>
                    <p className="font-semibold text-lg">{formatPrice(data?.totalPrice)}</p>
                    <p className="font-medium text-[15px]">Tổng giá trị</p>
                </div>
                <div className="w-[25%] p-4 flex flex-col space-y-4 bg-[rgb(255,244,222)] rounded-xl">
                    <div className="w-[2.5rem] h-[2.5rem] flex rounded-[50%] justify-center items-center bg-[rgb(255,148,122)]">
                        <IoDocument className="w-[1.5rem] h-[1.5rem] text-white" />
                    </div>
                    <p className="font-semibold text-lg">{data?.totalOrder}</p>
                    <p className="font-medium text-[15px]">Đơn hàng đã giao</p>
                </div>
                <div className="w-[25%] p-4 flex flex-col space-y-4 bg-[rgb(220,252,231)] rounded-xl">
                    <div className="w-[2.5rem] h-[2.5rem] flex rounded-[50%] justify-center items-center bg-[rgb(61,216,88)]">
                        <IoIosPricetag className="w-[1.5rem] h-[1.5rem] text-white" />
                    </div>
                    <p className="font-semibold text-lg">{data?.totalProduct}</p>
                    <p className="font-medium text-[15px]">Sản phẩm đã bán</p>
                </div>
                <div className="w-[25%] p-4 flex flex-col space-y-4 bg-[rgb(244,232,255)] rounded-xl">
                    <div className="w-[2.5rem] h-[2.5rem] flex rounded-[50%] justify-center items-center bg-[rgb(191,131,255)]">
                        <IoPersonAdd className="w-[1.2rem] h-[1.2rem] text-white" />
                    </div>
                    <p className="font-semibold text-lg">{data?.totalUser}</p>
                    <p className="font-medium text-[15px]">Người dùng</p>
                </div>
            </div>
        </AreaView>
    )
}
export default Overview;
