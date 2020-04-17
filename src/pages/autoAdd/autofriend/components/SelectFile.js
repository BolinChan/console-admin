import { Upload, Icon, Button, message } from "antd"
import {Component} from "react"
class PicturesWall extends Component {
    // 上传文件之前的过滤
    handleBeforeUpload = (file, fileList) => {
        let arr = file.name.split(".")
        const {onChange} = this.props
        let suffix = arr[arr.length - 1] === "xls" || arr[arr.length - 1] === "xlsx"
        if (!suffix) {
            message.error("只支持Excel文件!")
        } else {
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = (e) => {
                if (e.target.result === null) {
                    message.error("加载失败！")
                    return false
                } if (e.target.result !== null) {
                    file.thumbUrl = e.target.result
                    file.status === "done"
                    onChange && onChange(file)
                }
            }
        }
        return false
    }
    onRemove=() => {
        const {onChange} = this.props
        onChange && onChange()
    }
    render () {
        const { value } = this.props
        const fileList = value ? [value] : []
        const uploadButton = (
            <Button>
                <Icon type="upload" /> 选择文件
            </Button>
        )
        return (
            <div className="clearfix">
                <Upload
                    listType="picture"
                    className='upload-list-inline'
                    fileList={fileList}
                    beforeUpload={this.handleBeforeUpload}
                    onRemove ={this.onRemove}
                >
                    {fileList.length >= 1 ? null : uploadButton}
                </Upload>
            </div>
        )
    }
}

export default PicturesWall
