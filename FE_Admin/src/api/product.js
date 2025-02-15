import axios from "axios";

const productUrl = "http://localhost:8080";

const productAPI = axios.create({
    baseURL: productUrl + '/api/v1/product',
    withCredentials: false,
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

// get image path
export const getImage = (imgName) => {
    if (!imgName) return "";
    return productUrl + "/api/v1/product/image/" + imgName;
}

//get full
export const getFullProducts = async () => {
    try {
        const response = await productAPI.get('/full');
        return await response?.data;
    } catch (error) {
        return error?.response;
    }
};
// search
export const searchProduct = async (str) => {
    try {
        if (str.trim() == "") return getFullProducts();
        const response = await productAPI.get('/search/' + str);
        return await response?.data;
    } catch (error) {
        return error?.response;
    }
}
// get product
export const getProduct = async (productId) => {
    try {
        const response = await productAPI.get(`/${productId}`);
        return response?.data;
    } catch (error) {
        return error?.response;
    }
}
//create product
export const createProduct = async (product, image) => {
    try {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("data", JSON.stringify(product));
        const response = await productAPI.post(`/new`, formData);
        return response?.data;
    } catch (error) {
        return error?.response;
    }
}
//update product
export const updateProduct = async (product, image) => {
    try {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("data", JSON.stringify(product));
        const response = await productAPI.put(`/update`, formData);
        return response?.data;
    } catch (error) {
        return error?.response;
    }
}
// delete product
export const removeProduct = async (productId) => {
    try {
        const response = await productAPI.delete(`/delete/${productId}`);
        return response?.data;
    } catch (error) {
        return error?.response;
    }
}
//create product item
export const createProductItem = async (item, image, productId) => {
    try {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("data", JSON.stringify(item));
        const response = await productAPI.post(`/${productId}/item/new`, formData);
        return response?.data;
    } catch (error) {
        return error?.response;
    }
}
//update product item
export const updateProductItem = async (item, image, productId) => {
    try {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("data", JSON.stringify(item));
        const response = await productAPI.put(`${productId}/item/update`, formData);
        return response?.data;
    } catch (error) {
        return error?.response;
    }
}
// delete product item
export const removeProductItem = async (itemId) => {
    try {
        const response = await productAPI.delete(`/item/delete/${itemId}`);
        return response?.data;
    } catch (error) {
        return error?.response;
    }
}

// update AI
export const updateAI=async()=>{
    try {
        const response = await productAPI.get(`/update-ai`);
        return response;
    } catch (error) {
        return error?.response;
    }
}