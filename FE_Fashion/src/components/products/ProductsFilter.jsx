import "react-range-slider-input/dist/style.css";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../utils/format";
import RangeSlider from "react-range-slider-input";

const OptionsFilter = ({ filter, item, type, onChange }) => {
  return (
    <li className="flex items-center mt-2">
      <input type="radio" name={type} className="mr-2 w-[1rem] h-[1rem] border-[rgb(245,245,245)] accent-[rgb(62,24,0)]"
        checked={filter[type] == item?.value}
        onChange={() => onChange(type, item?.value)} />
      <label className="lg:text-xl opacity-50 font-bold">{item?.name}</label>
    </li>
  );
};

const ProductsFilter = ({ filter, setFilter }) => {
  const { t } = useTranslation("global");
  const priceFilter = [0, 20000000];
  const gender = [
    {
      name: t("products.filter.gender.male"),
      value: "male",
    },
    {
      name: t("products.filter.gender.female"),
      value: "female",
    },
    {
      name: t("products.filter.gender.kid"),
      value: "kid",
    },
  ];
  const category = [
    {
      name: t("products.filter.category.shoes"),
      value: "shoes",
    },
    {
      name: t("products.filter.category.clothes"),
      value: "clothes",
    },
    {
      name: t("products.filter.category.accessories"),
      value: "accessories",
    },
  ];
  const brands = [
    {
      name: "Nike",
      value: "nike",
    },
    {
      name: "Adidas",
      value: "adidas",
    },
    // {
    //   name: "Puma",
    //   value: "puma",
    // },
    // {
    //   name: "Jordan",
    //   value: "jordan",
    // },
    // {
    //   name: "New Balance",
    //   value: "new balance",
    // },
    // {
    //   name: t("products.filter.category.other"),
    //   value: "other",
    // },
  ];
  const handleFilter = (type, value) => {
    filter[type] = value;
    setFilter({ ...filter });
  }
  return (
    <section className="2xl:pl-0 pl-2 lg:pr-0 pr-2 lg:overflow-y-hidden overflow-y-auto lg:static relative">
      <h2 className="lg:text-3xl text-xl font-semibold lg:pb-4 lg:pt-0 pb-2 pt-2 border-b-[rgb(230,230,230)] border-b-2">
        {t("products.filter.title")}
      </h2>
      <p className="sm:text-2xl text-[rgb(62,24,0)] underline  sm:static absolute top-0 right-0 font-medium cursor-pointer min-w-[120px] text-start"
        onClick={() => setFilter({})}>
        {t("products.clear")}
      </p>
      {/* Gender */}
      <section className="py-4 border-b-[rgb(230,230,230)] border-b-2">
        <h2 className="lg:text-3xl text-lg font-medium">
          {t("products.filter.gender.title")}
        </h2>
        <ul className="list-none mt-2 max-h-[14rem] overflow-y-auto overflow-x-hidden whitespace-nowrap scrollbar" >
          {gender.map((item, index) => (<OptionsFilter filter={filter} key={index} item={item} type="gender" onChange={handleFilter} />))}
        </ul>
      </section>
      {/* Category */}
      <section className="py-4 border-b-[rgb(230,230,230)] border-b-2">
        <h2 className="lg:text-3xl text-lg font-medium">
          {t("products.filter.category.title")}
        </h2>
        <ul className="list-none mt-2 max-h-[14rem] overflow-y-auto overflow-x-hidden whitespace-nowrap scrollbar">
          {category.map((item, index) => (<OptionsFilter filter={filter} key={index} item={item} type="category" onChange={handleFilter} />))}
        </ul>
      </section>
      {/* Brand  */}
      <section className="py-4 border-b-[rgb(230,230,230)] border-b-2">
        <h2 className="lg:text-3xl text-lg font-medium">{t("products.filter.brand")}</h2>
        <ul className="list-none mt-2 max-h-[14rem] overflow-y-auto overflow-x-hidden whitespace-nowrap scrollbar">
          {brands.map((item, index) => (<OptionsFilter filter={filter} key={index} item={item} type="brand" onChange={handleFilter} />))}
        </ul>
      </section>
      {/* Price  */}
      <section className="pt-4 pb-6 border-b-[rgb(230,230,230)] border-b-2">
        <h2 className="lg:text-3xl text-lg font-medium mb-4">
          {t("products.filter.price")}
        </h2>
        <span className="lg:text-xl font-bold opacity-50">
          {formatPrice(filter?.price ? filter.price[0] : priceFilter[0])} - {formatPrice(filter?.price ? filter.price[1] : priceFilter[1])}
        </span>
        <RangeSlider className="mt-4 text-[rgb(223,176,42)]"
          min={priceFilter[0]}
          max={priceFilter[1]}
          step={1000000}
          onInput={(value) => { priceFilter[0] = value[0]; priceFilter[1] = value[1] }}
          onThumbDragEnd={() => { handleFilter("price", priceFilter) }}
          onRangeDragEnd={() => { handleFilter("price", priceFilter) }}
          defaultValue={priceFilter} />
      </section>
    </section>
  );
};
export default ProductsFilter;
