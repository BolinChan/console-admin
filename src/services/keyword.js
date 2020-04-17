import request from "../utils/request"

const word = "//wechat.yunbeisoft.com/index_test.php/home/kword"

// 获取关键词
export function fetchKeyWord (body) {
    return request({
        method: "post",
        url: `${word}/kwgets?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}

// 关键词添加
export function addKeyReply (body) {
    return request({
        method: "post",
        url: `${word}/kwcreate?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}

// 删除关键词kword
export function delKeyReply (body) {
    return request({
        method: "post",
        url: `${word}/kwdelete?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 编辑关键词kword
export function upKeyReply (body) {
    return request({
        method: "post",
        url: `${word}/kwupdate?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
