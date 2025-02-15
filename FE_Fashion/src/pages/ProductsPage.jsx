import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSidebarStore } from "../states/sidebar";
import { getSearchAndFilterProducts } from "../api/product";
import { useParams } from "react-router-dom";
import PageTitle from "../layouts/PageTitle";
import ProductsData from "../components/products/ProductsData";
import ProductsFilter from "../components/products/ProductsFilter";

const ProductsPage = () => {
  const { str } = useParams();
  const { t } = useTranslation("global");
  const { filterBarOpen } = useSidebarStore();
  const [filter, setFilter] = useState({});
  const [products, setProducts] = useState([]);
  const handleFilter = async () => {
    setProducts(await getSearchAndFilterProducts(filter, str));
  }
  useEffect(() => {
    handleFilter();
  }, [str])
  useEffect(() => {
    handleFilter();
  }, [filter]);
  return (
    <section className="pb-6">
      <PageTitle title={t("page-title.shop")} subtitle={t("page-title.shop-sub")} />
      <div className="flex w-full sm:py-16 py-6 bg-white justify-center">
        <div className="w-full h-fit max-w-screen-2xl flex flex-row">
          <div className={`lg:w-1/5 ml-10 lg:block ${filterBarOpen ? "block w-full fixed overflow-auto h-screen top-0 z-50 bg-white" : "hidden"}`}>
            <ProductsFilter filter={filter} setFilter={setFilter} />
          </div>
          <div className="lg:w-4/5 w-full mr-10 md:pl-6 pl-2 max-2xl:pr-2 relative">
            <ProductsData products={products} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;
