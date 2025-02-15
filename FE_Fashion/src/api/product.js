import axios from "axios";
import { getUserId } from "./user";

const productUrl = "http://localhost:8080";

const productAPI = axios.create({
    baseURL: productUrl + '/api/v1',
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'true',
    }
});
export const getImage = (imageName) => {
    return imageName ? productUrl + "/api/v1/product/image/" + imageName : "";
}
//get all
export const getAllProducts = async () => {
    try {
        const response = await productAPI.get('/product');
        return await response?.data;
    } catch (error) {
        return error?.response;
    }
};

// filter 
export const getSearchAndFilterProducts = async (filter, str) => {
    try {
        var path = "/product" + (str ? ('/search/' + str) : '/filter');
        if (Object.keys(filter).length) {
            const filterJson = new URLSearchParams(filter).toString();
            path += '?' + filterJson;
        }
        const response = await productAPI.get(path);
        return response?.data;
    } catch (error) {
        return error?.response;
    }
}
// related 
export const getRelatedProduct = async (productId, userId) => {
    try {
        var url = `/product/related?product_id=${productId}`
        if (userId) url += `&user_id=${userId}`
        const response = await productAPI.get(url);
        return response?.data;
    } catch (error) {
        return error?.response;
    }
}
// hot product
export const getHotProducts = async () => {
    try {
        const response = await productAPI.get(`/product/hot`);
        return response?.data;
    } catch (error) {
        return error?.response;
    }
}
// recommend ?
export const getRecommendProducts = async (productId) => {
    try {
        const response = await productAPI.get(`/product/recommend/${productId}`);
        return response?.data;
    } catch (error) {
        return error?.response;
    }
}
// get product
export const getProduct = async (productId) => {
    try {
        const response = await productAPI.get(`/product/${productId}`);
        return response?.data;
    } catch (error) {
        return error?.response;
    }
}

// get review
export const getReviews = async (productId) => {
    try {
        const response = await productAPI.get(`/product/review/${productId}`);
        return response?.data;
    } catch (error) {
        return error?.response;
    }
}
// check review
export const getUserReview = async (productId) => {
    try {
        const response = await productAPI.get("/product/review/" + productId + "/user/" + getUserId());
        return response?.data;
    }
    catch (error) {
        return error?.response;
    }
}

// create review
export const createReview = async (payload) => {
    try {
        const response = await productAPI.post(`/product/review/new`, payload)
        return response?.data;
    } catch (error) {
        return error?.response;
    }
}
// cart
export const getProductItem = async (cartId) => {
    try {
        const response = await productAPI.get('/product/item/' + cartId)
        return response?.data;
    } catch (error) {
        return error?.response;
    }
}