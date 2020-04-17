import { Form, Input, DatePicker, Button, Avatar, Popconfirm } from "antd"
import Draggable from "react-draggable"
import { Component } from "react"
import { CirclePicker } from "react-color"
import moment from "moment"
import UploadImg from "../../../components/UploadImg"
import styles from "../../page.css"
const TextArea = Input.TextArea
const { RangePicker } = DatePicker
const FormItem = Form.Item

const handlePreview = (url) => {
    let ImgObj = new Image() // 判断图片是否存在
    ImgObj.src = url
    // 设置图片适应
    let height = Math.floor(ImgObj.height * 0.6) + "px"
    let width = Math.floor(ImgObj.width * 0.6) + "px"
    return {width, height}
}
const replaceFun = (record, text) => {
    let list = record.content && record.content.find((item) => item.type === text)
    if (!list) {
        return
    }
    let defaultV = {left: `${list.left}px`, top: `${list.top}px`, color: list.color ? list.color : ""}
    return defaultV
}


class AddPoster extends Component {
    state = {imgUrl: undefined,
        color: undefined,
        contentList: [{type: "qr", top: 0, left: 0, width: "80px",
            height: "80px"}, {type: "name", top: 0, left: 0, width: "50px",
            height: "50px"}, {type: "img", top: 0, left: 0, width: "50px",
            height: "50px"}]}
    UNSAFE_componentWillMount=() => {
        if (this.props.id) {
            this.setState({eidtnick: true, eidtheard: true, eidtqrcode: true, replaceQr: false, replaceimg: false, replacenick: false })
        }
    }
    handleChangeComplete = (color) => {
        this.setState({ color: color.hex })
    }
    handleOk = (e) => {
        const { form, record, op } = this.props
        const {contentList, replaceQr, replaceimg, replacenick, color} = this.state
        form.validateFields((err, values) => {
            if (!err) {
                let { actTime } = values
                values.firstHint = " "
                let s_time = moment(actTime[0]._d).format("YYYY-MM-DD HH:mm:ss")
                let e_time = moment(actTime[1]._d).format("YYYY-MM-DD HH:mm:ss")
                values.actTime = { start: s_time, end: e_time }
                values.bg = values.bg[0]
                let oldContent = record && record.content
                let newContent = []
                // 从当前位置为坐标的起始点，原位置➕移动的位置
                oldContent && oldContent.map((item) => {
                    if (item.type) {
                        let index = contentList.findIndex((mess) => mess.type === item.type)
                        if (index !== -1) {
                            item.top = contentList[index].top + item.top
                            item.left = contentList[index].left + item.left
                            if (item.type === "name") {
                                item.color = color || item.color || "#000"
                            }
                            newContent.push(item)
                        }
                    }
                })
                values.content = newContent.length !== 0 && newContent || contentList
                // 重置位置
                if (replaceQr && replaceQr) {
                    let index = values.content.findIndex((item) => item.type === "qr")
                    index !== -1 && (values.content[index] = contentList[0])
                }
                if (replacenick && replacenick) {
                    let index = values.content.findIndex((item) => item.type === "name")
                    index !== -1 && (values.content[index] = contentList[1])
                }
                if (replaceimg && replaceimg) {
                    let index = values.content.findIndex((item) => item.type === "img")
                    index !== -1 && (values.content[index] = contentList[2])
                }
                if (values.bg === "b" && record) {
                    values.bg = record.bg
                }
                this.props.dispatch({
                    type: "fission/uptatePoster",
                    payload: { ...values, id: record && record.id, op },
                })
            }
        })
    }

    qrcodeFun = () => {
        const {eidtqrcode} = this.state
        if (eidtqrcode) {
            this.setState({replaceQr: true})
        }
        this.setState({ eidtqrcode: !eidtqrcode })
    }
    heardImgFun = () => {
        const {eidtheard} = this.state
        if (eidtheard) {
            this.setState({replaceimg: true})
        }
        this.setState({ eidtheard: !eidtheard })
    }
    nickFun = () => {
        const {eidtnick} = this.state
        if (eidtnick) {
            this.setState({replacenick: true})
        }
        this.setState({ eidtnick: !eidtnick })
    }
    handleStop = (type) => (e, item) => {
        let {contentList, color} = this.state
        let list = {type, top: item.y, left: item.x, width: "50px",
            height: "50px"}
        if (type === "qr") {
            contentList[0] = list
        }
        if (type === "name") {
            contentList[1] = {...list, color: color || "#000"}
        }
        if (type === "img") {
            contentList[2] = list
        }
        this.setState({contentList})

    }
    handlePreview=(fileList) => {
        this.setState({imgUrl: fileList[0] && fileList[0].thumbUrl})
    }
    render () {
        const { form, record, loading} = this.props
        const { getFieldDecorator } = form
        const { eidtqrcode, eidtheard, eidtnick, imgUrl, replaceQr, replacenick, replaceimg} = this.state
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 17 },
        }
        let defaultQr = !replaceQr && record && replaceFun(record, "qr")
        let defaultNick = !replacenick && record && replaceFun(record, "name")
        let defaultImg = !replaceimg && record && replaceFun(record, "img")
        let imgStyle = handlePreview(imgUrl || record && record.bg)
        return (
            <span>
                <Form>
                    <div title="第一步">
                        <FormItem {...formItemLayout} label="海报名称">
                            {getFieldDecorator("actName", { initialValue: record && record.actName, rules: [{ required: true, message: "请输入海报名称" }] })(<Input autoComplete="off" placeholder="请输入海报名称"/>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="活动时间">
                            {getFieldDecorator("actTime",
                                { initialValue: record && [moment(new Date(record.actTimeStart * 1000)),
                                    moment(new Date(record.actTimeEnd * 1000))], rules: [{ required: true, message: "请选择时间" }] })(<RangePicker format="YYYY-MM-DD HH:mm:ss" showTime />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="触发活动的关键词">
                            {getFieldDecorator("keyword", { initialValue: record && record.keyword })(<Input placeholder="请输入关键词" />)}
                        </FormItem>
                    </div>
                    <div title="第二步">
                        <FormItem {...formItemLayout} label="活动未开始提示语">
                            {getFieldDecorator("notStartHint", { initialValue: record && record.notStartHint, rules: [{ required: true, message: "请输入提示语" }] })(<TextArea placeholder="请输入提示语" autosize={{ minRows: 4 }} />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="活动结束提示语">
                            {getFieldDecorator("endHint", { initialValue: record && record.endHint, rules: [{ required: true, message: "请输入提示语" }] })(<TextArea placeholder="请输入提示语" autosize={{ minRows: 4 }} />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="活动暂停提示语">
                            {getFieldDecorator("pauseHint", { initialValue: record && record.pauseHint, rules: [{ required: true, message: "请输入提示语" }] })(<TextArea placeholder="请输入提示语" autosize={{ minRows: 4 }} />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="首次生成海报提示">
                            {getFieldDecorator("firstPicHint", { initialValue: record && record.firstPicHint, rules: [{ required: true, message: "请输入提示" }] })(<TextArea placeholder="请输入提示语" autosize={{ minRows: 4 }} />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="新会员提示语">
                            {getFieldDecorator("newMemberHint",
                                { initialValue: record && record.newMemberHint})(<TextArea placeholder="请输入提示语" autosize={{ minRows: 4 }} />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="任务完成提示语">
                            {getFieldDecorator("actOverHint", { initialValue: record && record.actOverHint, rules: [{ required: true, message: "请输入提示" }] })(<TextArea placeholder="请输入提示语" autosize={{ minRows: 4 }} />)}
                        </FormItem>
                    </div>
                    <div title="第四步">
                        <FormItem {...formItemLayout} label="海报背景图" extra="海报背景大小建议尺寸为: 640 * 1000">
                            {!record && getFieldDecorator("bg", { rules: [{ required: true, message: "请输入背景图片" }] })(<UploadImg uploadMaxNum={1} handlePreview={this.handlePreview}/>)}
                            {record && !loading && getFieldDecorator("bg",
                                {initialValue: record && "b", rules: [{ required: true, message: "请输入背景图片" }] })(<UploadImg defaultImgUrl={[record.bg]} uploadMaxNum={1} handlePreview={this.handlePreview}/>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label=" " colon={false}>
                            <Button onClick={this.qrcodeFun} type="primary" className="mr10">二维码</Button>
                            <Button onClick={this.heardImgFun} type="primary" className="mr10">头像</Button>
                            <Button onClick={this.nickFun} type="primary">昵称</Button>
                        </FormItem>
                        <FormItem {...formItemLayout} label=" " colon={false}>
                            <div className={styles.imgBox}
                                style={{...imgStyle, border: (record && record.bg || imgUrl) ? "" : "1px solid #ccc",
                                    background: `url("${record && record.bg || imgUrl}") 0% 0% / ${imgStyle.width} no-repeat`}}>
                                {eidtnick &&
                                    <Draggable handle=".nick" onStop={this.handleStop("name")}>
                                        <div className="nick" style={{ height: "45px", ...defaultNick}}>
                                            <Popconfirm
                                                placement="top"
                                                // title="选择颜色"
                                                style={{ paddingLeft: 0 }}
                                                icon=""
                                                title={<CirclePicker color={this.state.color || this.props.color} width={300} onChangeComplete={this.handleChangeComplete} />}
                                            >
                                                <span className={styles.nickName} title="点击设置昵称颜色" style={{ color: this.state.color || this.props.color }}>昵称</span>
                                            </Popconfirm>
                                        </div>
                                    </Draggable>
                                }
                                {eidtheard &&
                                    <Draggable handle=".header" onStop={this.handleStop("img")} >
                                        <div className="header" style={defaultImg}><Avatar shape="square" size={64} icon="user" /></div>
                                    </Draggable>
                                }
                                {eidtqrcode &&
                                    <Draggable handle=".qr" onStop={this.handleStop("qr")} onDrag={this.onDrag} >
                                        <div className="qr" style={defaultQr}>
                                            {/* <Avatar shape="square" size={100} icon="user" src={qrImg}/> */}
                                            <div className={styles.qrbac}></div>
                                        </div>
                                    </Draggable>
                                }
                            </div>
                        </FormItem>
                        <div className={styles.formboot}>
                            <Button type="primary" onClick={this.handleOk} >
                                确定
                            </Button>
                            <Button type="" onCancel={this.handleCancel}>取消</Button>
                        </div>
                    </div>
                </Form>
            </span>
        )
    }
}
const setForm = Form.create()(AddPoster)
export default setForm
