import axios from "axios";

const locationUrl = `https://vapi.vnappmob.com`

const locationAPI = axios.create({
    baseURL: locationUrl + "/api/v2/province",
    withCredentials: false,
    headers: {
        'Content-Type' : 'application/json',
        'Access-Control-Allow-Origin' : 'true',
    }
})

export const apiGetCity = async () => {
    try{
        const response = await locationAPI.get('/');
        return response?.data.results;
    }
    catch(error){
        return error;
    }
}

export const apiGetDistrict = async (cityId) => {
    try{
        const response = await locationAPI.get('/district/'+cityId);
        return response?.data.results;
    }
    catch(error){
        return error;
    }
}

export const apiGetWards = async (districtId) => {
    try{
        const response = await locationAPI.get('/ward/'+districtId);
        return response?.data.results;
    }
    catch(error){
        return error;
    }
}

