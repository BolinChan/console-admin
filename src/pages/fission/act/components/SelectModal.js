import { Modal, Checkbox, Tooltip } from "antd"
import { Component } from "react"
class SelectModal extends Component {
    state={wxids: []}
    shouldComponentUpdate (nextProp) {
        const {loading} = this.props
        if (nextProp.visible && !nextProp.loading && loading) {
            let wxids = this.props.defaultV && this.props.defaultV.map((item) => item.wxid)
            this.setState({wxids})
        }
        return true
    }
    selectwxid = (e) => {
        const { id, checked } = e.target
        let { wxids } = this.state
        if (checked) {
            wxids.push(id)
        } else {
            wxids = wxids.filter((item) => item !== id)
        }
        this.setState({wxids})
    }
    render () {
        const { list, visible, handleCancel, handleOk} = this.props
        const {wxids} = this.state
        return (
            <span>
                <Modal width={640} destroyOnClose={true} title="设置客服" visible={visible} onOk={() => handleOk && handleOk(wxids)} onCancel={handleCancel}>
                    {list &&
                            list.map((item) => {
                                let isTure = wxids && wxids.find((mess) => mess === item.wxid)
                                return (
                                    <Tooltip placement="top" key={item.id} title={item.nickname.length > 8 && item.nickname}>
                                        <Checkbox checked={!!isTure} id={item.wxid} onChange={this.selectwxid}>
                                            {item.nickname || "未命名"}
                                        </Checkbox>
                                    </Tooltip>
                                )
                            })}
                </Modal>
            </span>
        )
    }
}

export default SelectModal
