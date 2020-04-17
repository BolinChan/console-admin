import request from "../utils/request"
const url = "//wechat.yunbeisoft.com/index_test.php/home"
const jutaobao = "//wxx.jutaobao.cc"
// 好友总排行
export function friendRank (body) {
    return request({
        method: "post",
        url: `${url}/account/baihan`,
        data: JSON.stringify(body),
    })
}
// 好友增量统计
export function addFriendRank (body) {
    return request({
        method: "post",
        url: `${url}/account/addfriends_tonji`,
        data: JSON.stringify(body),
    })
}
// 好友数量走势
export function friendNum (body) {
    return request({
        method: "post",
        url: `${url}/account/friends_tonji`,
        data: JSON.stringify(body),
    })
}
// 朋友圈点赞统计
export function circlePoint (body) {
    return request({
        method: "post",
        url: `${url}/account/peng_dian_tonji`,
        data: JSON.stringify(body),
    })
}
// 红包统计
export function RedRank (body) {
    return request({
        method: "post",
        url: `${jutaobao}/yunbei_send_redpack/qr_code.php?code=amount`,
        // url: "//wxx.jutaobao.cc/",
        data: JSON.stringify(body),
    })
}
// 加好友通过率
export function friendPassRate (body) {
    return request({
        method: "post",
        url: `${url}/users/friendPassRate`,
        data: JSON.stringify(body),
    })
}
// 每日添加好友通过数量
export function friendStatistics (body) {
    return request({
        method: "post",
        url: `${url}/users/friendStatistics`,
        data: JSON.stringify(body),
    })
}
// 好友分布统计
export function friendProvince (body) {
    return request({
        method: "post",
        url: `${url}/account/province_tonji`,
        data: JSON.stringify(body),
    })
}
// 粉丝性别统计
export function friendGender (body) {
    return request({
        method: "post",
        url: `${url}/account/sex_tongji`,
        data: JSON.stringify(body),
    })
}
// 消息统计
export function msgStatistics (body) {
    return request({
        method: "post",
        url: `${url}/account/msg_tonji`,
        data: JSON.stringify(body),
    })
}
// 消息新统计
export function msgNewStatistics (body) {
    return request({
        method: "post",
        url: `${url}/account/new_msg_tonji`,
        data: JSON.stringify(body),
    })
}
// 订单统计
export function orderStatistics (body) {
    return request({
        method: "post",
        url: `${jutaobao}/getOrderMsg/getlist.php?code=order`,

        data: JSON.stringify(body),
    })
}
// 获取店铺
export function orderStore (body) {
    return request({
        method: "post",
        url: `${jutaobao}/getOrderMsg/getlist.php?code=shop`,
        data: JSON.stringify(body),
    })
}
// 获取订单 绑定的 旺旺号和手机号
export function orderWang (body) {
    return request({
        method: "post",
        url: `${jutaobao}/getOrderMsg/getlist.php?code=jiemi`,
        data: JSON.stringify(body),
    })
}

// 时间段营销统计
export function marketPlan (body) {
    return request({
        method: "post",
        url: `${jutaobao}/yunbei_send_redpack/qr_code.php?code=datetongji`,
        data: JSON.stringify(body),
    })
}
// 总账号营销统计
export function marketTj (body) {
    return request({
        method: "post",
        url: `${jutaobao}/yunbei_send_redpack/qr_code.php?code=atongji`,
        data: JSON.stringify(body),
    })
}
// 子账号营销统计
export function marketZTj (body) {
    return request({
        method: "post",
        url: `${jutaobao}/yunbei_send_redpack/qr_code.php?code=ztongji`,
        data: JSON.stringify(body),
    })
}
