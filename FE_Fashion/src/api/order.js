import axios from "axios";

const orderUrl = "http://localhost:8080";

const orderAPI = axios.create({
    baseURL: orderUrl + '/api/v1',
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'true',
    }
});

// create
export const createOrder = async (order) => {
    try {
        const response = await orderAPI.post(`/order/new`, order);
        return response?.data;
    } catch (error) {
        return error?.response;
    }
}
// delete
export const cancelOrder = async (orderId) => {
    try {
        const response = await orderAPI.delete(`/order/cancel/${orderId}`);
        return response;
    } catch (error) {
        return error?.response;
    }

}

// get by user id
export const getOrders = async (userId) => {
    try {
        const response = await orderAPI.get(`/order/user/` + userId);
        return response?.data;
    } catch (error) {
        return error?.response;
    }
}

// check buy
export const checkBuyProduct = async (userId, productId) => {
    try {
        const response = await orderAPI.get(`/order/user/` + userId + "/check-buy/" + productId);
        return  response?.status==200;
    } catch (error) {
        return false;
    }
}
