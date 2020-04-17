import { timeStamp, orderStatus } from "../utils/helper"
import * as statitService from "../services/statistical"
import * as accounService from "../services/account"
import * as autoAddService from "../services/autoAdd"
import { message } from "antd"
import moment from "moment"
export default {
    namespace: "statistical",
    state: {
        province: [],
        gender: {},
        orderLst: [], // 订单统计列表
        ordercount: 0, // 订单统计数量
        orderStore: [], // 店铺
        ordertj: {},
        marketSum: {},
        marketList: [],
    },
    reducers: {
        saveData (
            state,
            {
                payload: { province, gender, msgT },
            }
        ) {

            province = province || state.province
            gender = gender || state.gender
            msgT = msgT || state.msgT
            if (msgT && msgT.zzong) {
                let list = []
                Object.keys(msgT.zzong).map((item) => {
                    list.push({zaccount: item, ...msgT.zzong[item]})
                })
                list = list.sort((a, b) => b.msg_bili.replace("%", "") - a.msg_bili.replace("%", ""))
                msgT.zzong = list
            }
            return { ...state, province, gender, msgT }
        },
        saveOrder (
            state,
            {
                payload: { lst, count, orderStore, ordertj },
            }
        ) {

            lst.map((item) => {
                item.area = item.aprovince + item.acity + item.aarea + item.aaddress
                item.createtime = timeStamp(item.createtime * 1000)
                item.orderstatus = orderStatus(Number(item.status))
                if (orderStore && orderStore.length) {
                    let tmp = orderStore.find((f) => f.id === item.from_shopid)
                    item.from_shop_name = tmp ? tmp.name : ""
                }
            })
            return { ...state, orderLst: lst, ordercount: count, orderStore, ordertj }
        },
        saveAccount (
            state,
            {
                payload: { accountList },
            }
        ) {
            return { ...state, accountList }
        },
        saveMarket (state, {payload: {marketChart, marketSum, marketList}}) {
            let chart = []
            let list = []
            if (marketChart) {
                for (let index of Object.keys(marketChart)) {
                    chart.push({
                        month: index, "付款订单": marketChart[index].num,
                        "付款金额": marketChart[index].sum,
                        "付款客户": marketChart[index].person_num,
                        "客单价": marketChart[index].pingjun,
                        "复购率": marketChart[index].fugou,
                    })
                }
                marketChart = chart
            }
            if (marketList) {
                const accountList = state.accountList
                for (let zid of Object.keys(marketList)) {
                    let account = accountList.find((mess) => mess.id === zid)
                    list.push({zid, zidAccount: account && (account.realname || account.accountnum), ...marketList[zid]})
                }
                marketList = list
            }
            marketChart = marketChart || state.marketChart
            marketSum = marketSum || state.marketSum
            marketList = marketList || state.marketList
            return {...state, marketChart, marketSum, marketList}
        },
    },
    effects: {
        // 好友分布
        * friendProvince (_, { call, put, select }) {
            const { data } = yield call(statitService.friendProvince)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveData",
                payload: {
                    province: data.data,
                },
            })
        },
        // 好友分布
        * friendGender (_, { call, put, select }) {
            const gender = yield select((state) => state.statistical.gender)
            if (gender && gender.nan) {
                return
            }
            const { data } = yield call(statitService.friendGender)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveData",
                payload: {
                    gender: data.data,
                },
            })
        },

        // 好友分布
        * msgStatistics ({ payload }, { call, put, select }) {
            const msgT = yield select((state) => state.statistical.msgT)
            if (msgT && !payload) {
                return
            }
            const { data } = yield call(statitService.msgNewStatistics, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveData",
                payload: {
                    msgT: data,
                },
            })
        },
        // 获取订单数
        * orderStatistics ({ payload }, { call, put, select }) {
            const orderLst = yield select((state) => state.statistical.orderLst)
            if (orderLst.length > 0 && !payload) {
                return
            }
            let storeArray = []
            let time = [moment().subtract(7, "days")
                .format("YYYY-MM-DD"), moment().add(0, "days")
                .format("YYYY-MM-DD")]
            const { data } = yield call(statitService.orderStatistics, {time, pageSize: 10, ...payload })
            const orderStore = yield select((state) => state.statistical.orderStore)
            if (orderStore && orderStore.length) {
                storeArray = orderStore
            } else {
                const store = yield call(statitService.orderStore)
                storeArray = store.data.data
            }
            if (data.error) {
                return message.error(data.mag)
            }
            for (let i = 0, len = data.data.length; i < len; i++) {
                const wang = yield call(statitService.orderWang, { oid: data.data[i].id })
                data.data[i].wang = wang.data.buyer_name
            }
            yield put({
                type: "saveOrder",
                payload: {ordertj: data.sum, lst: data.data, count: Number(data.count), orderStore: storeArray },
            })
        },
        // 添加好友
        * addFriend ({ payload }, { call, put, select }) {
            const { rulelist, addList } = payload
            let weChatList = yield select((state) => state.vertisy.weChatList)
            let deviceIds = weChatList && weChatList.map((item) => item.wxid)
            const { data } = yield call(autoAddService.setAddFriendRule, {deviceIds, ...rulelist })
            if (!data.error) {
                const addInfo = yield call(autoAddService.autoAddFriends, { ...addList })
                if (!addInfo.data.error) {
                    return message.success(addInfo.data.errmsg)
                } else {
                    return message.error(addInfo.data.errmsg)
                }
            } else {
                return message.error(data.errmsg)
            }
        },
        * marketPlan ({payload}, {call, put}) {
            const uniacid = window.sessionStorage.getItem("uniacid")
            let starttime = moment().subtract("days", 7)
                .format("YYYY-MM-DD")
            let endtime = moment().format("YYYY-MM-DD ")
            const {data} = yield call(statitService.marketPlan, {uniacid, starttime, endtime, datetype: "d", ...payload})
            yield put({
                type: "saveMarket",
                payload: { marketChart: data.data },
            })
        },
        * marketTj (_, {call, put}) {
            const uniacid = window.sessionStorage.getItem("uniacid")
            const {data} = yield call(statitService.marketTj, {uniacid})
            yield put({
                type: "saveMarket",
                payload: { marketSum: data.data },
            })
        },
        * marketZTj ({payload}, {call, put, select}) {
            const uniacid = window.sessionStorage.getItem("uniacid")
            const account = yield select((state) => state.statistical.accountList)
            if (!account || !uniacid) {
                return
            }
            let zid = account.map((item) => item.id)
            const {data} = yield call(statitService.marketZTj, {uniacid, zid, ...payload})
            yield put({
                type: "saveMarket",
                payload: { marketList: data.data },
            })
        },
        // 获取子账号
        * fetchZAccount ({ payload }, { call, put, select }) {
            const { data } = yield call(accounService.fetchZAccount)
            yield put({
                type: "saveAccount",
                payload: {
                    accountList: !data.error ? data.data : [],
                },
            })
        },
    },
    subscriptions: {
        setup ({ dispatch, history, query }) {
            return history.listen(async ({ pathname, search, query }) => {
                if (pathname === "/statistical/fan") {
                    dispatch({ type: "friendProvince" })
                    dispatch({ type: "friendGender" })
                    dispatch({ type: "login/addFriendRank" })
                    dispatch({ type: "login/friendNum" })
                }
                if (pathname === "/statistical/message") {
                    dispatch({ type: "msgStatistics" })
                    dispatch({ type: "account/fetchZAccount" })
                    dispatch({ type: "vertisy/fetchWeChatList" })
                }
                if (pathname === "/statistical/order") {
                    await dispatch({ type: "vertisy/fetchWeChatList" })
                    dispatch({ type: "orderStatistics" })
                    dispatch({ type: "autoAdd/fetchUserRule" })
                }
                if (pathname === "/statistical/market") {
                    await dispatch({type: "fetchZAccount"})
                    dispatch({type: "marketPlan"})
                    dispatch({type: "marketTj"})
                    dispatch({type: "marketZTj"})
                }
            })

        },
    },
}
