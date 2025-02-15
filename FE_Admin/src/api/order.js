import axios from "axios";

const orderUrl = "http://localhost:8080";

const orderAPI = axios.create({
    baseURL: orderUrl + '/api/v1/order',
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'true',
    },
});

// get all order
export const getAllOrders = async () => {
    try {
        const response = await orderAPI.get('');
        return await response?.data;
    } catch (error) {
        return error?.response;
    }
};
// update status order
export const updateOrderStatus = async (orderStatus) => {
    try {
        const response = await orderAPI.put('/update', orderStatus);
        return await response?.data;
    } catch (error) {
        return error?.response;
    }
}

// search
export const searchOrder = async (str) => {
    try {
        if (str.trim() == "") return getAllOrders();
        const response = await orderAPI.get('/search/' + str);
        return await response?.data;
    } catch (error) {
        return error?.response;
    }
}
//get all route
export const getAllRoute = async () => {
    try {
        const response = await orderAPI.get('/route');
        return await response?.data;
    } catch (error) {
        return error?.response;
    }
};
// get route
export const getRoute = async (routeId) => {
    try {
        const response = await orderAPI.get(`/route/${routeId}`);
        return response?.data;
    } catch (error) {
        return error?.response;
    }
}
//create route
export const createRoute = async (route) => {
    try {
        const response = await orderAPI.post(`/route/new`, route);
        return response?.data;
    } catch (error) {
        return error?.response;
    }
}
// delivered route
export const completeRoute = async (routeId) => {
    try {
        const response = await orderAPI.get(`/route/update/` + routeId);
        return response?.data;
    } catch (error) {
        return error?.response;
    }
}
// delete route
export const removeRoute = async (routeId) => {
    try {
        const response = await orderAPI.delete(`/route/delete/${routeId}`);
        return response?.data;
    } catch (error) {
        return error?.response;
    }
}