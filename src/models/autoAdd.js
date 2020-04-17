import { testSubstr } from "../utils/helper"
import * as statitService from "../services/statistical"
import * as autoAddService from "../services/autoAdd"
import moment from "moment"
import { message } from "antd"
export default {
    namespace: "autoAdd",
    state: {
        devices: [],
        BeiRule: [],
        orderules: [],
    },
    reducers: {
        saveFriendRule (
            state,
            {
                payload: { data},
            }
        ) {
            let addRule = data ? data[0] : {}
            addRule.addUserTime = addRule.addUserTime && JSON.parse(addRule.addUserTime)
            addRule.executeTime = addRule.executeTime !== "" && addRule.executeTime && JSON.parse(addRule.executeTime)
            return { ...state, addRule }
        },
        saveBeiRule (
            state,
            {
                payload: { data, setObj, weChatList },
            }
        ) {
            let BeiRule = data || state.BeiRule
            if (weChatList && data) {
                BeiRule.map((item, index) => {
                    if (!item.device_wxid && weChatList.findIndex((mess) => mess.wxid === item.wxid) !== -1) {
                        item.device_wxid = item.wxid
                    }
                })
            }
            // // 设置操作
            if (setObj && setObj.device_wxid && BeiRule.length > 0) {
                setObj.device_wxid.map((wxid) => {
                    let index = BeiRule.findIndex((item) => item.device_wxid === wxid)
                    if (index !== -1) {
                        BeiRule[index] = { ...BeiRule[index], ...setObj, device_wxid: wxid }
                    }
                })
            }
            return { ...state, BeiRule }
        },
        // 执行记录
        saveRecord (
            state,
            {
                payload: { data },
            }
        ) {
            return { ...state, autoList: data.data, atuoTotal: Number(data.total) }
        },
        // 查看详情
        saveDetail (
            state,
            {
                payload: { data },
            }
        ) {
            return { ...state, detailList: data.data, detaiTotal: Number(data.total) }
        },
        saveTj (
            state,
            {
                payload: { data },
            }
        ) {
            return { ...state, importMobile: data }
        },
        saveStore (state, {payload: {data}}) {
            return {...state, store: data}
        },
        saveOrderRules (state, {payload: {data, id}}) {
            if (data) {
                let list = []
                data = data.map((item) => {
                    if (item.content) {
                        const {executeTime, addUserTime, fromOrderTime, endOrderTime} = item.content
                        list.push({
                            nickname: item.nickname,
                            ...item.content,
                            executeTime: executeTime && JSON.parse(executeTime),
                            addUserTime: addUserTime && JSON.parse(addUserTime),
                            fromOrderTime: Number(fromOrderTime) && moment(new Date(fromOrderTime * 1000)).format("YYYY-MM-DD HH:mm:ss"),
                            endOrderTime: Number(endOrderTime) && moment(new Date(endOrderTime * 1000)).format("YYYY-MM-DD HH:mm:ss"),
                        })
                    }
                })
                data = list
            }
            let orderules = data || state.orderules
            orderules && orderules.map((item) => {
                if (item.shopids) {
                    item.shopids = JSON.parse(item.shopids)
                }
                if (item.uniacids) {
                    item.uniacids = JSON.parse(item.uniacids)
                }
            })
            if (id) {
                orderules = orderules.filter((item) => item.id !== id)
            }
            return {...state, orderules}
        },
        saveOrderDetail (state, {payload: {data, total}}) {
            return {...state, orderDetail: data, detailTotal: Number(total)}
        },
    },
    effects: {
        // 模糊搜索微信昵称
        * fetchUserName ({ payload }, { call, put }) {
            const { data } = yield call(autoAddService.fetchUserName, { ...payload })
            return data.data
        },
        // 获取被添加好友规则
        * setBeiShow ({ payload }, { call, put, select }) {
            const weChatList = yield select((state) => state.vertisy.weChatList)
            const BeiRule = yield select((state) => state.autoAdd.BeiRule)
            if (BeiRule && BeiRule.length > 0) {
                return
            }
            const { data } = yield call(autoAddService.setBeiShow, payload)
            yield put({
                type: "saveBeiRule",
                payload: { data: data.data, weChatList },
            })
        },
        // 被添加好友规则设置
        * setBeiRule ({ payload }, { call, put, select }) {
            const { data } = yield call(autoAddService.setBeiRule, payload)
            if (data && data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveBeiRule",
                payload: { setObj: payload },
            })
            message.success("保存成功")
        },
        // 获取已有加好友规则
        * fetchUserRule ({ payload }, { call, put, select }) {
            const weChatList = yield select((state) => state.vertisy.weChatList)
            if (!weChatList || weChatList.length === 0) {
                return
            }
            let deviceId = weChatList && weChatList.map((item) => item.wxid)
            const { data } = yield call(autoAddService.fetchUserRule, { deviceId, ...payload })
            yield put({
                type: "saveFriendRule",
                payload: { data: data.data, weChatList },
            })
        },
        // 设置加好友规则
        * AddFriendRule ({ payload }, { call, put, select }) {
            const weChatList = yield select((state) => state.vertisy.weChatList)
            if (!weChatList || weChatList.length === 0) {
                return false
            }
            let deviceIds = weChatList && weChatList.map((item) => item.wxid)
            const { data } = yield call(autoAddService.setAddFriendRule, { deviceIds, ...payload.setList })
            if (data && data.error) {
                message.error(data.errmsg)
                return false
            }
            return true
            // if (payload.phonelist) {
            //     yield put({type: "autoAddFriends", payload: payload.phonelist})
            // }
        },

        // 自动加好友
        * autoAddFriends ({ payload }, { call }) {
            const token = window.sessionStorage.getItem("token")
            const { data } = yield call(autoAddService.autoAddFriends, { token, ...payload })
            if (data.error) {
                message.error(data.errmsg)
                return false
            }
            message.success("已发送")
            return true
        },
        // 加好友记录
        * PhoneRecord ({ payload }, { call, put, select }) {
            const { data } = yield call(autoAddService.PhoneRecord, payload)
            yield put({
                type: "saveRecord",
                payload: { data },
            })
        },
        // 查看详情
        * detailRecord ({ payload }, { call, put }) {
            const { data } = yield call(autoAddService.detailRecord, payload)
            yield put({
                type: "saveDetail",
                payload: { data },
            })
        },
        // 停止添加好友
        * stopAutoAdd ({ payload }, { call, put }) {
            const { data } = yield call(autoAddService.stopAutoAdd, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
        },
        // 导入的手机号码加好友统计
        * addFriendTj ({ payload }, { call, put }) {
            const from = moment()
                .subtract(30, "days")
                .format("YYYY-MM-DD")
            const end = moment().format("YYYY-MM-DD")
            const { data } = yield call(autoAddService.addFriendTj, {from, end, ...payload})
            yield put({
                type: "saveTj",
                payload: { data: data.data },
            })
        },
        // 获取店铺信息
        * orderStore ({ payload }, { call, put }) {
            const {data} = yield call(statitService.orderStore)
            if (data.error) {
                return
            }
            yield put({
                type: "saveStore",
                payload: data,
            })
        },
        // 获取订单实时加好友设置规则
        * fetchOrderRule ({ payload }, { call, put, select }) {
            const weChatList = yield select((state) => state.vertisy.weChatList)
            let deviceId = []
            weChatList && weChatList.map((item) => {
                if (!deviceId.find((id) => id === item.wxid)) {
                    deviceId.push(item.wxid)
                }
            })
            const {data} = yield call(autoAddService.fetchOrderRule, { deviceId, ...payload })
            if (data.error) {
                return
            }
            yield put({type: "saveOrderRules", payload: data})
        },
        // 添加根据订单实时加好友设置规则
        * setOrderRule ({ payload }, { call, put }) {
            const {data} = yield call(autoAddService.setOrderRule, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({type: "fetchOrderRule"})
            message.success("设置成功")
        },
        // 删除订单实时加好友设置规则
        * delOrderRule ({ payload }, { call, put }) {
            const {data} = yield call(autoAddService.delOrderRule, payload)
            if (data.error) {
                return
            }
            yield put({type: "saveOrderRules", payload})
        },
        // 获取订单实时加好友的执行记录
        * fetchOrderDetail ({ payload }, { call, put }) {
            const {data} = yield call(autoAddService.fetchOrderDetail, payload)
            if (data.error) {
                return
            }
            yield put({type: "saveOrderDetail", payload: data})
        },
    },
    subscriptions: {
        setup ({ dispatch, history, query }) {
            return history.listen(async ({ pathname, search, query }) => {
                if (testSubstr(pathname, "/autoadd")) {
                    await dispatch({ type: "vertisy/fetchWeChatList" })
                    dispatch({ type: "auxiliary/fetchPublic" })
                    dispatch({ type: "orderStore" })
                }
                if (pathname === "/autoadd/rules" || pathname === "/autoadd/autofriend") {
                    dispatch({ type: "fetchUserRule" })
                }
                if (pathname === "/autoadd/reply") {
                    dispatch({ type: "setBeiShow" })
                }
                if (pathname === "/autoadd/record") {
                    dispatch({ type: "PhoneRecord" })
                    dispatch({ type: "addFriendTj" })
                }
                if (pathname === "/autoadd/orderules") {
                    dispatch({ type: "fetchOrderRule"})
                }
            })
        },
    },
}
