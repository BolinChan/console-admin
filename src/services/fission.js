import request from "../utils/request"

const wechat = "//wechat.yunbeisoft.com/index_test.php/home"

// 获取海报列表
export function fetchPoster (body) {
    return request({
        method: "post",
        url: `${wechat}/FissionPoster/posterList`,
        data: JSON.stringify(body),
    })
}
// 添加（编辑）海报列表
export function uptatePoster (body) {
    return request({
        method: "post",
        url: `${wechat}/FissionPoster/generalsettings`,
        data: JSON.stringify(body),
    })
}
// 删除活动海报
export function posterDelete (body) {
    return request({
        method: "post",
        url: `${wechat}/FissionPoster/posterDelete`,
        data: JSON.stringify(body),
    })
}
// 获取海报详情
export function fetchDetail (body) {
    return request({
        method: "post",
        url: `${wechat}/FissionPoster/posterDetail`,
        data: JSON.stringify(body),
    })
}
// 选择客服微信活码
export function posterQrcodeSet (body) {
    return request({
        method: "post",
        url: `${wechat}/FissionPosterQrcode/posterQrcodeSet`,
        data: JSON.stringify(body),
    })
}

// 获取海报活码列表
export function posterQrcodeList (body) {
    return request({
        method: "post",
        url: `${wechat}/FissionPosterQrcode/posterQrcodeList`,
        data: JSON.stringify(body),
    })
}
// 更新海报活动状态
export function posterStatusSet (body) {
    return request({
        method: "post",
        url: `${wechat}/FissionPoster/posterStatusSet`,
        data: JSON.stringify(body),
    })
}
// 查询任务奖品
export function getprize (body) {
    return request({
        method: "post",
        url: `${wechat}/prize/get_prize?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 添加任务奖品
export function addprize (body) {
    return request({
        method: "post",
        url: `${wechat}/prize/get_prize?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 修改任务奖品
export function editprize (body) {
    return request({
        method: "post",
        url: `${wechat}/rwprize/update_prize?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 删除奖品
export function delprize (body) {
    return request({
        method: "post",
        url: `${wechat}/prize/delete_prize?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}

export function getFissPosterCount (body) {
    return request({
        method: "post",
        url: `${wechat}/FissionPosterCount/getTotal?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 扫码统计
export function getAllSaomaList (body) {
    return request({
        method: "post",
        url: `${wechat}/FissionPosterCount/getAllSaomaList?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 扫码获取下级
export function getSharerSaoma (body) {
    return request({
        method: "post",
        url: `${wechat}/FissionPosterCount/getSharerSaoma?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 裂变--按时间段统计
export function getTimeTotal (body) {
    return request({
        method: "post",
        url: `${wechat}/FissionPosterCount/getTimeTotal?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
