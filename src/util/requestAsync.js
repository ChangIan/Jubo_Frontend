import axios from 'axios';

const requestProvider = axios.create({
    // url = base url + request url
    baseURL: process.env.REACT_APP_API_URL,
    // send cookies when cross-domain requests
    withCredentials: true,
    // 逾期時間
    timeout: (1000 * 60)
});

// 攔截器
requestProvider.interceptors.request.use(
    config => {
        config.headers["Content-Type"] = "application/json";

        return config;
    },
    error => {
        console.log(
            `%c
            request
            error -> ${error}
            `
            ,
            'color: red; background-color: yellow; font-size: larger'
        );

        return Promise.reject(error);
    }
);

// 攔截器
requestProvider.interceptors.response.use(
    response => {
        if (response.status === 200) {
            if (response.data.ErrorCode !== 0) {
                alert(response.data.ErrorMessage);

                return Promise.reject(response.data);
            }

            return Promise.resolve(response.data);
        }

        return Promise.reject(response.data);
    },
    error => {
        console.log(
            `%c
            response
            error -> ${error}
            `
            ,
            'color: red; background-color: yellow; font-size: larger'
        );

        return Promise.reject(error);
    }
);

// method: 'get' 
const RequestGetAsync = async (endPoint = '') => {
    return await requestProvider({
        url: endPoint,
        method: 'get',
        data: { unused: 0 }
    }).catch(async error => {
        return Promise.reject(error)
    });
};

// method: 'post' 
const RequestPostAsync = async (endPoint = '', body = {}) => {
    return await requestProvider({
        url: endPoint,
        method: 'post',
        data: body
    }).catch(async error => {
        return Promise.reject(error)
    });
};

// method: 'put' 
const RequestPutAsync = async (endPoint = '', body = {}) => {
    return await requestProvider({
        url: endPoint,
        method: 'put',
        data: body
    }).catch(async error => {
        return Promise.reject(error)
    });
};

// method: 'delete' 
const RequestDeleteAsync = async (endPoint = '') => {
    return await requestProvider({
        url: endPoint,
        method: 'delete'
    }).catch(async error => {
        return Promise.reject(error)
    });
};

export {
    RequestGetAsync,
    RequestPostAsync,
    RequestPutAsync,
    RequestDeleteAsync,
};