import { Form, Button, Popconfirm, Radio, Icon} from "antd"
import { Component } from "react"
import { CirclePicker } from "react-color"
import UploadImg from "../../../components/UploadImg"
import DragScale from "./DragScale"
import styles from "../../page.css"
const FormItem = Form.Item
const RadioGroup = Radio.Group
const replaceFun = (record, text) => {
    let list = record.content && record.content.find((item) => item.type === text)
    if (!list) {
        return
    }
    let defaultV = {left: `${list.left}px`, top: `${list.top}px`, color: list.color ? list.color : "", width: list.width, height: list.height}
    return defaultV
}
class AddPoster extends Component {
    state = {
        imgUrl: undefined,
        contentList: [],
        imgStyle: {width: 0, height: 0},
    }
    UNSAFE_componentWillMount=() => {
        let {contentList} = this.state
        const {record} = this.props
        if (record && record.content && contentList.length === 0) {
            contentList = record.content
        }
        if (contentList.length > 0) {
            let eidtnick = contentList.findIndex((item) => item.type === "name") !== -1
            let eidtheard = contentList.findIndex((item) => item.type === "img") !== -1
            let eidtqrcode = contentList.findIndex((item) => item.type === "qr") !== -1
            let eidtGenera = contentList.findIndex((item) => item.type === "genera") !== -1
            this.setState({contentList, eidtnick, eidtheard, eidtqrcode, eidtGenera})
        }
    }
    handleChangeComplete = (color) => {
        this.setState({ color: color.hex })
    }
    generaChangeColor=(color) => {
        this.setState({gencolor: color.hex})
    }
    handleOk = (e) => {
        const { form, record, op, onsubmit, onValuesChange } = this.props
        let {contentList, color, gencolor} = this.state
        form.validateFields((err, values) => {
            const {QrcodeType} = values
            if (!err) {
                values.bg = values.bg[0]
                if (QrcodeType === "0") {
                    contentList = contentList.filter((item) => item.type !== "genera")
                }
                contentList.map((item) => {
                    if (item.type === "name") {
                        let list = record && record.content && record.content.find((item) => item.type === "name")
                        item.color = color || list && list.color || "#000"
                    }
                    if (item.type === "genera") {
                        let list = record && record.content && record.content.find((item) => item.type === "genera")
                        item.color = gencolor || list && list.color || "#000"
                    }
                })
                values.content = contentList
                if (values.bg === "b" && record) {
                    values.bg = record.bg
                }
                let payload = { ...values, id: record && record.id, op }
                if (e === "isChange") {
                    onValuesChange && onValuesChange(values)
                    return false
                }
                onsubmit && onsubmit(payload)
            }
        })
    }

    qrcodeFun = () => {
        let {eidtqrcode, replaceQr, contentList} = this.state
        eidtqrcode && (replaceQr = true)
        eidtqrcode && (contentList = contentList.filter((item) => item.type !== "qr"))
        !eidtqrcode && contentList.push({type: "qr", top: 0, left: 0, width: "100px",
            height: "100px"})
        this.setState({ eidtqrcode: !eidtqrcode, replaceQr, contentList })
    }
    heardImgFun = () => {
        let {eidtheard, replaceimg, contentList} = this.state
        eidtheard && (replaceimg = true)
        eidtheard && (contentList = contentList.filter((item) => item.type !== "img"))
        !eidtheard && contentList.push({type: "img", top: 0, left: 0, width: "80px",
            height: "80px"})
        this.setState({ eidtheard: !eidtheard, contentList, replaceimg })
    }
    nickFun = () => {
        let {eidtnick, replacenick, contentList} = this.state
        eidtnick && (replacenick = true)
        eidtnick && (contentList = contentList.filter((item) => item.type !== "name"))
        !eidtnick && contentList.push({type: "name", top: 0, left: 0, width: "100px",
            height: "100px"})
        this.setState({ eidtnick: !eidtnick, replacenick, contentList})
    }
    generaFun = () => {
        let {eidtGenera, replaceGenera, contentList} = this.state
        eidtGenera && (replaceGenera = true)
        eidtGenera && (contentList = contentList.filter((item) => item.type !== "genera"))
        !eidtGenera && contentList.push({type: "genera", top: 0, left: 0, width: "100px",
            height: "100px"})
        this.setState({ eidtGenera: !eidtGenera, replaceGenera, contentList})
    }
    handlePreview=(imgStyle, imgUrl) => {
        this.setState({imgUrl, imgStyle})
    }
    moveFun=(type) => (values) => {
        let {contentList} = this.state
        const {divHeight, divWidth, divLeft, divTop} = values
        let list = {type, top: divTop, left: divLeft, width: divHeight,
            height: divWidth}
        let index = contentList.findIndex((item) => item.type === type)
        if (index === -1) {
            contentList.push(list)
        }
        if (index !== -1) {
            contentList[index] = list
        }
        this.setState({contentList})
    }
    render () {
        const { form, record, loading} = this.props
        const { getFieldDecorator, getFieldValue } = form
        let { eidtqrcode, eidtheard, eidtnick, eidtGenera, imgUrl, replaceQr, replacenick, replaceimg, replaceGenera, imgStyle, gencolor, color} = this.state
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 17 },
        }
        let defaultQr = !replaceQr && record && replaceFun(record, "qr")
        let defaultNick = !replacenick && record && replaceFun(record, "name")
        let defaultImg = !replaceimg && record && replaceFun(record, "img")
        let defaultGenera = !replaceGenera && record && replaceFun(record, "genera")
        let boxStyle = {boxWidth: imgStyle.width, boxHeight: imgStyle.height}
        gencolor = gencolor || defaultGenera && defaultGenera.color
        color = color || defaultNick && defaultNick.color
        return (
            <span>
                <Form onChange={() => this.handleOk("isChange")}>
                    <div title="第三步">
                        <FormItem {...formItemLayout} label="海报显示模式" >
                            {getFieldDecorator("QrcodeType", { initialValue: record && record.QrcodeType || "0" })(
                                <RadioGroup>
                                    <Radio value="0">网页模式</Radio>
                                    <Radio value="1">推广码模式</Radio>
                                </RadioGroup>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="海报背景图" extra="海报背景大小建议尺寸为: 640 * 1000">
                            {!record && getFieldDecorator("bg", { rules: [{ required: true, message: "请输入背景图片" }] })(<UploadImg uploadMaxNum={1} handlePreview={this.handlePreview}/>)}
                            {record && !loading && getFieldDecorator("bg",
                                {initialValue: record && "b",
                                    rules: [{ required: true, message: "请输入背景图片" }] })(
                                <UploadImg
                                    defaultImgUrl={record.bg ? [record.bg] : []}
                                    uploadMaxNum={1}
                                    handlePreview={this.handlePreview}/>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label=" " colon={false}>
                            <Button onClick={this.qrcodeFun} type="primary" className="mr10">二维码</Button>
                            <Button onClick={this.heardImgFun} type="primary" className="mr10">头像</Button>
                            <Button onClick={this.nickFun} type="primary" className="mr10">昵称</Button>
                            {getFieldValue("QrcodeType") === "1" && <Button onClick={this.generaFun} type="primary">推广码</Button>}
                        </FormItem>
                        <FormItem {...formItemLayout} label=" " colon={false}>
                            <div className={styles.imgBox}
                                style={{...imgStyle, border: (imgUrl || record && record.bg) ? "" : "1px solid #ccc",
                                    background: `url("${imgUrl || record && record.bg}") 0% 0% / ${imgStyle.width + "px"} no-repeat`}}>

                                {eidtnick && <DragScale
                                    heard="name"
                                    disScale={true}
                                    onChange={this.moveFun("name")}
                                    outerStyle={{ ...defaultNick, color, lineHeight: "50px", height: 50, width: 130}} {...boxStyle}>
                                微信昵称
                                    <Popconfirm
                                        placement="top"
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ paddingLeft: 0 }}
                                        icon=""
                                        title={<CirclePicker color={color} width={300} onChangeComplete={this.handleChangeComplete} />}
                                    >
                                        <a title="点击设置颜色"> <Icon type="form" /> </a>
                                    </Popconfirm>
                                </DragScale>}

                                {eidtheard && <DragScale
                                    heard="img"
                                    isSquare={true}
                                    onChange={this.moveFun("img")}
                                    outerStyle={{width: 80, height: 80, ...defaultImg}} {...boxStyle}
                                    headerClass={styles.imgbac}/>}

                                {eidtqrcode && <DragScale heard="qr" isSquare={true} onChange={this.moveFun("qr")} outerStyle={{...defaultQr}} {...boxStyle} headerClass={styles.qrbac}></DragScale>}

                                {eidtGenera && getFieldValue("QrcodeType") === "1" &&
                                <DragScale
                                    heard="genera"
                                    disScale={true}
                                    onChange={this.moveFun("genera")}
                                    outerStyle={{ ...defaultGenera, color: gencolor, lineHeight: "50px", height: 50, width: 130}}
                                    {...boxStyle}>
                                   推广码
                                    <Popconfirm
                                        placement="top"
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ paddingLeft: 0 }}
                                        icon=""
                                        title={<CirclePicker color={gencolor} width={300} onChangeComplete={this.generaChangeColor} />}
                                    >
                                        <a title="点击设置颜色"> <Icon type="form" /> </a>
                                    </Popconfirm>
                                </DragScale>}
                            </div>
                        </FormItem>
                        <div className={styles.formboot}>
                            <Button className="mr10" onClick={() => this.props.prev()}>上一步 </Button>
                            <Button type="primary" onClick={this.handleOk} loading={loading}>生成海报</Button>
                        </div>
                    </div>
                </Form>
            </span>
        )
    }
}
const setForm = Form.create()(AddPoster)
export default setForm
