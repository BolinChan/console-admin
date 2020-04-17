import { testSubstr } from "../utils/helper"
import * as accountService from "../services/account"
import * as statitService from "../services/statistical"
import { routerRedux } from "dva/router"
import { message } from "antd"
import moment from "moment"
import {menuBar} from "../layouts/components/menuList"
const format = "YYYY-MM-DD HH:mm:ss"

export default {
    namespace: "login",
    state: { log: [], rateCount: 0},
    reducers: {
        // savePage(state, { payload }) {
        //     return { ...state, showPage: payload }
        // },
        savelogin (state, { payload: { data} }) {
            return { ...state, auth: data }
        },
        saveLog (state, { payload }) {
            const checkDate = window.localStorage.getItem("checkDate") || ""
            let log = state.log
            return { ...state, log: [...log, ...payload], checkDate }
        },
        checkLog (state) {
            const checkDate = moment(Date.now()).format(format)
            window.localStorage.setItem("checkDate", checkDate)
            return { ...state, checkDate }
        },
        saveData (
            state,
            {
                payload: { friendRank, ranktotal, addFriend, friendNum, circleNum, redRank, friendrate, rateCount, minidata },
            }
        ) {
            // 去重
            if (friendRank) {
                let list = []
                friendRank.map((item) => {
                    if (!list.find((mess) => mess.wxid === item.wxid)) {
                        list.push(item)
                    }
                })
                friendRank = list
            }
            ranktotal = ranktotal || state.ranktotal
            friendRank = friendRank || state.friendRank
            addFriend = addFriend || state.addFriend
            friendNum = friendNum || state.friendNum
            redRank = redRank || state.redRank
            minidata = minidata || state.minidata
            friendrate = friendrate || state.friendrate
            rateCount = rateCount || state.rateCount
            circleNum = circleNum || state.circleNum
            return { ...state, friendRank, ranktotal, addFriend, friendNum, circleNum, redRank, friendrate, minidata, rateCount}
        },
    },
    effects: {
        // 控制显示端
        // * selPage({ payload }, { call, put }) {
        //     yield put({
        //         type: "savePage",
        //         payload,
        //     })
        // },
        // 后台管理登录（主账号）
        * loginPrimary ({ payload }, { call, put }) {
            const { data } = yield call(accountService.loginPrimary, payload)
            if (data.error) {
                return message.error(data.errmsg)
            } else {
                const {id, accountnum, uniacid, token, aid} = data.data
                if (!(!aid || aid === "0")) {window.sessionStorage.setItem("u", aid)}// 子账号获取绑定的公众号
                let pathname = "/home"
                let menuList = menuBar(data.data)
                if (menuList && menuList.length === 0) {
                    return message.error("该账号暂无权限")
                }
                if (menuList && menuList.length > 0) {
                    pathname = menuList[0].childrenNav ? menuList[0].childrenNav[0].pathname : menuList[0].pathname
                }
                window.sessionStorage.setItem("token", token)
                window.sessionStorage.setItem("i", id)
                window.sessionStorage.setItem("user", accountnum)
                window.sessionStorage.setItem("uniacid", uniacid)
                yield put(routerRedux.push({ pathname }))
                yield put({
                    type: "savelogin",
                    payload: data,
                })
            }
        },
        // 验证token
        * isToken ({ payload }, { call, put, select}) {
            const auth = yield select((state) => state.login.auth)
            if (auth) {
                return auth
            }
            const token = window.sessionStorage.getItem("token") || ""
            const id = window.sessionStorage.getItem("i") || ""
            const { data } = yield call(accountService.tokenPrimary, { token, id })
            if (data.error) {
                message.error(data.msg, "验证失败")
                window.location.reload()
                window.sessionStorage.clear()
                return false
            }
            if (data.data) {
                (!data.data.aid || data.data.aid === "0") && (delete data.data.auth)
                yield put({type: "savelogin", payload: data})
                return data.data
            }
        },
        // 退出登录 loginoutZ
        *  exit ({ payload }, { call, put }) {
            const accountnum = window.sessionStorage.getItem("user")
            const id = window.sessionStorage.getItem("i")
            yield call(accountService.loginoutZ, { accountnum, id })
        },
        // 获取更新日志
        * fetchLog ({ payload }, { call, put, select }) {
            let log = yield select((state) => state.login.log)
            if (log && log.length > 0 && !payload) {
                return
            }
            const { data } = yield call(accountService.fetchLog, { type: 1, pagezise: 5, ...payload })
            if (data.error) {
                return
            }
            yield put({ type: "saveLog", payload: data.data })
        },
        // 好友总排行
        * friendRank ({payload}, { call, put, select }) {
            const { data } = yield call(statitService.friendRank, { page: 1, pageSize: 7, ...payload })
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveData",
                payload: {
                    friendRank: data.data,
                    ranktotal: Number(data.total),
                },
            })
        },
        // 好友增量统计
        * addFriendRank (_, { call, put, select }) {
            const addFriend = yield select((state) => state.login.addFriend)
            if (addFriend && addFriend.length > 0) {
                return
            }
            const { data } = yield call(statitService.addFriendRank)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveData",
                payload: {
                    addFriend: data.data,
                },
            })
        },
        // 好友数量走势
        * friendNum (_, { call, put, select }) {
            const friendNum = yield select((state) => state.login.friendNum)
            if (friendNum && friendNum.length > 0) {
                return
            }
            const { data } = yield call(statitService.friendNum)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveData",
                payload: {
                    friendNum: data.data,
                },
            })
        },
        // 朋友圈点赞
        * circlePoint ({payload}, { call, put, select }) {
            const weChatList = yield select((state) => state.vertisy.weChatList)
            if (!weChatList) {
                return
            }
            const { data } = yield call(statitService.circlePoint, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveData",
                payload: {
                    circleNum: data.data,
                },
            })
        },
        // 红包发放统计
        * RedRank ({ payload }, { call, put, select }) {
            const auth = yield select((state) => state.login.auth)
            const uid = auth && auth.uniacid || window.sessionStorage.getItem("uniacid")
            const weChatList = yield select((state) => state.vertisy.weChatList)
            let devicids = weChatList && weChatList.map((item) => item.wxid)
            const { data } = yield call(statitService.RedRank, { uid, devicids, time: payload })
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveData",
                payload: {
                    redRank: data.data,
                },
            })
        },
        // 加好友通过率
        * friendPassRate ({payload}, { call, put, select }) {
            let time = []
            time.push(moment().subtract("days", 15)
                .format("YYYY-MM-DD"))
            time.push(moment().format("YYYY-MM-DD"))
            const { data } = yield call(statitService.friendPassRate, {time, ...payload })
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveData",
                payload: {
                    friendrate: data.data,
                    rateCount: Number(data.count),
                },
            })
        },
        // 每日添加好友通过数量
        * friendStatistics ({payload}, { call, put, select }) {
            let time = []
            time.push(moment().subtract("days", 15)
                .format("YYYY-MM-DD"))
            time.push(moment().format("YYYY-MM-DD"))
            const { data } = yield call(statitService.friendStatistics, { time, ...payload })
            if (data.error) {
                return message.error(data.msg)
            }
            yield put({
                type: "saveData",
                payload: {
                    minidata: data.data,
                },
            })
        },
    },
    subscriptions: {
        setup ({ dispatch, history, query }) {
            return history.listen(async ({ pathname, search, query }) => {
                let token = window.sessionStorage.getItem("token")
                if (!token) {
                    return
                }
                if (testSubstr(pathname, "/")) {
                    let exit = window.sessionStorage.getItem("exit")
                    if (token && !exit) {
                        dispatch({ type: "fetchLog" })
                    }
                }
                if (pathname === "/home") {
                    await dispatch({ type: "vertisy/fetchWeChatList" })
                    await dispatch({ type: "friendRank" })
                    dispatch({ type: "addFriendRank" })
                    dispatch({ type: "friendNum" })
                    dispatch({ type: "RedRank" })
                    dispatch({ type: "friendPassRate" })
                    dispatch({ type: "friendStatistics" })
                    dispatch({ type: "circlePoint" })
                }
            })
        },
    },
}
