import { Icon, Popover, Tabs } from "antd"
import styles from "./Express.css"
import { Component } from "react"
import expressList from "./expressListNew"
import emoji from "emoji"
const TabPane = Tabs.TabPane
class Express extends Component {
    state = {
        visiblePopover: false,
        tabIndex: "1",
    }
    componentDidMount () {
        document.body.addEventListener("click", this.Listener)
    }
    componentWillUnmount () {
        document.body.removeEventListener("click", this.Listener)
    }
    Listener = (e) => {
        if (e && e.target.innerText && (e.target.innerText.includes("通用") || e.target.innerText.includes("emoji"))) {
            return
        }
        this.setState({ visiblePopover: false })
    }
    TabChange = (e) => {
        this.setState({ tabIndex: e })
    }
    content = (tabIndex) => (
        <Tabs size="small" activeKey={tabIndex} className={styles.expressTab} tabPosition="bottom" onChange={this.TabChange}>
            <TabPane tab={<span>通用</span>} key="1" className={styles.expressBoxItem} >
                {expressList.map((item, index) => (
                    <i
                        key={index}
                        onClick={() => {
                            this.props.selectExpress(item.name, index, tabIndex)
                        }}
                    >
                        <span title={item.name} className={`sprite sprite-${item.className}`} />
                    </i>
                ))}
            </TabPane>
            <TabPane tab={<span>emoji</span>} key="2" className={styles.expressBoxItem}>
                {Object.keys(emoji.EMOJI_MAP).map((item, index) => (
                    <i
                        key={index}
                        dangerouslySetInnerHTML={{ __html: emoji.unifiedToHTML(item) }}
                        onClick={() => {
                            this.props.selectExpress(item, index, tabIndex)
                        }}
                    />
                ))}
            </TabPane>
        </Tabs>
    )
    openPopover = () => {
        if (!isFinite(this.props.disabled)) {
            this.setState({ visiblePopover: true, tabIndex: "1" })
        } else {
            this.setState({ visiblePopover: !this.props.disabled })
        }
    }
    render () {
        const { tabIndex } = this.state
        const { iscontent } = this.props
        const overlayStyle = { background: this.props.background || "whitesmoke" }
        // iscontent 是否只显示内容
        return (
            <div>
                {iscontent
                    ? this.content(tabIndex)
                    : <Popover
                        placement={this.props.placement}
                        visible={this.state.visiblePopover}
                        overlayClassName={styles.popover}
                        content={this.content(tabIndex)}
                        overlayStyle={overlayStyle}
                        id="express"
                        onClick={this.openPopover}
                        arrowPointAtCenter={true}
                        autoAdjustOverflow={true}
                    >
                        <b title={this.props.title}>
                            <Icon type="smile-o" />
                        </b>
                    </Popover>}
            </div>
        )
    }
}

export default Express
