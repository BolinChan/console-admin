
import * as chatService from "../services/service"
export default {
    namespace: "operation",
    state: { redPageList: [] },
    reducers: {
        saveOperation (
            state,
            {
                payload: { operationList },
            }
        ) {
            return { ...state, operationList }
        },
        saveRedPage (
            state,
            {
                payload: { data },
            }
        ) {
            return { ...state, redPageList: data }
        },
    },
    effects: {
        // 获取操作记录(搜索)
        * fetchOperation ({ payload }, { call, put }) {
            const { data } = yield call(chatService.fetchOperation, { puser_id: window.sessionStorage.getItem("i"), ...payload })
            yield put({
                type: "saveOperation",
                payload: {
                    operationList: data.data,
                },
            })
        },

        // 红包
        * fetchRedpackage ({ payload }, { call, put }) {
            const uid = window.sessionStorage.getItem("uniacid")
            if (!uid || uid === "") {
                return
            }

            const { data } = yield call(chatService.redpackage, { uid, ...payload })
            yield put({
                type: "saveRedPage",
                payload: { data },
            })
        },
        // 红包最大金额获取
        * RedSetting ({ payload }, { call, put }) {
            const aid = window.sessionStorage.getItem("i")
            const { data } = yield call(chatService.RedSetting, { uid: aid, ...payload })
            yield put({
                type: "saveMax",
                payload: { data },
            })
        },
    },
    subscriptions: {
        setup ({ dispatch, history, query }) {
            return history.listen(async ({ pathname, search, query }) => {
                if (pathname === "/operation") {
                    await dispatch({ type: "fetchOperation"})
                }
                if (pathname === "/redpackage") {
                    dispatch({ type: "fetchRedpackage" })
                }
            })
        },
    },
}
