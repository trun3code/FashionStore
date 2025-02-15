import axios from "axios";

const mapUrl = "https://rsapi.goong.io";
const accessToken = "THir1a55hPI9O5aETvAYl9gT7AdIZWOVVvqxhUtz";

const mapAPI = axios.create({
    baseURL: mapUrl,
})

export const geoCoding = async (address) => {
    try {
        const response = await mapAPI.get(`/geocode?address=${address}&api_key=${accessToken}`);
        return response?.data?.results[0]?.geometry?.location;
    } catch (error) {
        return error?.response;
    }
}
export const searchPlace = async (keyword) => {
    try {
        const response = await mapAPI.get(`/Place/AutoComplete?api_key=${accessToken}&input=${keyword}&limit=5`);
        return response?.data?.predictions;
    } catch (error) {
        return error?.response;
    }
}
export const getPlace = async (place_id) => {
    try {
        const response = await mapAPI.get(`/Place/Detail?place_id=${place_id}&api_key=${accessToken}`);
        return response?.data?.result;
    } catch (error) {
        return error?.response;
    }
}
export const createTrip = async (origin, waypoints, destination) => {
    try {
        const response = await mapAPI.get(`/trip?origin=${origin}&waypoints=${waypoints}&destination=${destination}&api_key=${accessToken}`);
        return response?.data;
    } catch (error) {
        return error?.response;
    }
}