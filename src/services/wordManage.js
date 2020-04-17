import request from "../utils/request"

const hsg = "//wechat.yunbeisoft.com/index_test.php/home/hsgroup"

// 新增话术组
export function addHsGroup (body) {
    return request({
        method: "post",
        url: `${hsg}/create?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 修改话术组名
export function editHsGroup (body) {
    return request({
        method: "post",
        url: `${hsg}/update?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 删除话术组
export function delHsGroup (body) {
    return request({
        method: "post",
        url: `${hsg}/delete?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 新增组内快速语
export function addMsg (body) {
    return request({
        method: "post",
        url: `${hsg}/create_msg?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 修改组内快速语
export function editMsg (body) {
    return request({
        method: "post",
        url: `${hsg}/update_msg?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 删除组内快速语
export function delMsg (body) {
    return request({
        method: "post",
        url: `${hsg}/delete_msg?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 获取话术组
export function getHsGroup (body) {
    return request({
        method: "post",
        url: `${hsg}/gets?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 获取快速语
export function getMsg (body) {
    return request({
        method: "post",
        url: `${hsg}/gets_ksy?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 分组排序
export function groupSort (body) {
    return request({
        method: "post",
        url: `${hsg}/update_zu_orders?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 置顶
export function groupUptop (body) {
    return request({
        method: "post",
        url: `${hsg}/update_to_top?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
