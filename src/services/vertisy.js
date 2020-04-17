import request from "../utils/request"
const wechat = "//wechat.yunbeisoft.com/index_test.php/home"
// 获取微信列表
export function circleWeChatList (body) {
    return request({
        method: "post",
        url: `${wechat}/device/device_bind_lists_peng`,
        data: JSON.stringify(body),
    })
}
// 获取点赞设置记录列表
export function pointSetRecord (body) {
    return request({
        method: "post",
        url: `${wechat}/dianzanvs/gets`,
        data: JSON.stringify(body),
    })
}
// 自动点赞设置
export function setPoint (body) {
    return request({
        method: "post",
        url: `${wechat}/dianzanvs/create`,
        data: JSON.stringify(body),
    })
}
// 自动点赞列表
export function pointList (body) {
    return request({
        method: "post",
        url: `${wechat}/dianzan/get_lists`,
        data: JSON.stringify(body),
    })
}
// 修改点赞任务状态
export function pointStatus (body) {
    return request({
        method: "post",
        url: `${wechat}/dianzan/is_auto`,
        data: JSON.stringify(body),
    })
}
// 修改点赞任务类型
export function pointType (body) {
    return request({
        method: "post",
        url: `${wechat}/dianzan/duty_type`,
        data: JSON.stringify(body),
    })
}
// 朋友圈
export async function sendCircle (body) {
    return request({
        method: "post",
        url: `${wechat}/api/dopengyouquan`,
        data: JSON.stringify(body),
    })
}
// 获取发送朋友圈记录
export async function fetchCircle (body) {
    return request({
        method: "post",
        url: `${wechat}/api/dopengyouquan_record`,
        data: JSON.stringify(body),
    })
}
// 删除朋友圈记录
export async function delCircle (body) {
    return request({
        method: "post",
        url: `${wechat}/pengyouquan/delpengyouquan`,
        data: JSON.stringify(body),
    })
}

// 群发
export function doQunFa (body) {
    return request({
        method: "post",
        url: `${wechat}/api/doqunfa?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 获取群发记录
export function fetchQunfa (body) {
    return request({
        method: "post",
        url: `${wechat}/api/doqunfa_record`,
        data: JSON.stringify(body),
    })
}
// 群发记录详情
export function detailQunfa (body) {
    return request({
        method: "post",
        url: `${wechat}/api/dogetqunfa_record`,
        data: JSON.stringify(body),
    })
}
// 群发筛选好友
export function fetchContactList (body) {
    return request({
        method: "post",
        url: `${wechat}/api/dogetuserlists_qunfa`,
        data: JSON.stringify(body),
    })
}
// 停止定时发送群发
export function stopGroupSend (body) {
    return request({
        method: "post",
        url: `${wechat}/api/is_quxiao_qunfa`,
        data: JSON.stringify(body),
    })
}
// 停止定时发送朋友圈
export function stopCircleSend (body) {
    return request({
        method: "post",
        url: `${wechat}/api/startoff`,
        data: JSON.stringify(body),
    })
}
// 朋友圈重发
export function replaceSend (body) {
    return request({
        method: "post",
        url: `${wechat}/api/reSend`,
        data: JSON.stringify(body),
    })
}

// 获取点赞记录
export function getOne (body) {
    return request({
        method: "post",
        url: `${wechat}/dianzanvs/getOne`,
        data: JSON.stringify(body),
    })
}
// 编辑自定义随机表情
export function setemoji (body) {
    return request({
        method: "post",
        url: `${wechat}/zdyrandomemoji/setemoji`,
        data: JSON.stringify(body),
    })
}
export function getemoji (body) {
    return request({
        method: "post",
        url: `${wechat}/zdyrandomemoji/getemoji`,
        data: JSON.stringify(body),
    })
}
// 获取群
export function fetchQun (body) {
    return request({
        method: "post",
        url: `${wechat}/qunmanage/getlist`,
        data: JSON.stringify(body),
    })
}
