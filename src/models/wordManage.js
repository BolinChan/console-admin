import { testSubstr } from "../utils/helper"
import * as wordManage from "../services/wordManage"
import { message } from "antd"
export default {
    namespace: "wordManage",
    state: {
        addKeyReply: [],
        hsGroup: [],
        hsWord: [],
    },
    reducers: {
        saveHsGroup (
            state,
            {
                payload: { data },
            }
        ) {
            return { ...state, hsGroup: data.data }
        },
        saveHsWord (
            state,
            {
                payload: { data },
            }
        ) {
            return { ...state, hsWord: data }
        },
        editHsGroup (state, { payload }) {
            let hsGroup = state.hsGroup.slice(0)
            const index = hsGroup.findIndex((item) => item.groupId === payload.groupId)
            hsGroup[index] = { ...hsGroup[index], name: payload.nameGroup, deviceids: JSON.stringify(payload.deviceIds) }
            return { ...state, hsGroup }
        },
        delHsGroup (state, { payload }) {
            let hsGroup = state.hsGroup.slice(0)
            hsGroup.splice(hsGroup.findIndex((item) => item.groupId === payload.groupId), 1)
            return { ...state, hsGroup }
        },
        editMsgs (state, { payload }) {
            let hsWord = state.hsWord.slice(0)
            let index = hsWord.findIndex((item) => item.id === payload.text_id && item.groupId === payload.groupId)
            hsWord[index] = { ...hsWord[index], ...payload }
            return { ...state, hsWord }
        },
        delMsgs (state, { payload }) {
            let hsWord = state.hsWord.slice(0)
            hsWord.splice(hsWord.findIndex((item) => item.id === payload.text_id), 1)
            return { ...state, hsWord }
        },
    },
    effects: {
        * groupSort ({ payload }, { call, put }) {
            yield call(wordManage.groupSort, { ...payload })
        },
        // 获取话术组
        * fetchHsGroup ({ payload }, { call, put }) {
            const { data } = yield call(wordManage.getHsGroup, { isgroup: 1, hsgroup_type: "2", ...payload })
            if (data.error) {
                return
            }
            yield put({
                type: "saveHsGroup",
                payload: { data },
            })
        },
        // 新增话术组
        * addGroup ({ payload }, { call, put, select }) {
            const { data } = yield call(wordManage.addHsGroup, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "fetchHsGroup",
                payload: {hsgroup_type: payload.hsgroup_type},
            })
            message.success("添加成功")
        },
        // 修改话术组
        * editGroup ({ payload }, { call, put }) {
            const { data } = yield call(wordManage.editHsGroup, payload)
            if (data.error) {
                return message.error(data.errmsg.errmsg || data.errmsg)
            }
            yield put({
                type: "editHsGroup",
                payload,
            })
            message.success("修改成功")
        },
        // 删除话术组
        * delGroup ({ payload }, { call, put }) {
            const { data } = yield call(wordManage.delHsGroup, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "delHsGroup",
                payload,
            })
            message.success("删除成功")
        },
        // 获取话术语
        * fetchHsWord ({ payload }, { call, put, select }) {
            let { data } = yield call(wordManage.getMsg, { hsgroup_type: "2", ...payload })
            yield put({
                type: "saveHsWord",
                payload: { data: data.error ? [] : data.data },
            })
        },
        // 添加快捷语
        * addMsg ({ payload }, { call, put }) {
            const { data } = yield call(wordManage.addMsg, payload)
            if (data.error) {
                message.error(data.errmsg)
                return false
            }
            // yield put({
            //     type: "fetchHsWord",
            //     payload: { groupId: payload.groupId },
            // })
            message.success("添加成功")
            return true
        },
        // 修改快捷语
        * editMsg ({ payload }, { call, put }) {
            const { data } = yield call(wordManage.editMsg, payload)
            if (data.error) {
                message.error(data.errmsg)
                return false
            }
            yield put({
                type: "editMsgs",
                payload,
            })
            message.success("修改成功")
            return true
        },
        // 修改快捷语
        * delMsg ({ payload }, { call, put }) {
            const { data } = yield call(wordManage.delMsg, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            message.success("删除成功")
            yield put({
                type: "delMsgs",
                payload,
            })
        },
        // 置顶
        * groupUptop ({ payload }, { call, put }) {
            const { data } = yield call(wordManage.groupUptop, payload)
            if (!data.error) {
                const getMsg = yield call(wordManage.getMsg, { hsgroup_type: "2", groupId: payload.gid })
                yield put({
                    type: "saveHsWord",
                    payload: { data: getMsg.data.error ? [] : getMsg.data.data },
                })
            } else {
                return message.error(data.errmsg)
            }
        },
    },
    subscriptions: {
        setup ({ dispatch, history, query }) {
            return history.listen(async ({ pathname, search, query }) => {
                if (testSubstr(pathname, "/wordManage")) {
                    // dispatch({ type: "fetchHsGroup" })
                }
            })
        },
    },
}
