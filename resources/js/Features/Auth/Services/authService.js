import axios from "axios";

export const authService = {
    // 注册
    register: (data) => {
        return axios.post(route("register"), data);
    },

    // 登录
    login: (credentials) => {
        return axios.post(route("login"), credentials);
    },

    // 登出
    logout: () => {
        return axios.post(route("logout"));
    },

    // 重发验证邮件
    resendVerification: (email) => {
        return axios.post(route("custom.verification.send"), {
            user_email: email,
        });
    },

    // 获取用户资料
    getProfile: () => {
        return axios.get(route("profile"));
    },
};
