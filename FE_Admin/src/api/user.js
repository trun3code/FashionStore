/* eslint-disable no-unused-vars */
import axios from "axios";

const userUrl = "http://localhost:8080";

const userAPI = axios.create({
    baseURL: userUrl + '/api/v1/user',
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'true',
    },
});

// get user id 
export const getUserId = () => {
    const user = sessionStorage.getItem("fashion_admin");
    if (user == null || user == "") {
        // window.location.href = "/";
        return;
    }
    return JSON.parse(sessionStorage.getItem("fashion_admin")).id;
}

// get user name
export const getUserName = () => {
    const user = sessionStorage.getItem("fashion_admin");
    if (user == null || user == "") {
        // window.location.href = "/";
        return;
    }
    return JSON.parse(sessionStorage.getItem("fashion_admin")).name;
}

// check login
export const isLogin = () => {
    const user = sessionStorage.getItem("fashion_admin");
    return user != null;
};

// change password
export const changePassword = async (oldPass, newPass) => {
    try {
        const formData = new FormData();
        const userId = getUserId();
        formData.append("old", oldPass);
        formData.append("new", newPass);
        const response = await userAPI.put(`/${userId}/change-password`, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': 'true',
                }
            });
        return response;
    } catch (error) {
        return error?.response;
    }
}

// login
export const login = async (account) => {
    try {
        const response = await userAPI.post('/admin/login', account);
        const data = await response?.data;
        sessionStorage.setItem("fashion_admin", JSON.stringify(data));
        return response;
    } catch (error) {
        return error.response;
    }
};

// logout
export const logout = () => {
    sessionStorage.removeItem("fashion_admin");
};

// get full user info
export const getFullUserInfo = async () => {
    try {
        const userId = getUserId();
        const response = await userAPI.get('/' + userId + "/full");
        const user = await response?.data;
        return response;
    } catch (error) {
        // sessionStorage.removeItem("fashion_admin");
        return error?.response;
    }
};

// update user
export const updateUser = async (userInfo, image) => {
    try {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("data", JSON.stringify(userInfo));
        const response = await userAPI.put(`/update`, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': 'true',
                }
            });
        const data = await response?.data;
        sessionStorage.setItem("fashion_admin", JSON.stringify(data));
        return response;
    } catch (error) {
        return error?.response;
    }
}

//////////////////////////////////////////////////////////

// get image path
export const getImage = (imgName) => {
    if (!imgName) return null;
    return userUrl + "/api/v1/user/image/" + imgName;
}

// get full
export const getFullUser = async () => {
    try {
        const response = await userAPI.get('/full');
        return await response?.data;
    } catch (error) {
        return error?.response;
    }
}
// delete
export const removeUser = async (userId) => {
    try {
        const response = await userAPI.delete('/delete/' + userId);
        return await response?.data;
    } catch (error) {
        return error?.response;
    }
}
// search
export const searchUser = async (str) => {
    try {
        if (str.trim() == "") return getFullUser();
        const response = await userAPI.get('/search/' + str);
        return await response?.data;
    } catch (error) {
        return error?.response;
    }
}