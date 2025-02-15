import React, { useState } from 'react';
import ReactMapGL, { Marker, Layer, Source } from 'react-map-gl';
import markerImg from "../../assets/marker.png";
import marker1Img from "../../assets/marker1.png";
import marker2Img from "../../assets/marker2.png";


const GMap = ({ mapData }) => {
    const [viewport, setViewport] = useState({
        longitude: mapData?.origin?.longitude,
        latitude: mapData?.origin?.latitude,
        zoom: 12.5,
    });
    return (
        <ReactMapGL
            {...viewport}
            onMove={e => setViewport(e.viewport)}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken='pk.eyJ1IjoibWF5bmd1eWVuMjQiLCJhIjoiY2xoNXcyYnB6MDA1NTNncXFnNXgxdTdsbyJ9.M6VAhpbrSaGNSgK87CM2rg'>
            <Marker latitude={mapData?.origin?.latitude} longitude={mapData?.origin?.longitude} >
                <img src={markerImg} className='w-[1.5rem] h-[2.25rem]' />
                <div className='font-black w-full -mt-2 z-20 text-lg text-center'>S</div>
            </Marker>
            {mapData?.geocodingResults?.map((route, index) => (
                <Marker key={index} latitude={route?.lat} longitude={route?.lng} >
                    <img src={marker1Img} className='w-[1rem] h-[1.5rem]' />
                    <div className='font-black w-full -mt-2 z-20 text-lg text-center'></div>
                </Marker>
            ))}
            {mapData?.lines?.length > 0 && (
                <Source id="route" type="geojson" data={{
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "LineString",
                        coordinates: mapData?.lines.map(coord => [coord[1], coord[0]])
                    }
                }}>
                    <Layer
                        id="route"
                        type="line"
                        source="route"
                        layout={{ "line-join": "round", "line-cap": "round" }}
                        paint={{ "line-color": "#1771d8", "line-width": 6 }}
                    />
                </Source>
            )}
            <Marker latitude={mapData?.destination?.latitude} longitude={mapData?.destination?.longitude}>
                <img src={marker2Img} className='w-[1.5rem] h-[2.25rem]' />
                <div className='font-black w-full -mt-2 z-20 text-lg text-center'>E</div>
            </Marker>
        </ReactMapGL>
    );
}

export default GMap;