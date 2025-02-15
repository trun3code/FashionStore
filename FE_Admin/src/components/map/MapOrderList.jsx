import * as Polyline from "@mapbox/polyline";
import React, { useState, memo } from 'react';
import { createTrip, geoCoding } from "../../api/map";
import { createRoute } from "../../api/order";
import img from "../../assets/delivery.jpg";

const MapOrderInfo = ({ order, onCheckboxChange }) => {
    const handleCheckedOrder = () => {
        order.checked = !order.checked;
        onCheckboxChange(order);
    }
    return (
        <div className='flex flex-row items-center space-x-2'>
            {onCheckboxChange != null &&
                <input type="checkbox" className='accent-[rgb(255,86,48)]'
                    defaultChecked={order?.checked}
                    onChange={handleCheckedOrder} />
            }
            <div className='text-sm'>
                <p>Đơn hàng của:<span className='font-bold text-[16px]'> {order?.user} - {order.phoneNumber}</span></p>
                <p className='text-[12px]'>{order?.shippingAddress?.name}</p>
            </div>
        </div>
    )
}

const MapOrderList = ({ orders, mapData, setMapData, forceUpdate }) => {
    const [selectedOrder, setSelectedOrder] = useState([]);
    const [trip, setTrip] = useState(null);
    const [isCapital, setIsCapital] = useState(true);
    const handleCheckboxChange = async order => {
        if (order.checked) {
            selectedOrder.push(order);
            mapData?.geocodingResults.push({ ...await geoCoding(order?.shippingAddress?.name), index: order.index });
        }
        else {
            setSelectedOrder(selectedOrder.filter(o => o.index !== order.index));
            mapData = { ...mapData, geocodingResults: mapData?.geocodingResults?.filter(o => o.index !== order.index) }
        }
        if (mapData?.geocodingResults?.length > 0) {
            const waypoints = mapData?.geocodingResults.map(coord => coord ? `${coord?.lat}, ${coord?.lng}` : '').join(';');
            const source = `${mapData?.origin?.latitude},${mapData?.origin?.longitude}`;
            const sink = `${mapData?.destination?.latitude},${mapData?.destination?.longitude}`;
            var response = await createTrip(source, waypoints, sink);
            setTrip(response);
            if (response && response.trips && response.trips.length > 0) {
                const polyline = response.trips[0].geometry;
                let decoded = Polyline.decode(polyline);
                const endPoint = [mapData?.destination.latitude, mapData?.destination.longitude];
                const epsilon = 0.0003;
                const findIndex = decoded.findIndex(point => Math.abs(point[0] - endPoint[0]) < epsilon && Math.abs(point[1] - endPoint[1]) < epsilon);
                if (findIndex != -1) {
                    decoded = decoded.slice(0, findIndex);
                }
                mapData = { ...mapData, lines: decoded };
            }
        }
        else {
            setTrip(null);
            mapData = { ...mapData, lines: [] };
        }
        setMapData(mapData);
    }
    const handleRoute = async () => {
        if (selectedOrder.length == 0) return;
        const orderIdList = [];
        for(let i=1;i<trip?.waypoints.length-1;i++){
            // console.log(selectedOrder[trip.waypoints[i].waypoint_index-1]?.id,trip.waypoints[i].waypoint_index)
            const o = selectedOrder[selectedOrder.length - trip.waypoints[i].waypoint_index];
            // console.log(trip.waypoints[i].waypoint_index-1)
            orderIdList.push({id: o?.id,routeIndex:i-1});
        }
        // console.log(orderIdList);
        // return
        const routeData = {
            start: mapData?.origin.name,
            end: mapData?.destination.name,
            orders: orderIdList
        };
        await createRoute(routeData);
        mapData = { ...mapData, lines: [], geocodingResults: [] };
        selectedOrder.length = 0;
        trip.length = 0;
        setMapData(mapData);
        forceUpdate();
    }
    const calculateDistance = () => {
        if (trip && trip.trips[0] && trip.trips[0].legs && trip.trips[0].distance) {
            const legs = trip?.trips[0]?.legs;
            const allDistance = trip?.trips[0]?.distance;
            return ((allDistance - legs[legs?.length - 1]?.distance) / 1000).toFixed(2);
        }
        return 0;
    }
    return (
        orders?.length
            ? <div className='flex flex-col space-y-2 h-[85%]'>
                <div className='flex flex-row items-center justify-between'>
                    <p className='w-fit border px-4 py-2 text-sm rounded-lg font-medium bg-[rgba(255,86,48,0.2)] text-[rgb(255,86,48)]'>
                        Số đơn hàng chờ vận chuyển
                        ({orders?.length})
                    </p>
                    {trip &&
                        <button className='text-sm font-medium py-2 px-3 rounded-lg bg-[rgba(24,119,242,0.3)] text-[rgb(24,119,242)]' onClick={handleRoute}>
                            Lưu lộ trình
                        </button>
                    }
                    {trip && trip?.trips?.length > 0 && trip?.waypoints &&
                        <div className='absolute flex flex-col  space-y-2 -right-[18rem] -top-[1rem] bg-white z-50 py-2 px-6 rounded-2xl text-sm text-black shadow-lg'>
                            Khoảng cách dự kiến: {"  "}
                            <p className='font-bold m-auto'>{calculateDistance()} km</p>
                        </div>
                    }
                </div>
                <div className="flex flex-row justify-between">
                    <div className={`${isCapital ? "" : "opacity-50"} font-bold cursor-pointer border border-2 p-1 rounded-md bg-[rgba(255,86,48,0.2)]`}
                        onClick={() => setIsCapital(true)}>
                        Tp Hà Nội
                    </div>
                    <div className={`${isCapital ? "opacity-50" : ""} font-bold cursor-pointer border border-2 p-1 rounded-md bg-[rgba(24,119,242,0.3)]`}
                        onClick={() => setIsCapital(false)}>
                        Tỉnh/Tp khác
                    </div>
                </div>
                {isCapital
                    ? <div className='flex flex-col space-y-2 overflow-y-auto divide-y-2 divide-dashed'>
                        <div className='flex flex-row items-center space-x-1'>
                            <div className='text-sm'>
                                <p className='font-bold'>Điểm bắt đầu hành trình</p>
                                <p className='text-[12px]'>{mapData?.origin?.name}</p>
                            </div>
                        </div>
                        {orders.filter(o => o?.shippingAddress?.city == "Thành phố Hà Nội").map((order) =>
                            <MapOrderInfo
                                key={order.id}
                                order={order}
                                onCheckboxChange={handleCheckboxChange}
                            />
                        )}
                        <div className='flex flex-row items-center space-x-2'>
                            <div className='text-sm'>
                                <p className='font-bold'>Điểm kết thúc hành trình</p>
                                <p className='text-[12px]'>{mapData?.destination?.name}</p>
                            </div>
                        </div>
                    </div>
                    : <div className='flex flex-col space-y-2 overflow-y-auto divide-y-2 divide-dashed'>
                        <div></div>
                        {orders.filter(o => o?.shippingAddress?.city != "Thành phố Hà Nội").map((order) => (
                            <MapOrderInfo
                                key={order.id}
                                order={order}
                            />
                        ))}
                        <div></div>
                    </div>
                }
            </div>
            : <div className='h-[80%] space-y-4 w-full flex flex-col justify-center items-center'>
                <img src={img} className='w-full h-auto' />
                <p className='font-semibold'>Hiện chưa có đơn hàng nào để vận chuyển</p>
            </div>
    );
}
export default memo(MapOrderList);