import emoji from "emoji"
import expressList from "../pages/components/expressListNew"
export const testSubstr = (str, substr) => {
    var reg = new RegExp(substr, "g")
    return reg.test(str)
}

export const delay = (timer) => new Promise((resolve) => setTimeout(resolve, timer))

export const getParameterByName = (name, string) => {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
    let regex = new RegExp("[\\?&]" + name + "=([^&#]*)")
    let results = regex.exec(string)
    return results === null ? null : decodeURIComponent(results[1])
}
export const randomFun = () => {
    const str = "qwertyuiopasdfghjklzxcvbnm0123456789QWERTYUIOPASDFGHJKLZXCVBNM"
    const len = str.length
    let _d = new Date()
    let strMath = ""
    for (let i = 0; i < 4; i++) {
        let math = Math.floor(Math.random() * len - 1)
        if (math < 0) {
            math = 0
        }
        strMath += str.substr(math, 1)
    }
    let dataMath = _d.getTime() + strMath
    return dataMath
}
export const timeStamp = (strtime) => {
    let gettime = new Date(strtime)
    let [year, month, day, hour, min, seconds] = [gettime.getFullYear(), gettime.getMonth() + 1, gettime.getDate(), gettime.getHours(), gettime.getMinutes(), gettime.getSeconds()]
    month = month < 10 ? "0" + month : month
    day = day < 10 ? "0" + day : day
    hour = hour < 10 ? "0" + hour : hour
    min = min < 10 ? "0" + min : min
    seconds = seconds < 10 ? "0" + seconds : seconds

    let changeTime = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + seconds
    return changeTime
}
export const orderStatus = (status) => {
    let info = ""
    switch (status) {
        case -1:
            info = "取消"
            break
        case 0:
            info = "待付款"
            break
        case 1:
            info = "已付款"
            break
        case 2:
            info = "已发货"
            break
        case 3:
            info = "成功"
            break
        case 4:
            info = "退货中"
            break
        default:
            info = "退货完成"
            break
    }
    return info
}
export const expDutyLst = (list) => {
    let array = []
    list && list.map((item) => {
        array.push(devidLst(item.type, item))
    })
    return array
}
// 指令动作
function devidLst (type, item) {
    let vm = {}
    vm.id = item.id
    vm.time = item.protime
    vm.decname = item.devicename
    if (item.isprocess === "0") {
        vm.status = "未被执行"
    } else if (item.isprocess === "1" && item.returnInfo === null) {
        vm.status = "已执行"
    } else if (item.isprocess === "1" && item.returnInfo === "1") {
        vm.status = "执行成功"
    } else {
        vm.status = "执行失败"
    }
    return devidType(Number(type), vm, item)
}
// 指令枚举
function devidType (type, vm, item) {
    switch (type) {
        case 1070:
            item.ContentType = Number(item.ContentType)
            vm.devid = "客户端发送消息到手机端"
            vm.content = (item.ContentType === 1 || item.ContentType === 3 || item.ContentType === 5 || item.ContentType === 6) ? item.Content : ""
            vm.img = item.ContentType === 2 ? [item.Content] : ""
            vm.video = item.ContentType === 4 ? [item.Content] : ""
            break
        case 1071:
            item.p_type = Number(item.p_type)
            vm.content = item.Content
            vm.link = item.p_type === 0 ? item.source : ""
            vm.img = item.p_type === 2 ? item.source : ""
            vm.video = item.p_type === 3 || item.p_type === 4 ? item.source : ""
            vm.devid = "发送朋友圈"
            break
        case 1072:
            vm.content = item.message
            vm.devid = "发送添加好友请求"
            break
        case 1074:
            vm.devid = "服务端推送删除朋友圈指令"
            break
        case 1075:
            vm.content = item.Remark
            vm.devid = "同意或拒绝加好友"
            break
        case 1076:
            item.ContentType = Number(item.ContentType)
            vm.content = item.ContentType === 0 ? item.Content : ""
            vm.img = item.ContentType === 1 ? [item.Content] : ""
            vm.devid = "群发消息任务"
            break
        case 1077:
            vm.content = item.Actions.includes("1") ? "阅读腾讯新闻" : ""
            vm.content = item.Actions.includes("2") ? vm.content + " 阅读公众号文章" : vm.content
            vm.content = item.Actions.includes("3") ? vm.content + " 阅读看一看文章" : vm.content
            vm.devid = "执行养号动作命令"
            break
        case 1078:
            vm.devid = "请求图片或视频消息的详细内容"
            break
        case 1079:
            vm.devid = "服务端主动要求手机上传当前登录的微信二维码"
            break
        case 1080:
            vm.devid = "触发手机推送好友列表任务"
            break
        case 1082:
            vm.devid = "朋友圈评论删除任务"
            break
        case 1084:
            vm.content = item.Content
            vm.devid = "朋友圈评论回复任务"
            break
        case 1086:
            vm.devid = "通知手机将某个聊天窗口置为已读"
            break
        case 1095:
            vm.devid = "清粉任务"
            break
        case 1096:
            vm.devid = "终止清粉任务"
            break
        case 1098:
            vm.devid = "朋友圈自动点赞任务"
            break
        case 1099:
            vm.devid = "停止继续执行朋友圈自动点赞任务"
            break
        case 1101:
            vm.devid = "微信好友修改备注任务"
            break
        case 1201:
            vm.devid = "获取指定好友朋友圈"
            break
        default:
            vm.devid = "获取朋友圈图片"
            break
    }
    return vm
}
// query参数转码
export const decodeURIComponent = (query, code) => {
    if (!query) {
        return
    }
    if (code) {// 转码
        return window.btoa(window.encodeURIComponent(`${query}`))
    } else {// 解码
        return window.decodeURIComponent(window.atob(query))
    }
}
// 表情处理
export const hasEmoji = (content) => {
    if (content) {
        content = emoji.unifiedToHTML(unescape(content.replace(/\\u/g, "%u")))
        for (let v of expressList) {
            let index = -1
            if (content) {
                do {
                    index = content.indexOf(v.name, index + 1)
                    if (index !== -1) {
                        content = content.replace(v.name, "<i class='sprite sprite-" + v.className + "' ></i>")
                        // content = content.replace(v.name, `<img  src=${v.img} style=" padding: 5px;width: 40px;" ></img>`)
                    }
                } while (index !== -1)
            }
        }
    }
    return content
}
