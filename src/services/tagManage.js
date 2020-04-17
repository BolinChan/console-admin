import request from "../utils/request"
const devTag = "//wechat.yunbeisoft.com/index_test.php/home"

// 获取标签组
export function getTagsGrop (body) {
    return request({
        method: "post",
        url: `${devTag}/taggfenzu/gettaggfenzu`,
        data: JSON.stringify(body),
    })
}
// 添加标签分组
export function addTagsGrop (body) {
    return request({
        method: "post",
        url: `${devTag}/taggfenzu/addtaggfenzu`,
        data: JSON.stringify(body),
    })
}
// 编辑标签分组
export function editTagsGrop (body) {
    return request({
        method: "post",
        url: `${devTag}/taggfenzu/edittaggfenzu`,
        data: JSON.stringify(body),
    })
}
// 删除标签分组
export function delTagsGrop (body) {
    return request({
        method: "post",
        url: `${devTag}/taggfenzu/deltaggfenzu`,
        data: JSON.stringify(body),
    })
}
// 获取标签，标签管理页
export function getDevTags (body) {
    return request({
        method: "post",
        url: `${devTag}/tagg/gettagg`,
        data: JSON.stringify(body),
    })
}
// 好友标签
// export function friendTags (body) {
//     return request({
//         method: "post",
//         url: `${devTag}/WechatTag/wechatTagByFriend`,
//         data: JSON.stringify(body),
//     })
// }
// 创建标签
export function createDevTags (body) {
    return request({
        method: "post",
        url: `${devTag}/tagg/addtagg`,
        data: JSON.stringify(body),
    })
}
// 删除标签
export function deleteDevTags (body) {
    return request({
        method: "post",
        url: `${devTag}/tagg/deltagg`,
        data: JSON.stringify(body),
    })
}
// 编辑标签
export function editDevTags (body) {
    return request({
        method: "post",
        url: `${devTag}/tagg/edittagg`,
        data: JSON.stringify(body),
    })
}
// 是否可见
// 编辑标签
export function editStatus (body) {
    return request({
        method: "post",
        url: `${devTag}/tagg/edit_isweb`,
        data: JSON.stringify(body),
    })
}
// 获取微信上的标签
export function fetchWeChatlabel (body) {
    return request({
        method: "post",
        url: `${devTag}/users/WeChatlabel`,
        data: JSON.stringify(body),
    })
}
