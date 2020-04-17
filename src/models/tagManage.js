import { testSubstr } from "../utils/helper"
import * as tagService from "../services/tagManage"
import { message } from "antd"
let Intags
// let Inlabel
let tagspage = 0
export default {
    namespace: "tagManage",
    state: {
        tags: [],
        weChatlabel: [],
        alltags: [],
        TagGroup: [],
        labelpage: 0,
    },
    reducers: {
        saveTagsGrop (
            state,
            {
                payload: { data },
            }
        ) {
            return { ...state, TagGroup: data.data }
        },
        saveTagWord (
            state,
            {
                payload: { data, tagstotal },
            }
        ) {
            let alltags = state.alltags
            if (data) {
                data.map((item) => {
                    if (!(alltags.find((me) => me.id === item.id))) {
                        alltags.push(item)
                    }
                })
            }
            return { ...state, tags: data, tagstotal, alltags }
        },
        editTagGroup (state, { payload }) {
            let TagGroup = state.TagGroup.slice(0)
            const index = TagGroup.findIndex((item) => item.id === payload.id)
            TagGroup[index] = { ...TagGroup[index], ...payload }
            return { ...state, TagGroup }
        },
        delTagGroup (state, { payload }) {
            let TagGroup = state.TagGroup.slice(0)
            TagGroup.splice(TagGroup.findIndex((item) => item.id === payload.id), 1)
            return { ...state, TagGroup }
        },
        editTagWord (state, { payload }) {
            let tags = state.tags.slice(0)
            let index = tags.findIndex((item) => item.id === payload.id)
            tags[index] = { ...tags[index], ...payload }
            return { ...state, tags }
        },
        delTagWord (state, { payload }) {
            let tags = state.tags.slice(0)
            tags.splice(tags.findIndex((item) => item.id === payload.id), 1)
            return { ...state, tags }
        },
        saveStatus (state, { payload: { isweb, id } }) {
            let tags = state.tags.slice(0)
            tags.map((item) => {
                let index = id.findIndex((mess) => mess === item.id)
                if (index !== -1) {
                    item.is_web = isweb
                }
            })
            return { ...state, tags }
        },
        saveWeChatlabel (
            state,
            {
                payload: { data, count, page, tagname },
            }
        ) {
            let weChatlabel = state.weChatlabel
            if (data) {
                data.map((item) => {
                    if (!(weChatlabel.find((me) => me.tagname === item.tagname))) {
                        weChatlabel.push(item)
                    }
                })
            }
            return { ...state, weChatlabel, labeltotal: Number(count), labelpage: page }
        },
    },
    effects: {
        // 获取微信上的标签
        * fetchWeChatlabel ({ payload }, { call, put, select }) {
            // let page = yield select((state) => state.tagManage.labelpage)
            // const total = yield select((state) => state.tagManage.labeltotal)
            // const weChatlabel = yield select((state) => state.tagManage.weChatlabel)
            // if ((page > total / 100) || (total === weChatlabel.length)) {
            //     clearInterval(Inlabel)
            //     return
            // }
            const { data } = yield call(tagService.fetchWeChatlabel, payload)
            if (data.error) {
                return
            }
            if (payload) {
                data.tagname = payload.tagname
            }
            yield put({
                type: "saveWeChatlabel",
                payload: data,
            })
        },
        // 获取标签组
        * getTagsGrop ({ payload }, { call, put }) {
            const { data } = yield call(tagService.getTagsGrop, payload)
            if (data.error) {
                return
            }
            yield put({
                type: "saveTagsGrop",
                payload: { data },
            })
            return data.data
        },
        // 新增标签组
        * addTagsGrop ({ payload }, { call, put, select }) {
            const { data } = yield call(tagService.addTagsGrop, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "getTagsGrop",
            })
        },
        // 修改标签组
        * editTagsGrop ({ payload }, { call, put }) {
            const { data } = yield call(tagService.editTagsGrop, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "editTagGroup",
                payload,
            })
            message.success("修改成功")
        },
        // 删除标签组
        * delTagsGrop ({ payload }, { call, put }) {
            const { data } = yield call(tagService.delTagsGrop, payload)
            if (data.error) {
                message.error(data.errmsg)
                return false
            }
            yield put({
                type: "delTagGroup",
                payload,
            })
            message.success("删除成功")
            return true
        },
        // 获取标签，标签管理页
        * getDevTags ({ payload }, { call, put, select }) {
            let { data } = yield call(tagService.getDevTags, payload)
            yield put({
                type: "saveTagWord",
                payload: { data: data.error ? [] : data.data, tagstotal: data.total ? Number(data.total) : 0},
            })
            return data = data.error ? [] : data.data
        },
        // 添加标签
        * createDevTags ({ payload }, { call, put }) {
            const { data } = yield call(tagService.createDevTags, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "getDevTags",
            })
            message.success("添加成功")
        },
        // 修改标签
        * editDevTags ({ payload }, { call, put }) {
            const { data } = yield call(tagService.editDevTags, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "editTagWord",
                payload,
            })
            message.success("修改成功")
        },
        // 删除标签
        * deleteDevTags ({ payload }, { call, put }) {
            const { data } = yield call(tagService.deleteDevTags, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            message.success("删除成功")
            yield put({
                type: "delTagWord",
                payload,
            })
        },
        // 编辑标签状态
        * editStatus ({ payload }, { call, put }) {
            const { data } = yield call(tagService.editStatus, payload)
            if (data.error) {
                return message.error(data.msg)
            }
            yield put({
                type: "saveStatus",
                payload,
            })
        },
        * getTags ({ payload }, { call, put, select }) {
            let tagstotal = yield select((state) => state.tagManage.tagstotal)
            tagspage++
            payload = {page: tagspage, ispage: 1, pageSize: 100 }
            if ((tagspage > tagstotal / 100 + 1)) {
                clearInterval(Intags)
                return
            }
            yield put({type: "getDevTags", payload })
        },
    },
    subscriptions: {
        setup ({ dispatch, history, query }) {
            return history.listen(async ({ pathname, search, query }) => {
                if (testSubstr(pathname, "/tagManage")) {
                    // dispatch({type: "getTagsGrop"})
                    dispatch({ type: "getDevTags" })
                }
                if (pathname === "/wechat/friendsList") {
                    await dispatch({ type: "getDevTags" })
                    dispatch({type: "fetchWeChatlabel"})
                    // Inlabel = setInterval(() => dispatch({type: "fetchWeChatlabel"}), 1000)
                    return
                }
                if (pathname === "/fsend/groupSend" || pathname === "/autoadd/autofriend") {
                    Intags = setInterval(() => dispatch({ type: "getTags" }), 1000)
                    return
                } else {
                    // clearInterval(Inlabel)
                    clearInterval(Intags)
                }
            })
        },
    },
}
