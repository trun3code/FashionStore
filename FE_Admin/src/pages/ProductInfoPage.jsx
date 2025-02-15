import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import { getProduct, updateProduct, createProduct } from '../api/product';
import EditProductItems from '../components/product_detail/EditProductItems';
import EditProduct from "../components/product_detail/EditProduct";

const ProductInfoPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [productItems, setProductItems] = useState([]);
    async function fetchData() {
        setProduct(await getProduct(id));
    }
    useEffect(() => {
        if (id > 0) fetchData();
        else setProduct({
            productName: "",
            price: 0,
            description: "",
            sale: 0,
            productImage: "",
            category: {
                gender: "female",
                brand: "nike",
                category: "shoes",
            },
            items: [],
        })
    }, []);
    useEffect(() => {
        if(!product) navigate("/404")
        setProductItems(product?.items || []);
    }, [product]);
    return (
        <div className="max-w-screen-lg w-full space-y-8 mt-[5rem] mx-auto">
            <p className="text-center font-bold text-2xl relative">
                <IoArrowBackOutline className='absolute cursor-pointer left-12 top-2' onClick={() => navigate(-1)} />
                Sản phẩm
            </p>
            <EditProduct product={product} setProduct={setProduct}/>
            { id > 0 && <EditProductItems productItems={productItems} />}
        </div>
    );
}

export default ProductInfoPage;