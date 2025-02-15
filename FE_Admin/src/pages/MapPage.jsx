import { useEffect, useState,useReducer } from "react";
import { FaInfo } from "react-icons/fa";
import { getAllOrders, getAllRoute } from "../api/order";
import GMap from "../components/map/GMap";
import MapDetail from "../components/map/MapDetail";

const MapPage = () => {
    const [_, forceUpdate] = useReducer((x) => x + 1, 0);
    const [orders, setOrders] = useState([]);
    const [routes, setRoutes] = useState({});
    const [mapInfo, setMapInfo] = useState(true);
    const [mapData, setMapData] = useState({
        origin: {
            name: "96A Đường Trần Phú, P. Mộ Lao, Hà Đông, Hà Nội",
            latitude: 20.98096369429951,
            longitude: 105.78740777837187
        },
        destination: {
            name: "122 Hoàng Quốc Việt, Cổ Nhuế, Cầu Giấy, Hà Nội, Việt Nam",
            latitude: 21.046702490203437,
            longitude: 105.79223242426004 
        },
        lines: [],
        geocodingResults: [],
    });
    const fetchData = async () => {
        const orders = await getAllOrders();
        setOrders(orders.filter(order => order.status == "pending").map((order, index) => ({
            ...order,
            index: index,
            checked: false
        })));
        const routes = await getAllRoute();
        setRoutes(routes);
    }
    useEffect(() => {
        fetchData();
    }, [_]);
    return (
        <div className="w-screen h-screen">
            <div className="z-10 fixed ml-10 mt-20">
                <FaInfo className="text-[#637381] w-[20px] h-[20px] cursor-pointer" onClick={() => setMapInfo(!mapInfo)} />
            </div>
            {mapInfo && <MapDetail forceUpdate={forceUpdate} orders={orders} routes={routes} mapData={mapData} setMapData={setMapData} />}
            <GMap mapData={mapData} />
        </div>
    )
}

export default MapPage;
