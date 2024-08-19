import { request } from "@/utils/service"
import type * as webapi from "./types/webapi.ts"

/** 获取登录验证码 */
export function getequitApi() {
  return request<webapi.equitCodeResponseData>({
    url: "form/getequit",
    method: "get"
  })
}

/** 分录数据 */
export function getentryApi(equit: string, ddlx: string, sccj: string, pcgx: string) {
  return request<webapi.EntryResponseData>({
    url: "form/getentry",
    method: "get",
    params: { equit, ddlx, sccj, pcgx }
  })
}

/** 获取用户详情 */
export function setOperStatusApi(info: webapi.OperStatusData) {
  return request<webapi.ResponseData>({
    url: "Oper/Status",
    method: "post",
    data: info
  })
}
