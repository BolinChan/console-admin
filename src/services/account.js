import request from "../utils/request"
const account = "//wechat.yunbeisoft.com/index_test.php/home"
// 获取更新日志
export function fetchLog (body) {
    return request({
        method: "post",
        url: `${account}/updatelog/getList`,
        data: JSON.stringify(body),
    })
}
// 获取和搜索子账号 getAccounts
export function fetchZAccount (body) {
    return request({
        method: "post",
        url: `${account}/ziaccount/getziaccount`,
        data: JSON.stringify(body),
    })
}
// 获取主账号下子账号的文章数量
export function CalculationArticleNum (body) {
    return request({
        method: "post",
        url: `${account}/article/CalculationArticleNum`,
        data: JSON.stringify(body),
    })
}
// 登录子账号
export function loginZAccount (body) {
    return request({
        method: "post",
        url: `${account}/ziaccount/login`,
        data: JSON.stringify(body),
    })
}
// 验证子账号token
export function tokenZAccount (body) {
    return request({
        method: "post",
        url: `${account}/ziaccount/yantoken`,
        data: JSON.stringify(body),
    })
}
// 子账号登出 ziaccount/loginout
export function loginoutZ (body) {
    return request({
        method: "post",
        url: `${account}/ziaccount/loginout`,
        data: JSON.stringify(body),
    })
}
// 添加子账号
export function addZAccount (body) {
    return request({
        method: "post",
        url: `${account}/ziaccount/addziaccount`,
        data: JSON.stringify(body),
    })
}
// 删除子账号
export function deleteZAccount (body) {
    return request({
        method: "post",
        url: `${account}/ziaccount/delziaccount`,
        data: JSON.stringify(body),
    })
}
// 子账号管理修改状态值
export function changeStatus (body) {
    return request({
        method: "post",
        url: `${account}/ziaccount/change_status`,
        data: JSON.stringify(body),
    })
}
// 子账号编辑
export function editZAccount (body) {
    return request({
        method: "post",
        url: `${account}/ziaccount/editziaccount`,
        data: JSON.stringify(body),
    })
}
// 获取主账号getAccounts
export function primaryAccount (body) {
    return request({
        method: "post",
        url: `${account}/account/getaccount`,
        data: JSON.stringify(body),
    })
}
// 登录主账号
export function loginPrimary (body) {
    return request({
        method: "post",
        url: `${account}/account/login`,
        data: JSON.stringify(body),
    })
}
// 验证主账号token
export function tokenPrimary (body) {
    return request({
        method: "post",
        url: `${account}/account/yanactoken`,
        data: JSON.stringify(body),
    })
}

// 主账号编辑
export function editPrimary (body) {
    return request({
        method: "post",
        url: `${account}/account/editaccount`,
        data: JSON.stringify(body),
    })
}
// 添加主账号
export function primaryAdd (body) {
    return request({
        method: "post",
        url: `${account}/account/addaccount`,
        data: JSON.stringify(body),
    })
}
// 删除主账号
export function primaryDelete (body) {
    return request({
        method: "post",
        url: `${account}/account/delaccount`,
        data: JSON.stringify(body),
    })
}
// 获取客服权限
export function fecthPermie (body) {
    return request({
        method: "post",
        url: `${account}/rights/getrights`,
        data: JSON.stringify(body),
    })
}
// 设置客服权限
export function setPermie (body) {
    return request({
        method: "post",
        url: `${account}/rights/editrights`,
        data: JSON.stringify(body),
    })
}
// 获取部门
export function getdepartment (body) {
    return request({
        method: "post",
        url: `${account}/department/getdepartment`,
        data: JSON.stringify(body),
    })
}
// 编辑部门
export function editdepartment (body) {
    return request({
        method: "post",
        url: `${account}/department/editdepartment`,
        data: JSON.stringify(body),
    })
}
// 新增部门
export function adddepartment (body) {
    return request({
        method: "post",
        url: `${account}/department/adddepartment`,
        data: JSON.stringify(body),
    })
}
// 删除部门
export function deldepartment (body) {
    return request({
        method: "post",
        url: `${account}/department/deldepartment`,
        data: JSON.stringify(body),
    })
}
// 部门分配权限
export function allotpartment (body) {
    return request({
        method: "post",
        url: `${account}/department/add_department_rights`,
        data: JSON.stringify(body),
    })
}
// 红包设置
export function Maximum (body) {
    return request({
        method: "post",
        url: `${account}/BalanceRecord/balanceSet`,
        data: JSON.stringify(body),
    })
}
// 获取某个帐号的红包记录
export function BalanceRecord (body) {
    return request({
        method: "post",
        url: `${account}/BalanceRecord/balanceRecord`,
        data: JSON.stringify(body),
    })
}
