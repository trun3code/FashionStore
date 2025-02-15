import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapOrderList from './MapOrderList';
import MapRouteList from './MapRouteList';

const MapDetail = ({ orders, routes, mapData, setMapData, forceUpdate }) => {
    const navigate = useNavigate();
    const [tab, setTab] = useState(0);
    useEffect(() => {
        forceUpdate();
    }, [tab])
    return (
        <div className="h-full absolute left-12">
            <div className='w-[27.5rem] h-[90%] bg-white p-6 space-y-2 absolute left-6 top-6 z-20 rounded-2xl shadow-lg'>
                <nav className='flex flex-row justify-between border-b'>
                    <h1 className={`text-lg pb-2 ${!tab ? "font-semibold border-b-4 border-b-blue-600" : "opacity-30 cursor-pointer border-b-0"}`}
                        onClick={() => { setTab(0) }}>
                        Danh sách vận đơn
                    </h1>
                    <h1 className={`text-lg pb-2 ${tab ? "font-semibold border-b-4 border-b-blue-600" : "opacity-30 cursor-pointer border-b-0"}`}
                        onClick={() => { setTab(1) }}>
                        Danh sách lộ trình
                    </h1>
                </nav>
                {tab ? <MapRouteList forceUpdate={forceUpdate} routes={routes} /> : <MapOrderList forceUpdate={forceUpdate} orders={orders} mapData={mapData} setMapData={setMapData} />}
                <button className='border py-2 m-0 rounded-full bg-[rgba(24,119,242,0.3)] text-[rgb(24,119,242)] font-medium w-full' onClick={() => navigate('/order')}>
                    Quản lý đơn hàng
                </button>
            </div>
        </div>
    );
};

export default MapDetail;
