export type equitCodeResponseData = ApiResponseData<[string, String]>

export type EntryResponseData = ApiResponseData<
  [
    // string, // FBillNo
    // string, // FMONumber
    // string, // FEquipmentNo
    // string, // FOperNumber
    // string, // KHJC
    // string, // BM
    // string, // XSY
    // string, // FProductId
    // string, // FProductName
    // string, // YXMF
    // string, // HH
    // string, // HXMS
    // number, // Qty
    // string, // QualiQty
    // string, // processqty
    // string, // picBase64
    // string, // HJ
    // string, // Fid
    // string // FDetailID
  ]
>

export type UserInfoResponseData = ApiResponseData<{ username: string; roles: string[] }>

export type ResponseData = ApiResponseData<string>

export interface OperStatusData {
  operationNumber: string
  operPkId: string
  operDetailId: string
}
