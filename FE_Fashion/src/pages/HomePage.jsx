import { useEffect, useState } from "react";
import { getHotProducts } from "../api/product";
import HomeBanner from "../components/home/HomeBanner";
import HomeProduct from "../components/home/HomeProduct";
import HomeHotProduct from "../components/home/HomeHotProduct";
import HomeFollow from "../components/home/HomeFollow";

const HomePage = () => {
    const [products, setProducts] = useState([]);
    async function fetchData() {
        setProducts(await getHotProducts());
    }
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div>
            <HomeBanner />
            <HomeProduct />
            <HomeHotProduct products={products} />
            <HomeFollow />
        </div>
    )
};

export default HomePage;