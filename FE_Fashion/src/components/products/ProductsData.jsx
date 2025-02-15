import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import noProducts from "../../assets/no-products.jpg"
import ProductCard from "../product_detail/ProductCard";

const ProductData = ({ products }) => {
  const { t } = useTranslation("global");
  const [sortedProducts, setSortedProducts] = useState([]);
  const handleSort = (key) => {
    switch (key) {
      case "a-z":
        setSortedProducts([...sortedProducts.sort((a, b) => a.price - b.price)]);
        break;
      case "z-a":
        setSortedProducts([...sortedProducts.sort((a, b) => b.price - a.price)]);
        break;
      case "inc-price":
        setSortedProducts([...sortedProducts.sort((a, b) => a.price * (100 - a.sale) / 100 - b.price * (100 - b.sale) / 100)]);
        break;
      case "dec-price":
        setSortedProducts([...sortedProducts.sort((a, b) => b.price * (100 - b.sale) / 100 - a.price * (100 - a.sale) / 100)]);
        break;
      case "inc-star":
        setSortedProducts([...sortedProducts.sort((a, b) => a.rating - b.rating)]);
        break;
      case "dec-star":
        setSortedProducts([...sortedProducts.sort((a, b) => b.rating - a.rating)]);
        break;
      default:
        setSortedProducts([...products]);
        break;
    }
  }
  useEffect(() => {
    setSortedProducts(products);
  }, [products])
  return (
    <section className="w-full h-fit">
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center pb-4">
        <div className="flex flex-row items-center sm:text-2xl sm:mt-0 mt-2">
          <span className="sm:block hidden">{t("products.sort.title")}</span>
          <select name="sort" className="border-2 px-4 sm:ml-2 ml-0 py-1 font-medium" onChange={(e) => handleSort(e.target.value)}>
            <option value="default">{t("products.sort.default")}</option>
            <option value="a-z">{t("products.sort.az")}</option>
            <option value="z-a">{t("products.sort.za")}</option>
            <option value="inc-price">{t("products.sort.incprice")}</option>
            <option value="dec-price">{t("products.sort.decprice")}</option>
            <option value="inc-star">{t("products.sort.incstar")}</option>
            <option value="dec-star">{t("products.sort.decstar")}</option>
          </select>
        </div>
      </div>
      <div className="w-full h-full" id="product-list-container">
        {sortedProducts?.length
          ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 lg:gap-6 gap-4">
            {sortedProducts?.map((item, index) => (
              <ProductCard key={index} product={item} />
            ))}
          </div>
          : <div className="w-full flex flex-col justify-center sm:min-h-[20rem] items-center">
            <img className="max-w-[20rem] max-h-[10rem]" src={noProducts} alt="" />
            <p className="sm:text-2xl text-sm font-medium text-center text-[rgb(62,24,0)]">{t("no-products")}</p>
          </div>
        }
      </div>
    </section>
  );
};

export default ProductData;
