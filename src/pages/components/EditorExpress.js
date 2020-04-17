import { Button, Modal, message } from "antd"
import { Component } from "react"
import { connect } from "dva"
import exp from "./expressListNew"
import styles from "./Express.css"
import Express from "./Express"
import emoji from "emoji"
let emojiList = []
let expressList = []
class EditorExpress extends Component {
    state = {
        show: false,
        express: [],
        selExpress: [],
    }
    componentDidMount () {
        this.props.dispatch({ type: "vertisy/getemoji" })
    }
    showModal = () => {
        let selExpress = []
        const { Emoj } = this.props
        emojiList = Object.keys(emoji.EMOJI_MAP).map((name) => ({ name, sel: false }))
        expressList = exp.map((item) => ({ ...item, sel: false }))
        if (Emoj && Emoj.length) {
            Emoj.map((item) => {
                let expressIndex = expressList.findIndex((it) => it.name === item)
                if (expressIndex !== -1) {
                    expressList[expressIndex].sel = true
                    selExpress.push(expressList[expressIndex])
                } else {
                    let emojiIndex = emojiList.findIndex((it) => it.name === item)
                    emojiList[emojiIndex].sel = true
                    selExpress.push(emojiList[emojiIndex])
                }
            })
        }
        this.setState({ show: true, selExpress })
    }
    hidden = () => {
        this.setState({ show: false })
    }
    selChange = (name, index, tabIndex) => {
        let { selExpress } = this.state
        if (tabIndex === "1" && !expressList[index].sel) {
            selExpress.push(expressList[index])
            expressList[index].sel = true
            this.setState({ selExpress, onSel: true })
            return
        }
        if (tabIndex === "2" && !emojiList[index].sel) {
            selExpress.push(emojiList[index])
            emojiList[index].sel = true
            this.setState({ selExpress, onSel: true })
            return
        } else {
            return message.error("该表情已存在")
        }
    }
    onClick = () => {
        let random_emoji = []
        let { selExpress, onSel } = this.state
        if (selExpress.length && onSel) {
            selExpress.map((item) => {
                random_emoji.push(item.name)
            })
            this.props.dispatch({ type: "vertisy/setemoji", payload: { random_emoji } })
            this.setState({ onSel: false })
        }
        this.setState({ show: false })
    }
    delSel = (index) => {
        let { selExpress } = this.state
        if (selExpress.length) {
            selExpress.splice(index, 1)
            this.setState({ selExpress, onSel: true })
        }
    }
    render () {
        const { show, selExpress } = this.state
        return (
            <div>
                <Button size="small" type="primary" style={{ marginLeft: 10 }} onClick={this.showModal}>编辑随机表情</Button>
                <Modal width={720} visible={show} title="编辑随机表情" onCancel={this.hidden} onOk={this.onClick}>
                    <div className="f">
                        <div className="f fv f1">
                            <span style={{marginBottom: 3}}>请选择表情</span>
                            <Express selectExpress={this.selChange} iscontent={true} />
                        </div>
                        <div className="f fv f1">
                            <span>已选择表情</span>
                            <div className={styles.expressBoxItem}>
                                {selExpress.length > 0 && selExpress.map((item, index) => (
                                    item.className
                                        ? <i key={index}>
                                            <span title={item.name} className={`sprite sprite-${item.className}`} onClick={() => this.delSel(index)} />
                                        </i>
                                        : <i
                                            key={index}
                                            dangerouslySetInnerHTML={{ __html: emoji.unifiedToHTML(item.name) }}
                                            onClick={() => this.delSel(index)}
                                        />

                                ))}
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { Emoj } = state.vertisy
    return {
        Emoj,
    }
}
export default connect(mapStateToProps)(EditorExpress)
