import { getImage } from "../../api/product"

const TopProduct = ({ products }) => {
    return (
        <div className="w-full h-full bg-white px-6 py-4 rounded-2xl space-y-6">
            <h2 className="font-black text-xl">Sản phẩm bán chạy</h2>
            <div className="flex flex-col w-full justify-center space-y-4">
                <div className="flex-row w-full flex font-medium">
                    <h2 className="w-[2rem] text-start">#</h2>
                    <h2 className="w-[280px]">Tên sản phẩm</h2>
                    <h2 className="w-[5rem] text-center">Bán ra</h2>
                </div>
                {products?.map((product, index) => (
                    <div key={index} className="flex flex-row items-center">
                        <p className="w-[2rem] text-start">{index + 1}</p>
                        <div className="flex flex-row w-[280px] space-x-2 items-center">
                            <img src={getImage(product?.productImage)} alt=""
                                className="w-[54px] h-[54px] rounded-xl object-contain shadow-md"/>
                            <p className="font-medium text-ellipsis overflow-hidden h-[50px]">{product?.productName}</p>
                        </div>
                        <p className="w-[5rem] text-center font-medium">
                            {product.amount}
                        </p>
                    </div>
                ))}

            </div>

        </div>
    )
}

export default TopProduct
