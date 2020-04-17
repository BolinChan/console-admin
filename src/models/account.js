import { testSubstr } from "../utils/helper"
import * as chatService from "../services/account"
import { message } from "antd"
export default {
    namespace: "account",
    state: {},
    reducers: {
        saveArticleNum (
            state,
            {
                payload: { data },
            }
        ) {
            let accountList = state.accountList
            data && data.map((item) => {
                if (item.gNum !== "0" || item.sNum !== "0") {
                    const index = accountList.findIndex((mess) => item.id === mess.id)
                    index !== -1 && (accountList[index] = { ...accountList[index], gNum: item.gNum, sNum: item.sNum })
                }
            })
            return { ...state, accountList }
        },
        saveAccount (
            state,
            {
                payload: { accountList },
            }
        ) {
            accountList = accountList.sort((a, b) => Number(b.id) - Number(a.id))
            accountList.length && accountList.map((item) => {
                item.departmen = item.departmen === "0" ? "" : item.departmen
                item.rights_id = item.rights_id && item.rights_id.split(",")
            })
            return { ...state, accountList }
        },
        delZAccount (state, { payload }) {
            let accountList = state.accountList
            if (accountList.find((item) => item.id === payload.id)) {
                accountList = accountList.filter((item) => item.id !== payload.id)
            }
            return { ...state, accountList }
        },
        savePermie (
            state,
            {
                payload: { data, setObj },
            }
        ) {
            let permissions = data || state.permissions
            return { ...state, permissions }
        },

        savePartment (
            state,
            {
                payload: { delpId, data, edit },
            }
        ) {
            let partmentList = data || state.partmentList
            if (delpId) {
                partmentList = partmentList.filter((item) => item.id !== delpId)
            }
            if (edit) {
                let index = partmentList.findIndex((item) => item.id === edit.id)
                index !== -1 && (partmentList[index] = { ...partmentList[index], ...edit })
            }
            return { ...state, partmentList }
        },
        // 红包记录
        saveBalance (
            state,
            {
                payload: { data },
            }
        ) {
            return { ...state, balanceList: data.data, total: Number(data.total) }
        },
    },
    effects: {
        // 修改密码
        * editPrimary ({ payload }, { call, put }) {
            const id = window.sessionStorage.getItem("i") || ""
            const { data } = yield call(chatService.editPrimary, { ...payload, id })
            if (data.error) {
                message.error(data.errmsg)
                return true
            }
            message.success("变更账号状态完成")
            return false
        },
        // 获取和搜索子账号
        * fetchZAccount ({ payload }, { call, put, select }) {
            let keys = payload ? payload.keys : ""
            let department = payload ? payload.department : ""
            const { data } = yield call(chatService.fetchZAccount, { keys, department })
            yield put({
                type: "saveAccount",
                payload: {
                    accountList: !data.error ? data.data : [],
                },
            })
        },
        // 添加子账号
        * addZAccount ({ payload }, { call, put }) {
            const { data } = yield call(chatService.addZAccount, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({ type: "fetchZAccount" })
            message.success("添加成功")
        },
        // 删除子账号
        * deleteZAccount ({ payload }, { call, put }) {
            const { data } = yield call(chatService.deleteZAccount, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "delZAccount",
                payload: { ...payload },
            })
            message.success("删除成功")
        },
        // 修改子账号状态
        * changeStatus ({ payload }, { call, put }) {
            const user_id = window.sessionStorage.getItem("i") || ""
            const { data } = yield call(chatService.changeStatus, { ...payload, user_id })
            if (data.error) {
                return message.error(data.errmsg)
            }
            message.success("变更账号状态完成")
        },
        * editZAccount ({ payload }, { call, put }) {
            const { data } = yield call(chatService.editZAccount, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({ type: "fetchZAccount" })
            message.success("修改成功")
        },

        // 获取客服权限
        * fecthPermie (_, { call, put }) {
            const { data } = yield call(chatService.fecthPermie, { userid: window.sessionStorage.getItem("i") || "" })
            yield put({
                type: "savePermie",
                payload: { data: data.data },
            })
        },
        // 设置客服权限
        * setPermie ({ payload }, { call, put }) {
            const { data } = yield call(chatService.setPermie, payload)
            return data.error
        },
        // 获取部门
        * getdepartment ({ payload }, { call, put, select }) {
            let partmentList = yield select((state) => state.partmentList)
            if (partmentList && !payload) {
                return
            }
            const { data } = yield call(chatService.getdepartment)
            yield put({
                type: "savePartment",
                payload: {
                    data: data.data,
                },
            })
        },
        // 新增部门
        * adddepartment ({ payload }, { call, put }) {
            const { data } = yield call(chatService.adddepartment, payload)
            if (!data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "getdepartment",
                payload,
            })
            message.success("添加成功")
        },
        // 编辑部门
        * editdepartment ({ payload }, { call, put }) {
            const user_id = window.sessionStorage.getItem("i") || ""
            const { data } = yield call(chatService.editdepartment, { ...payload, user_id })
            if (!data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "savePartment",
                payload: {
                    edit: payload,
                },
            })
            message.success("修改完成")
        },
        // 删除部门
        * deldepartment ({ payload }, { call, put }) {
            const { data } = yield call(chatService.deldepartment, payload)
            if (!data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "savePartment",
                payload: { delpId: payload.id },
            })
        },
        // 部门分配权限
        * allotpartment ({ payload }, { call, put }) {
            const { data } = yield call(chatService.allotpartment, payload)
            if (data.error) {
                message.error(data.errmsg)
                return false
            }
            yield put({
                type: "savePartment",
                payload: { edit: payload },
            })
            message.success("分配成功")
            return true
        },
        // 红包设置
        * Maximum ({ payload }, { call, put }) {
            const { data } = yield call(chatService.Maximum, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "fetchZAccount",
                payload,
            })
            message.success("设置成功")
        },
        // 获取某个帐号的红包记录
        * BalanceRecord ({ payload }, { call, put }) {
            const { data } = yield call(chatService.BalanceRecord, payload)
            if (data.error) {
                return
            }
            yield put({
                type: "saveBalance",
                payload: { data },
            })
        },
        // 获取主账号下子账号的文章数量
        * CalculationArticleNum (_, { call, put }) {
            const { data } = yield call(chatService.CalculationArticleNum, { ispubilc: true })
            yield put({
                type: "saveArticleNum",
                payload: data,
            })
        },
    },
    subscriptions: {
        setup ({ dispatch, history, query }) {
            return history.listen(async ({ pathname, search, query }) => {
                // 子账号
                if (testSubstr(pathname, "/account")) {
                    await dispatch({ type: "fetchZAccount" })
                }
                if (pathname === "/redpackage" || pathname === "/wechat/friendsList" || pathname === "/wechat/chatList" || pathname === "/wechat/chatRecord") {
                    await dispatch({ type: "fetchZAccount" })
                }
                if (pathname === "/article/team") {
                    await dispatch({ type: "fetchZAccount" })
                    dispatch({ type: "CalculationArticleNum" })

                }
                if (pathname === "/partment" || pathname === "/account") {
                    dispatch({ type: "getdepartment" })
                    dispatch({ type: "fecthPermie" })
                    dispatch({ type: "vertisy/fetchWeChatList" })
                }
            })
        },
    },
}
