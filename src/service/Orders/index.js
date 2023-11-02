/**
 * 封裝
 * Layer - Service
 * 醫囑
 */

import {
    RequestGetAsync,
    RequestPostAsync,
    RequestPutAsync,
    RequestDeleteAsync,
} from "../../util/requestAsync";

// 取得醫囑
const OrderGetAsync = async (patientId) => {
    const { ErrorCode, ErrorMessage, Data } =
        await RequestGetAsync(
            `/v1/orders/${patientId}`
        );

    return { ErrorCode, ErrorMessage, Data };
};

// 新增醫囑
const OrderAddAsync = async (patientId, message) => {
    const { ErrorCode, ErrorMessage, Data } =
        await RequestPostAsync(
            "/v1/orders", {
            Patient_Id: patientId,
            Message: message.trim(),
        });

    return { ErrorCode, ErrorMessage, Data };
};

// 更新醫囑
const OrderUpdateAsync = async (id, message) => {
    const { ErrorCode, ErrorMessage, Data } =
        await RequestPutAsync(
            "/v1/orders", {
            Id: id,
            Message: message.trim(),
        });

    return { ErrorCode, ErrorMessage, Data };
};

// 刪除醫囑
const OrderDeleteAsync = async (orderId) => {
    const { ErrorCode, ErrorMessage, Data } =
        await RequestDeleteAsync(
            `/v1/orders/${orderId}`
        );

    return { ErrorCode, ErrorMessage, Data };
};

export {
    OrderGetAsync,
    OrderAddAsync,
    OrderUpdateAsync,
    OrderDeleteAsync,
};