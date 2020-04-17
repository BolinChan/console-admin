import axios from "axios"
function LogoutVerification (responsedata) {
    window.location.href = ""
    window.sessionStorage.clear()
    window.sessionStorage.setItem("msg", responsedata) // 退出登录页面是弹出错误提示
}
export default async function request (options) {
    let response
    let token = window.sessionStorage.getItem("token")
    const aid = window.sessionStorage.getItem("i")
    const primary = window.sessionStorage.getItem("u")
    let data = options.data ? JSON.parse(options.data) : {}
    if (!data.password && !token) {
        return
    }
    if (token) {
        data.aid = aid
        data.ispubilc && primary && (data.aid = primary)
        data.token = token
        options.data = JSON.stringify(data)
    }
    try {
        response = await axios(options)
        if (response.data.msg === "token过期" || response.data.msg === "该账号已停用") {
            LogoutVerification(response.data.msg)
        }
        return response
    } catch (err) {
        if (!response) {
            response = {data: {error: false, msg: "操作失败"}}
        }
        return response
    }
}
