import "braft-editor/dist/index.css"
import { Component } from "react"
import BraftEditor from "braft-editor"
import { Form, Input, Button, Upload, Icon, message, Switch, Modal } from "antd"
import UploadImg from "../../components/UploadImg"
import { ContentUtils } from "braft-utils"
import axios from "axios"
import styles from "./Editor.css"
const action = "//wechat.yunbeisoft.com/index_test.php/home/fileupload/upload"
const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
    colon: false,
}
const controls = ["bold", "italic", "underline", "strike-through", "text-color", "separator", "link", "separator", "text-align", "hr", "separator", "font-family", "font-size", "line-height", "media"]
const uploadParam = {
    accept: "image/*",
    action: action,
    data: { type: "image" },
    showUploadList: false,
}
const fetchUrl = "//wechat.yunbeisoft.com/index_test.php/home/article/getOne"

class Editor extends Component {
    constructor (props) {
        super(props)
        this.state = {
            id: props.id || "",
        }
    }
    componentDidMount () {
        this.getOne()
    }
    getOne = () => {
        const { id, form, pervisible} = this.props
        let values = {
            title: "",
            content: BraftEditor.createEditorState("<p></p>"),
            thumb: "",
            remark: "",
        }
        if (id && id !== "") {
            const aid = window.sessionStorage.getItem("i")
            const token = window.sessionStorage.getItem("token")
            const data = { id, aid, token }
            axios.post(fetchUrl, data).then(({ data: res }) => {
                if (res.error) {
                    return message.error(res.msg)
                }
                const { data } = res
                values = {
                    small_title: data.small_title,
                    title: data.title,
                    content: BraftEditor.createEditorState(data.content),
                    thumb: [data.pic],
                    remark: data.remark,
                    type: Number(data.type) === 1,
                }
                if (pervisible) {
                    this.setState({content: BraftEditor.createEditorState(data.content)})
                    return
                }
                form.setFieldsValue({ ...values })
            })
        } else {
            form.setFieldsValue({ ...values })
        }
    }
    uploadHandler = (param) => {
        if (!param.file) {
            return false
        }
        const { action, data, filename, file } = param
        const formData = new FormData()
        if (data) {
            Object.keys(data).map((key) => {
                formData.append(key, data[key])
            })
        }
        formData.append(filename, file)
        axios.post(action, formData).then(({ data: res }) => {
            if (res.error) {
                return message.error(res.msg)
            }
            const { data } = res
            this.props.form.setFieldsValue({
                content: ContentUtils.insertMedias(this.props.form.getFieldValue("content"), [{
                    type: "IMAGE",
                    url: data[0].url,
                }]),
            })
        })
    }
    contentValidator = (_, value, callback) => {
        if (value.isEmpty()) {
            callback("请输入正文内容")
        } else {
            callback()
        }
    }
    myUploadFn = (param) => {
        message.error("不支持本地上传!")
    }
    handleSubmit = (event) => {
        event.preventDefault()
        const {form, moren} = this.props
        form.validateFields((error, values) => {
            if (!error) {
                let { title, content, thumb, remark, small_title, type } = values
                moren && (type = true)
                const payload = {
                    aid: window.sessionStorage.getItem("i"),
                    id: this.state.id,
                    title,
                    content: content.toHTML(),
                    pic: thumb[0] || "",
                    remark,
                    small_title,
                    type: type ? "1" : "2",
                }
                this.props.submitEditor(payload)
            }
        })
    }
    render () {
        const {pervisible, closeEditor} = this.props
        const { getFieldDecorator, getFieldValue } = this.props.form
        const {content} = this.state
        const extendControls = [
            {
                key: "antd-uploader",
                type: "component",
                component: (
                    <Upload customRequest={this.uploadHandler} {...uploadParam}>
                        <button
                            type="button"
                            className="control-item button upload-button"
                            data-title="插入图片"
                        >
                            <Icon type="picture" />
                        </button>
                    </Upload >
                ),
            },
        ]
        return (
            pervisible
                ? <Modal
                    // width="min-content"
                    style={{height: "80%"}}
                    wrapClassName="wrapClass"
                    bodyStyle={{height: "100%", overflow: "auto"}}
                    footer={null}
                    visible={pervisible}
                    onCancel={closeEditor}>
                    <div className={styles.perview}>
                        {/* <img src={require("../../../assets/phone.png")}/> */}
                        <div dangerouslySetInnerHTML={{__html: content && content.toHTML()}}></div>
                    </div>
                </Modal>
                : <Form onSubmit={this.handleSubmit} >
                    <a onClick={closeEditor} style={{letterSpacing: 2, fontSize: 16}}>
                    返回
                    </a>
                    <FormItem {...formItemLayout} label="分享标题">
                        {getFieldDecorator("title", {
                            rules: [{ required: true, message: "请输入标题" }],
                        })(
                            <Input
                                size="large"
                                placeholder="请输入标题"
                                ref={this.titleIpt = (titleIpt) => titleIpt && titleIpt.focus()}
                            />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="分享简介">
                        {getFieldDecorator("small_title")(
                            <Input
                                size="large"
                                placeholder="请输入简介（分享文章时显示）"
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="分享正文"
                        extra={
                            <a href="//www.parsevideo.com/" target={"_blank"}>
                            解析视频地址
                            </a>
                        }
                    >
                        {getFieldDecorator("content", {
                            validateTrigger: "onBlur",
                            rules: [{ required: true, validator: this.contentValidator }],
                        })(
                            <BraftEditor
                                className={styles.editor}
                                controls={controls}
                                media={{
                                    uploadFn: this.myUploadFn,
                                    accepts: {
                                        image: false,
                                        video: false,
                                        audio: false,
                                    },
                                }}
                                extendControls={extendControls}
                                placeholder="请输入正文内容"
                            />
                        )}
                    </FormItem>
                    {!this.props.moren && <FormItem {...formItemLayout} label="共享给团队成员">
                        {getFieldDecorator("type", {initialValue: true})(
                            <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={getFieldValue("type")}/>
                        )}
                        <span style={{color: "rgba(0, 0, 0, 0.45)"}} className="ml10">共享给团队可被团队成员看到。</span>
                    </FormItem>}
                    <FormItem {...formItemLayout} label="分享备注">
                        {getFieldDecorator("remark")(
                            <Input size="large" placeholder="请输入备注" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="封面图片">
                        {getFieldDecorator("thumb")(
                            <UploadImg uploadMaxNum={1} />
                        )}
                    </FormItem>
                    <FormItem wrapperCol={{ span: 12, offset: 4 }}>
                        <Button size="large" onClick={this.props.closeEditor} style={{ marginRight: 16 }}>
                        返回
                        </Button>
                        <Button size="large" type="primary" htmlType="submit">
                        完成
                        </Button>
                    </FormItem>
                </Form>
        )
    }
}

export default Form.create()(Editor)
