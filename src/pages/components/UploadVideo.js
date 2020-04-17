import { Component } from "react"
import { Upload, Icon, message } from "antd"
import axios from "axios"
import styles from "./UploadImg.css"
import { isArray } from "util"
const uploadParam = {
    accept: "video/*",
    action: "//wechat.yunbeisoft.com/index_test.php/home/fileupload/upload",
    data: { type: "video" },
    showUploadList: true,
    // listType: "picture",
    listType: "picture-card",
}
class SendImg extends Component {
    state = { file: "", loading: false, oid: "-1" }
    componentDidMount () {
        let { onChange, defaultVideo, value} = this.props
        defaultVideo = value || defaultVideo
        let url = defaultVideo && isArray(defaultVideo) ? defaultVideo[0] : defaultVideo
        onChange && onChange(url)
        this.setState({url})
    }
    componentDidUpdate () {
        const {selectList, onChange} = this.props
        let {oid} = this.state
        if (selectList && selectList.media) {
            let isTrue = oid === selectList.id
            if (!isTrue) {
                let url = selectList.type === "10" && selectList.media[0]
                onChange && onChange(url)
                this.setState({url: url && isArray(url) ? url[0] : url, oid: selectList.id})
            }
        }
    }
    // 上传前处理
    beforeUpload = (file) =>
        new Promise((reject) => {
            const isJPG = !!(file.type === "video/mp4")
            if (!isJPG) {
                message.error("请选择图片文件")
                return false
            }
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = (e) => {
                if (e.target.result === null) {
                    message.error("加载失败！")
                    return false
                } else {
                    const { action, data } = uploadParam
                    this.setState({ file, loading: true, name: file.name })
                    this.customRequest({ action, data, file, filename: "file", onSuccess: this.onSuccess })
                }
            }
            return false
        })
    // 自定义上传
    customRequest = ({ action, data, file, filename, onSuccess }) => {
        const formData = new FormData()
        let token = window.sessionStorage.getItem("token")
        formData.append("token", token)
        if (data) {
            Object.keys(data).map((key) => {
                formData.append(key, data[key])
            })
        }
        formData.append(filename, file)
        axios.post(action, formData).then(({ data: response }) => {
            onSuccess(response, file)
        })
    }
    // 上传回调
    onSuccess = (ret, file) => {
        if (ret.error) {
            return message.error(ret.msg)
        }
        message.success("上传成功")
        const url = ret.data[0].url
        if (this.props.onChange) {
            this.props.onChange(url)
        }
        this.setState({ loading: false, name: file.name, url })
    }
    onRemove=(e) => {
        e.stopPropagation()
        this.setState({url: null})
        this.props.onChange()
    }
    render () {
        let {url} = this.state
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? "loading" : "plus"} />
                <div className="ant-upload-text">上传视频</div>
            </div>
        )
        return (
            <span>
                <div className={styles.uploadBox}>
                    <Upload beforeUpload={this.beforeUpload} onChange={this.handleOnChange} {...uploadParam}>
                        {url ? <video height="200px" src={url} controls="controls"/> : uploadButton}
                        {url && <Icon className={styles.delIcon} type="delete" onClick={(e) => this.onRemove(e)}/>}
                    </Upload>
                </div>
            </span>
        )
    }
}
export default SendImg

