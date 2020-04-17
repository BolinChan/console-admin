import { Component } from "react"
import { Button, Upload, message } from "antd"
import { randomFun } from "../../../../utils/helper"
import templetExcel from "../text.xlsx"
class UploadTags extends Component {
    state = {
        myList: [],
    }
    // 上传文件之前的过滤
    beforeUpload = (file) => {
        let arr = file.name.split(".")
        let suffix = arr[arr.length - 1] === "xls" || arr[arr.length - 1] === "xlsx"
        if (!suffix) {
            message.error("只支持Excel文件上传!")
        }
        this.setState({ suffix })
        return suffix
    }
    // 上传excel文件
    upFileChange = (info) => {
        this.setState({
            myList: this.state.suffix ? info.fileList : [],
            loading: true,
        })
        const {response} = info.file
        if (response && response.error) {
            message.error("文件上传失败")
            this.setState({loading: false})
        }
        if (response && !response.error) {
            this.props.dispatch({
                type: "chat/fetchContactList",
                payload: {},
            })
            this.props.dispatch({ type: "tagManage/getDevTags" })
            message.success("文件上传成功")
            this.setState({loading: false})
        }
    }
    render () {
        const aid = window.sessionStorage.getItem("i")
        const flieProps = {
            name: "file",
            action: "//wechat.yunbeisoft.com/index_test.php/home/tem/daoru_excel",
            data: { aid, key: `./Public/Excel/${randomFun()}`, token: window.sessionStorage.getItem("token") },
            onChange: this.upFileChange,
            beforeUpload: this.beforeUpload,
            showUploadList: false,
            methods: "post",
        }
        return (
            <span>
                <Upload {...flieProps}>
                    <Button loading={this.state.loading} type="primary" className="mr10">
                    导入标签
                    </Button>
                </Upload>
                <Button type="primary" htmlType="button">
                    <a href={templetExcel} download="templet.xlsx">
                        下载模板
                    </a>
                </Button>
            </span>

        )
    }
}
export default UploadTags
