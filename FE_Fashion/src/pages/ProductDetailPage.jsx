import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getProduct, getReviews, getUserReview } from "../api/product";
import { isLogin } from "../api/user";
import ProductInfo from "../components/product_detail/ProductInfo";
import PageTitle from "../layouts/PageTitle";
import ProductReview from "../components/product_detail/ProductReview";
import ProductOverview from "../components/product_detail/ProductOverview";
import ProductDescription from "../components/product_detail/ProductDescription";
import RelatedProduct from "../components/product_detail/RelatedProduct";

const ProductDetailPage = () => {
    const navigation = useNavigate();
    const { t } = useTranslation("global");
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [activeContent, setActiveContent] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState([]);
    async function fetchData() {
        if (!/^\d+$/.test(id)) navigation("/404", { replace: true });
        const p = await getProduct(id);
        if (!p) navigation("/404", { replace: true });
        setProduct(p);
        setReviews(await getReviews(id));
        setUserReview(isLogin() ? await getUserReview(p?.id) : null);
    };
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <>
            <PageTitle title={t("page-title.product")} subtitle={t("page-title.product-sub")} />
            <div className="flex flex-col items-center pb-6">
                <ProductInfo product={product} />
                <div>
                    <RelatedProduct id={product?.id} />
                </div>
                <section className="w-full h-fit max-w-screen-2xl 2xl:px-0 lg:px-4 mt-10">
                    <div className="w-full flex flex-row justify-around overflow-x-auto">
                        <span className={`lg:text-3xl sm:text-2xl text-xl pb-3 font-bold text-center min-w-[12rem] ${activeContent == 0 ? "border-b-4 border-[black]" : "opacity-50 cursor-pointer"}`} onClick={() => setActiveContent(0)}>{t("product.description")}</span>
                        <span className={`lg:text-3xl sm:text-2xl text-xl pb-3 font-bold text-center min-w-[14rem] ${activeContent == 1 ? "border-b-4 border-[black]" : "opacity-50 cursor-pointer"}`} onClick={() => setActiveContent(1)}>{t("product.add-infor.title")}</span>
                        <span className={`lg:text-3xl sm:text-2xl text-xl pb-3 font-bold text-center min-w-[8rem] ${activeContent == 2 ? "border-b-4 border-[black]" : "opacity-50 cursor-pointer"}`} onClick={() => setActiveContent(2)}>{t("product.review")}</span>
                    </div>
                    <div className="w-full md:min-h-[30rem] h-fit px-4 py-10 border-t-2 border-[rgb(230,230,230)]">
                        {activeContent == 0 ?
                            <ProductDescription description={product?.description} />
                            : activeContent == 1
                                ? <ProductOverview product={product} />
                                : <ProductReview reviews={reviews} userReview={userReview} productId={product.id} />
                        }
                    </div>
                </section>
            </div>
        </>
    );
};
export default ProductDetailPage;
