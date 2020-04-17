import { Component } from "react"
import { Button, Modal } from "antd"
import Tag from "./Tag"
class ModalTag extends Component {
    state = {
        visible: false,
        List: [],
        deviceIds: 0,
    }
    okHandler = () => {
        this.setState({ visible: false })
        if (this.props.onChange) {
            this.props.onChange(this.state.List)
        }
    }
    hideModelHandler = () => {
        this.setState({ visible: false })
    }
    showModelHandler = () => {
        const { tags, deviceIdlist } = this.props
        const { deviceIds } = this.state
        let List = []
        let tagsList = []
        if (deviceIds !== deviceIdlist && deviceIdlist.length) {
            deviceIdlist.map((item) => {
                tagsList.push(...tags.filter((mess) => mess.deviceid === item.deviceid))
            })
            this.state.List.map((item) => {
                if (tagsList.findIndex((mess) => mess.id === item) !== -1) {
                    List.push(item)
                }
            })
            this.setState({ List, deviceIds: deviceIdlist.length })
        }
        this.setState({ visible: true })
    }
    ListChange = (List) => {
        this.setState({ List })
    }
    render () {
        let { tags, deviceIdlist, children, disabled } = this.props
        return (
            <span>
                <Button type="primary" disabled={disabled} onClick={this.showModelHandler}>
                    {children ? children : "添加"}
                </Button>
                {/* {isVisible &&
                    this.state.List.length > 0 && (
                    <Button style={{ marginLeft: "20px" }} type="primary" onClick={this.showModelHandler}>
                            查看选择
                    </Button>
                )} */}
                <Modal width="50%" style={{ minWidth: "564px" }} title={this.props.title} visible={this.state.visible} onOk={this.okHandler} onCancel={this.hideModelHandler} destroyOnClose={true}>
                    {tags.length > 0 ? (
                        deviceIdlist &&
                        deviceIdlist.map((item) => {
                            let tagsList = tags.filter((mess) => mess.deviceid === item.deviceid)
                            return <Tag key={item.deviceid} devicename={item.devicename ? item.devicename : "未命名"} tags={tagsList} onChange={this.ListChange} />
                        })
                    ) : (
                        <div style={{ textAlign: "center" }}>暂无标签</div>
                    )}
                </Modal>
            </span>
        )
    }
}
export default ModalTag
