import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ProductOverview = ({ product }) => {
    const [productInfo, setProductInfo] = useState({})
    const { t } = useTranslation("global");
    useEffect(() => {
        productInfo.brand = product.category.brand;
        productInfo.gender = product.category.gender;
        var sizes = "";
        var colors = [];
        setProductInfo({ ...productInfo,"sizes":sizes,"colors":colors })
        for (var i = 0; i < product?.items.length; i++) {
            const e = product.items[i];
            sizes += e?.size + "  ";
            colors.push(e?.color)
        }
    }, [product])
    return (
        <table className="table-auto w-full border-collapse border border-[rgb(230,230,230)]">
            <thead className=" w-full bg-[rgb(244,189,98)]">
                <tr className="w-full">
                    <th className="w-2/5 lg:pl-10 pl-6 py-4 text-xl text-start font-semibold">{t("product.add-infor.feat")}</th>
                    <th className="w-3/5 py-4 text-xl text-start font-semibold">{t("product.add-infor.des")}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="w-2/5 lg:pl-10 pl-6 py-4 text-xl font-normal">{t("profile.gender")}</td>
                    <th className="w-3/5 py-4 text-xl text-start font-normal">{t("profile." + productInfo.gender)}</th>
                </tr>
                <tr className="bg-[rgb(245,245,245)]">
                    <td className="w-2/5 lg:pl-10 pl-6 py-4 text-xl font-normal">{t("product.add-infor.size")}</td>
                    <th className="w-3/5 py-4 text-xl text-start font-normal">{productInfo.sizes}</th>
                </tr>
                <tr>
                    <td className="w-2/5 lg:pl-10 pl-6 py-4 text-xl font-normal">{t("product.add-infor.color")}</td>
                    <th className="w-3/5 py-4 text-xl text-start font-normal">
                        {productInfo.colors?.map((color,index) => 
                            <div key={index} className={`inline-block h-[0.8rem] w-[2rem]`} style={{ backgroundColor: color }}>
                            </div>
                        )}
                    </th>
                </tr>
                <tr className="bg-[rgb(245,245,245)]">
                    <td className="w-2/5 lg:pl-10 pl-6 py-4 text-xl font-normal">{t("product.add-infor.brand")}</td>
                    <th className="w-3/5 py-4 text-xl text-start font-normal">{product?.category.brand}</th>
                </tr>
            </tbody>
        </table>
    )
}
export default ProductOverview;