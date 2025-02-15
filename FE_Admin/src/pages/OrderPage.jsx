import { useEffect, useState } from "react";
import { getAllOrders, searchOrder } from "../api/order";
import ListOrder from "../components/orders/ListOrder";
import FilterOrders from "../components/orders/FilterOrders";
import SearchBar from "../layouts/SearchBar";

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            setOrders(await getAllOrders());
        }
        fetchData();
    }, []);
    return (
        <>
            <SearchBar getData={searchOrder} setData={setOrders} />
            <div className="max-w-screen-xl w-full space-y-8 m-auto">
                <p className="text-center font-bold text-2xl">Danh sách đơn hàng</p>
                <div>
                    <FilterOrders orders={orders} setOrders={setOrders} />
                    <ListOrder orders={orders} />
                </div>
            </div>
        </>
    )
}

export default OrderPage;