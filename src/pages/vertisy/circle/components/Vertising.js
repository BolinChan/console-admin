import { Form, Button, Checkbox, DatePicker, message, Row, Col, Radio, Input, Icon, Popconfirm } from "antd"
import styles from "../../page.css"
import SelectWeChat from "../../../components/SelectWeChats"
import TextAreas from "../../../components/TextArea"
import UploadImg from "../../../components/UploadImg"
import UploadVideo from "../../../components/UploadVideo"
import SelectMerital from "./SelectMerital"
import moment from "moment"
import withRouter from "umi/withRouter"
import { Component } from "react"
const FormItem = Form.Item
const RadioGroup = Radio.Group
class Vertising extends Component {
    state={selectList: false, isLoading: false, commentList: ["index0"]}
    componentDidMount=() => {
        const {share, sharelist, location} = this.props
        if (share) {
            this.selectMaterial(sharelist)
        }
        if (location.query.d) {
            this.retransmission()
        }
    }
    // 重发数据的显示
    retransmission=async () => {
        const {circleList, location, form} = this.props
        let {selectList, commentList, comments} = this.state
        if (location.query.d && circleList) {
            let list = circleList.filter((item) => item.id === location.query.d)[0]
            let {p_type, source, Content} = list
            selectList = {id: location.query.d, text: Content || "", type: "8", media: [], WeChatId: list.WeChatId}
            if (source && source[source.length - 1] === "]") {
                source = source && JSON.parse(source)
                let media = source && source.filter((item) => item)
                selectList.media = media
                p_type !== "2" && (selectList.type = p_type === "3" ? "10" : "9")
            }
            if (list.Comment) {
                comments = list.Comment ? [list.Comment] : []
                list.comments && (comments.push(...list.comments))
                comments.map((item, index) => index > 0 && commentList.push(`index${index}`))
            }
            await form.setFieldsValue({type: selectList.type})
            if (selectList.media && selectList.type === "9") {
                form.setFieldsValue({url: selectList.media[0]})
            }
            this.setState({selectList, commentList, comments})
        }
    }
    handleSubmit = (e) => {
        e.preventDefault()
        const {form, dispatch} = this.props
        const {commentList} = this.state
        form.validateFields(async (err, values) => {
            let {video, url, text, deviceses, imgList, type, fxiedTime, isTrue, during, delete_time, isDelete } = values
            let selectTime = isTrue && new Date(moment(fxiedTime._d).format("YYYY-MM-DD HH:mm:ss")).getTime()
            isTrue = selectTime > new Date().getTime()
            let time = isTrue && selectTime > new Date().getTime() && moment(fxiedTime._d).format("YYYY-MM-DD HH:mm:ss")
            delete_time = isDelete ? moment(delete_time._d).format("YYYY-MM-DD HH:mm:ss") : undefined
            // 多个评论
            let comment = []
            commentList.map((item) => {
                if (values[item] && values[item] !== "") {
                    comment.push(values[item])
                }
            })
            if (!err) {
                if ((!text || text.length <= 0) && (!imgList || imgList && imgList.length <= 0) && type === "8") {
                    return message.error("请输入内容")
                }
                let payload = { during, type, contents: text, deviceIds: deviceses, isTrue: isTrue ? "1" : "0", time, comment, delete_time }
                // 纯文本发送
                if (type !== "9" && imgList && imgList.length <= 0 && text.length > 0) {
                    payload.type = "7"
                }
                // 图文发送
                if (imgList && imgList.length > 0) {
                    payload.imgs = imgList
                }
                if (type === "10") {
                    payload.url = [video]
                }
                if (type === "9") {
                    payload.url = [url]
                }
                commentList.map((item) => {
                    values[item] = ""
                })
                this.setState({isLoading: true})
                let isTrue = await dispatch({ type: "vertisy/sendCircle", payload })
                if (isTrue) {
                    commentList.map((item) => {
                        values[item] = ""
                    })
                    form.setFieldsValue({...values, text: "", type: "8", imgList: [] })
                    this.setState({commentList: ["index0"], selectList: null})
                }
            }
        })
    }
    inputNumFun = (e) => {
        e.target.value = e.target.value.replace(/[^\d]/g, "")
        this.props.form.setFieldsValue({ addNum: e.target.value })
    }
    disabledDate = (current) => current && current <= moment().startOf("day")
    // 选择素材
    selectMaterial = async (item) => {
        const { form } = this.props
        if (item) {
            let type = item.type === "1" ? "8" : (item.type === "2" ? "10" : "9")
            await form.setFieldsValue({text: item.text, type})
            type === "9" && item.media && (form.setFieldsValue({url: item.media[0]}))
            this.setState({ selectList: {...item, id: Math.random() * 10, type}})
        }
    }
    // 添加评论区
    addCommentArea=() => {
        let {commentList} = this.state
        let len = commentList.length
        if (len === 0 || this.props.form.getFieldValue(commentList[len - 1])) {
            commentList.push(`index${len}`)
            this.setState({commentList})
        } else {
            message.error("已有空白的评论区")
        }
    }
    // 删除评论
    delContent=(index) => {
        let {commentList} = this.state
        commentList.splice(index, 1)
        this.setState({commentList})
    }
    render () {
        const { form, weChatList, loading, share} = this.props
        let {selectList, isLoading, commentList, comments} = this.state
        const { getFieldDecorator, getFieldValue } = form
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 19 },
        }
        let initValue = selectList && selectList.WeChatId && [selectList.WeChatId]
        let type = getFieldValue("type")
        return (
            <Row>
                <Col className={share ? "pad10" : "pad20"}>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem {...formItemLayout} label="选择微信：">
                            {getFieldDecorator("deviceses",
                                { rules: [{ required: true, message: "请选择微信!" }] })(<SelectWeChat data={weChatList} initValue={initValue} direction="vertical" isDevicename={true}/>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="分享内容" style={{ margin: 0 }}>
                            {getFieldDecorator("type", { initialValue: "8" })(
                                <RadioGroup onChange={this.radioType}>
                                    <Radio value="8">图文</Radio>
                                    <Radio value="10">视频</Radio>
                                    <Radio value="9" >链接</Radio>
                                    {!share && <SelectMerital {...this.props} selectMaterial={this.selectMaterial}> </SelectMerital>}
                                </RadioGroup>
                            )}
                        </FormItem>
                        {getFieldValue("type") === "8" && (
                            <FormItem {...formItemLayout} label=" " colon={false}>
                                {getFieldDecorator("imgList", { initialValue: [] })(<UploadImg uploadMaxNum={9} selectList={selectList} uploadNum={this.uploadNum} />)}
                            </FormItem>
                        )}
                        {type === "9" && <FormItem label=" " colon={false} {...formItemLayout}>
                            <FormItem style={{ margin: 0 }}>
                                {getFieldDecorator("url")(<Input style={{width: "100%"}} autoComplete="off" placeholder="请输入链接" />)}
                            </FormItem>
                        </FormItem>}
                        {type === "10" && (
                            <FormItem {...formItemLayout} label=" " colon={false} >
                                {getFieldDecorator("video", {initialValue: []})(<UploadVideo selectList={selectList} />)}
                            </FormItem>
                        )}
                        <FormItem {...formItemLayout} label="文案内容：">
                            {getFieldDecorator("text", { initialValue: selectList && selectList.text || "" })(<TextAreas placeholder="输入 #随机表情# 将随机添加系统表情，保证微信内容不重复，降低封号几率。" isRandom={true}/>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="添加评论：">
                            {/* {getFieldDecorator("comment")(<TextAreas />)} */}
                            {commentList.map((item, index) => <FormItem key={item} style={{ marginBottom: 10 }}>
                                {getFieldDecorator(item, {initialValue: comments && comments[index] || ""})(<TextAreas id={index}/>)}
                                <Popconfirm title="确定要删除吗?" onConfirm={() => this.delContent(index)}>
                                    <a style={{color: "#f5222d"}} className={styles.del}><Icon type="delete" /> 删除该评论</a>
                                </Popconfirm>
                            </FormItem>)}
                            <a onClick={this.addCommentArea}><Icon type="plus-circle" style={{fontSize: "16px"}}/>&nbsp;添加评论区</a>
                        </FormItem>
                        <FormItem {...formItemLayout} label="设备间隔时间：" >
                            {getFieldDecorator("during", { initialValue: "2" })(
                                <Input style={{ width: "200px" }} addonAfter="分钟" type="number" min="0" onInput={this.inputNumFun} />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="开启定时任务:" >
                            <Col span={1}>
                                <FormItem>{getFieldDecorator("isTrue")(<Checkbox/>)}</FormItem>
                            </Col>
                            <Col span={20}>
                                {getFieldValue("isTrue") && (
                                    <FormItem>
                                        {getFieldDecorator("fxiedTime", { initialValue: moment() })(
                                            <DatePicker format="YYYY-MM-DD HH:mm" allowClear={false} disabledDate={this.disabledDate} dropdownClassName={styles.popupStyle} showTime />
                                        )}
                                        <span className={styles.prompt}>选择的时间小于当前时间则立刻执行</span>
                                    </FormItem>
                                )}
                            </Col>
                        </FormItem>
                        <FormItem {...formItemLayout} label="选择删除时间:" >
                            <Col span={1}>
                                <FormItem>{getFieldDecorator("isDelete")(<Checkbox />)}</FormItem>
                            </Col>
                            <Col span={20}>
                                {getFieldValue("isDelete") && (
                                    <FormItem>
                                        {getFieldDecorator("delete_time", { initialValue: moment().add(1, "days") })(
                                            <DatePicker format="YYYY-MM-DD HH:mm" allowClear={false} disabledDate={this.disabledDate} dropdownClassName={styles.popupStyle} showTime />
                                        )}
                                        <span className={styles.prompt}>到达时间后，自动删除这条朋友圈</span>
                                    </FormItem>
                                )}
                            </Col>
                        </FormItem>
                        <FormItem {...formItemLayout} label=" " colon={false}>
                            <Button type="primary" htmlType="submit" loading={isLoading && loading}>
                            提交
                            </Button>
                        </FormItem>

                    </Form>
                </Col>
            </Row>
        )
    }

}
const VertisingDemo = Form.create()(Vertising)
export default withRouter(VertisingDemo)

// export default VertisingDemo
