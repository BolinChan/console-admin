import { testSubstr } from "../utils/helper"
import * as fissionService from "../services/fission"
import { message } from "antd"
export default {
    namespace: "fission",
    state: {
    },
    reducers: {
        savePoster (
            state,
            {
                payload: { data },
            }
        ) {
            return { ...state, posterList: data.list, posterTotal: Number(data.total), pageNo: Number(data.pageNo) }
        },
        posterDelete (
            state,
            {
                payload: { id },
            }
        ) {
            let posterList = state.posterList
            let posterTotal = state.posterTotal
            let pageNo = state.pageNo
            posterList = posterList.filter((item) => item.id !== id)
            return { ...state, posterList, posterTotal: posterTotal - 1, pageNo }
        },
        saveDetail (
            state,
            {
                payload: { data },
            }
        ) {
            return { ...state, posterDetail: data }
        },
        saveQrcodeList (
            state,
            {
                payload: { data },
            }
        ) {
            return { ...state, posterqrcode: data.list }
        },
        saveStatus (
            state,
            {
                payload: { id, status },
            }
        ) {
            let posterList = state.posterList
            let index = posterList.findIndex((item) => item.id === id)
            posterList[index].status = status
            return { ...state, posterList }
        },
        saveFiss (
            state,
            {
                payload: { data },
            }
        ) {
            return { ...state, fissLst: data }
        },
        saveQrcodeLst (state, { payload }) {

            return { ...state, qrcodeLst: payload.data, qrcodeTotal: payload.total }
        },
        fetchQrcodeTree (state, { payload }) {
            let r = []
            let tmpMap = {}
            let treeArray = payload.data
            for (let i = 0, l = treeArray.length; i < l; i++) {
                tmpMap[treeArray[i].nickname] = treeArray[i]
            }
            for (let j = 0, len = treeArray.length; j < len; j++) {
                var key = tmpMap[treeArray[j].fromnick]
                if (key) {
                    if (!key.children) {
                        key.children = []
                        key.children.push(treeArray[j])
                    } else {
                        key.children.push(treeArray[j])
                    }
                } else {
                    r.push(treeArray[j])
                }
            }

            return { ...state, qrcodeTree: r }
        },
        Unmount (state, { payload }) {
            return { ...state, qrcodeTree: [] }
        },
        saveTime (state, { payload }) {
            let list = payload || []
            if (list.length) {
                list.map((item) => {
                    item.time = item.time.join("~")
                })
            }
            return { ...state, timeLst: payload }
        },
    },
    effects: {
        // 获取海报活动列表
        * fetchPoster ({ payload }, { call, put, select }) {
            let posterList = yield select((state) => state.fission.posterList)
            if (!payload && posterList && posterList.length > 0) {
                return
            }
            const { data } = yield call(fissionService.fetchPoster, payload)
            if (data.error) {
                return
            }
            yield put({
                type: "savePoster",
                payload: {
                    data: data.data,
                },
            })
        },
        * uptatePoster ({ payload }, { call, put }) {
            const { data } = yield call(fissionService.uptatePoster, payload)
            if (data.error) {
                return message.error(data.errMsg)
            }
            yield put({
                type: "fetchPoster",
                payload: { add: "add" },
            })
            message.success(payload.op ? "海报设置成功" : "海报添加成功")
        },
        // 删除海报
        * posterDelete ({ payload }, { call, put }) {
            const { data } = yield call(fissionService.posterDelete, payload)
            if (data.error) {
                return message.error(data.errMsg)
            }
            yield put({
                type: "delPoster",
                payload,
            })
        },
        * fetchDetail ({ payload }, { call, put }) {
            const { data } = yield call(fissionService.fetchDetail, payload)
            if (data.error) {
                return
            }
            yield put({
                type: "saveDetail",
                payload: {
                    data: data.data,
                },
            })
        },
        * posterQrcodeSet ({ payload }, { call, put }) {
            const { data } = yield call(fissionService.posterQrcodeSet, payload)
            if (data.error) {
                return message.error(data.errMsg)
            }
            message.success("设置成功")
        },
        // 获取海报活码列表
        * posterQrcodeList ({ payload }, { call, put }) {
            const { data } = yield call(fissionService.posterQrcodeList, payload)
            if (data.error) {
                return
            }
            yield put({
                type: "saveQrcodeList",
                payload: {
                    data: data.data,
                },
            })
        },
        // 更新海报活动状态
        * posterStatusSet ({ payload }, { call, put }) {
            const { data } = yield call(fissionService.posterStatusSet, payload)
            if (data.error) {
                return message.error(data.errMsg)
            }
            yield put({
                type: "saveStatus",
                payload,
            })
            message.success("设置成功")
        },
        // 查询任务奖品
        * getprize ({ payload }, { call, put }) {
            const { data } = yield call(fissionService.getprize, payload)
            if (data.error) {
                return
            }
            yield put({
                type: "savePrizeList",
                payload: {
                    data: data.data,
                },
            })
        },
        // 添加任务奖品
        * addprize ({ payload }, { call, put }) {
            const { data } = yield call(fissionService.addprize, payload)
            if (data.error) {
                return
            }
            yield put({
                type: "savePrizeList",
                payload: {
                    data: data.data,
                },
            })
        },
        // 修改任务奖品
        * editprize ({ payload }, { call, put }) {
            const { data } = yield call(fissionService.editprize, payload)
            if (data.error) {
                return
            }
            yield put({
                type: "savePrizeList",
                payload: {
                    data: data.data,
                },
            })
        },
        * getFissPosterCount ({ payload }, { call, put }) {
            const { data } = yield call(fissionService.getFissPosterCount, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveFiss",
                payload: {
                    data: data.data,
                },
            })
        },
        * getAllSaomaList ({ payload }, { call, put }) {
            const { data } = yield call(fissionService.getAllSaomaList, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveQrcodeLst",
                payload: {
                    data: data.data,
                    total: Number(data.total),
                },
            })
        },
        * getQrcodeTree ({ payload }, { call, put }) {
            let list = []
            let page = 1
            const { data } = yield call(fissionService.getAllSaomaList, { status: 1, ...payload })
            if (data.error) {
                return message.error(data.errmsg)
            }
            let total = Number(data.total)
            list = data.data
            if (total > list.length) {
                for (let i = 0; i < Math.floor(total / 20); i++) {
                    page = page + 1
                    let idata = yield call(fissionService.getAllSaomaList, { status: 1, page, ...payload })
                    list = list.concat(idata.data.data)
                }
            }
            yield put({
                type: "fetchQrcodeTree",
                payload: {
                    data: list,
                },
            })
        },

        * getTimeTotal ({ payload }, { call, put }) {
            const { data } = yield call(fissionService.getTimeTotal, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveTime",
                payload: data.data,
            })
        },
    },
    subscriptions: {
        setup ({ dispatch, history, query }) {
            return history.listen(async ({ pathname, search, query }) => {
                if (testSubstr(pathname, "/fission")) {
                    dispatch({ type: "fetchPoster" })
                }
            })
        },
    },
}
