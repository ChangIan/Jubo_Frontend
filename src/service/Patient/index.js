/**
 * 封裝
 * Layer - Service
 * 患者
 */

import { RequestGetAsync } from "../../util/requestAsync";

// 取得患者清單
const PatientGetAsync = async () => {
    const { ErrorCode, ErrorMessage, Data } =
        await RequestGetAsync(
            `/v1/patient`
        );

    return { ErrorCode, ErrorMessage, Data };
};

export {
    PatientGetAsync,
};