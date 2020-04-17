import request from "../utils/request"
const material = "//wechat.yunbeisoft.com/index_test.php/home"

export function fetchUptoken () {
    return request({
        method: "get",
        url: "//wxx.jutaobao.cc/token.php",
    })
}
// 获取小程序码
export function getMiniQrcode (body) {
    return request({
        method: "post",
        url: `${material}/api/getxcxjpg`,
        data: JSON.stringify(body),
    })
}
// 获取素材库
export function getMaterial (body) {
    return request({
        method: "post",
        url: `${material}/MaterialCommon/materialCommonList`,
        data: JSON.stringify(body),
    })
}

// 添加(更新)素材库
export function addMaterial (body) {
    return request({
        method: "post",
        url: `${material}/MaterialCommon/materialCommonSet`,
        data: JSON.stringify(body),
    })
}
// // 删除素材
export function delMaterial (body) {
    return request({
        method: "post",
        url: `${material}/MaterialCommon/materialCommonDelete`,
        data: JSON.stringify(body),
    })
}

// // 获取我的素材
export function getMymaterial (body) {
    return request({
        method: "post",
        url: `${material}/MaterialPrivate/materialPrivateList?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}

// // 添加我的素材
export function addMymaterial (body) {
    return request({
        method: "post",
        url: `${material}/MaterialPrivate/materialPrivateSet?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 删除我的素材
export function delMymaterial (body) {
    return request({
        method: "post",
        url: `${material}/MaterialPrivate/materialPrivateDelete`,
        data: JSON.stringify(body),
    })
}
// 分享素材
export function shareMaterial (body) {
    return request({
        method: "post",
        url: `${material}/CircleFriends/SendCircleFriends?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}

// 获取文章列表
export function fetchArticle (body) {
    return request({
        method: "post",
        url: `${material}/article/gets`,
        data: JSON.stringify(body),
    })
}
// 编辑/新增文章
export function edit (body) {
    return request({
        method: "post",
        url: `${material}/article/edit`,
        data: JSON.stringify(body),
    })
}
// 删除文章
export function del (body) {
    return request({
        method: "post",
        url: `${material}/article/dels`,
        data: JSON.stringify(body),
    })
}
// 账单
export function fetchbill (body) {
    return request({
        method: "post",
        url: `${material}/Wxpay/getPayLog`,
        data: JSON.stringify(body),
    })
}
// 删除账单
export function delPayLog (body) {
    return request({
        method: "post",
        url: `${material}/Wxpay/delPayLog`,
        data: JSON.stringify(body),
    })
}

