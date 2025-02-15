import { useState, useEffect } from "react";
import { getFullProducts, searchProduct } from "../api/product";
import FilterProducts from "../components/products/FilterProducts";
import ListProduct from "../components/products/ListProduct";
import SearchBar from "../layouts/SearchBar";

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    async function fetchData() {
        setProducts(await getFullProducts());
    }
    useEffect(() => {
        fetchData();
    }, [])
    return (
        <>
            <SearchBar setData={setProducts} getData={searchProduct} />
            <div className="max-w-screen-xl w-full space-y-8 m-auto">
                <p className=" text-center font-bold text-2xl">Danh sách sản phẩm</p>
                <div >
                    <FilterProducts products={products} setProducts={setProducts} />
                    <ListProduct products={products} setProducts={setProducts} />
                </div>
            </div>
        </>
    )
}

export default ProductsPage;