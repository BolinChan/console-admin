import request from "../utils/request"
const wechat = " //wechat.yunbeisoft.com/index_test.php/home"
// 模糊搜索微信昵称
export function fetchUserName (body) {
    return request({
        method: "post",
        url: `${wechat}/setting/get_add_nick?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 获取已经有的加好友规则
export function fetchUserRule (body) {
    return request({
        method: "post",
        url: `${wechat}/setting/getNewRule2?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 设置加好友规则
export function setAddFriendRule (body) {
    return request({
        method: "post",
        url: `${wechat}/setting/setNewRule`,
        data: JSON.stringify(body),
    })
}
// 获取加好友列表信息
export function AtuoList (body) {
    return request({
        method: "post",
        url: `${wechat}/file/get_lists?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 批量自动加好友
export function autoAddFriends (body) {
    return request({
        method: "post",
        url: `${wechat}/setting/addUserPhone?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 获取加好友的执行数据
export function PhoneRecord (body) {
    return request({
        method: "post",
        url: `${wechat}/setting/get_add_friend_record`,
        data: JSON.stringify(body),
    })
}
// 查看详情
export function detailRecord (body) {
    return request({
        method: "post",
        url: `${wechat}/setting/get_add_friend_record_detail`,
        data: JSON.stringify(body),
    })
}
// 停止加好友
export function stopAutoAdd (body) {
    return request({
        method: "post",
        url: `${wechat}/setting/stop_add_user`,
        data: JSON.stringify(body),
    })
}
// 粉丝统计
export function fansDate (body) {
    return request({
        method: "post",
        url: `${wechat}/fans/gettotal?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}

// 被添加好友规则
export function setBeiRule (body) {
    return request({
        method: "post",
        url: `${wechat}/setting/setBeiRule`,
        data: JSON.stringify(body),
    })
}
// 被添加好友规则显示
export function setBeiShow (body) {
    return request({
        method: "post",
        url: `${wechat}/setting/setBeiShow`,
        data: JSON.stringify(body),
    })
}
// 加好友统计
export function addFriendTj (body) {
    return request({
        method: "post",
        url: `${wechat}/account/add_friend_status_tonji`,
        data: JSON.stringify(body),
    })
}
// 获取按订单加好友规则
export function fetchOrderRule (body) {
    return request({
        method: "post",
        url: `${wechat}/setting/getOrderRule`,
        data: JSON.stringify(body),
    })
}
// 添加根据订单实时加好友设置规则
export function setOrderRule (body) {
    return request({
        method: "post",
        url: `${wechat}/setting/setOrderRule`,
        data: JSON.stringify(body),
    })
}
// 删除根据订单实时加好友设置规则
export function delOrderRule (body) {
    return request({
        method: "post",
        url: `${wechat}/setting/deleteOrderRule`,
        data: JSON.stringify(body),
    })
}
// 获取订单实时加好友的执行记录
export function fetchOrderDetail (body) { // todo
    return request({
        method: "post",
        url: `${wechat}/setting/fetchOrderDetail`,
        data: JSON.stringify(body),
    })
}
