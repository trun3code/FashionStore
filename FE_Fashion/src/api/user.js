import axios from "axios";

const userUrl = "http://localhost:8080";

const userAPI = axios.create({
    baseURL: userUrl + "/api/v1",
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'true',
    }
});

export const getAvatar = (imageName) => {
    return imageName ? userUrl + "/api/v1/user/image/" + imageName : "";
}

// check login
export const isLogin = () => {
    const user = sessionStorage.getItem("fashion_user");
    return user !== null && user !== "";
};

// get user id 
export const getUserId = () => {
    const user = sessionStorage.getItem("fashion_user");
    if (user == null || user == "") {
        // window.location.href = "/";
        return;
    }
    return JSON.parse(sessionStorage.getItem("fashion_user")).id;
}

// check available email 
export const isAvailableEmail = async (email) => {
    try {
        const formData = new FormData();
        formData.append("data", email);
        return await userAPI.post('/user/valid-email', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': 'true',
            }
        });
    } catch (error) {
        return error.response;
    }
};

// login
export const login = async (account) => {
    try {
        const response = await userAPI.post('/user/login', account,);
        const data = await response?.data;
        sessionStorage.setItem("fashion_user", JSON.stringify(data));
        localStorage.clear();
        return response;
    } catch (error) {
        return error.response;
    }
};

// logout
export const logout = () => {
    sessionStorage.removeItem("fashion_user");
};

// signup
export const signup = async (userInfo, image) => {
    try {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("data", JSON.stringify(userInfo));
        const response = await userAPI.post(`/user/signup`, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': 'true',
                }
            });
        const data = await response?.data;
        sessionStorage.setItem("fashion_user", JSON.stringify(data));
        return response;
    } catch (error) {
        return error?.response;
    }
}

//get user
export const getUser=async()=>{
    try {
        const userId = getUserId();
        const response = await userAPI.get('/user/' + userId);
        return await response?.data;
    } catch (error) {
        return error?.response;
    }
}

// get full user info
export const getFullUserInfo = async () => {
    try {
        const userId = getUserId();
        const response = await userAPI.get('/user/' + userId+"/full");
        return response;
    } catch (error) {
        sessionStorage.removeItem("fashion_user");
        return error?.response;
    }
};
// update user
export const updateUser = async (userInfo, image) => {
    try {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("data", JSON.stringify(userInfo));
        const response = await userAPI.put(`/user/update`, formData,
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
// change password
export const changePassword = async (oldPass, newPass) => {
    try {
        const formData = new FormData();
        const userId = getUserId();
        formData.append("old", oldPass);
        formData.append("new", newPass);
        const response = await userAPI.put(`/user/${userId}/change-password`, formData,
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
// update address
export const updateAddress =  async (address) => {
    try {
        const userId = getUserId();
        const response = await userAPI.put(`/user/${userId}/address/update`,address);
        return response;
    } catch (error) {
        return error?.response;
    }
}