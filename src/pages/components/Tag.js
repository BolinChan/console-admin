import { Component } from "react"
import { Checkbox, Icon } from "antd"
import styles from "./SelectWeChat.css"
const limitHeight = 33
let List = []
class Tag extends Component {
    state = {
        checkedList: [],
        indeterminate: false,
        checkAll: false,
        coDisplay: false,
        closeOpen: false,
    }
    componentDidMount () {
        window.addEventListener("resize", this.resize)
        this.resize()
    }
    componentWillUnmount () {
        window.removeEventListener("resize", this.resize)
    }
    resize = (e) => {
        this.setState({ coDisplay: this.refs.container.offsetHeight > limitHeight })
    }
    handleSwitch = () => {
        this.setState({
            closeOpen: !this.state.closeOpen,
        })
    }
    onCheckChange = (e) => {
        const { checked, value } = e.target
        const { tags } = this.props
        let { checkedList } = this.state
        checked ? (checkedList = [...checkedList, value]) : checkedList.splice(checkedList.findIndex((item) => item === value), 1)
        checked ? (List = [...List, value]) : List.splice(List.findIndex((item) => item === value), 1)
        this.setState({
            checkedList: checkedList,
            indeterminate: !!checkedList.length && checkedList.length < tags.length,
            checkAll: checkedList.length === tags.length,
        })
        if (this.props.onChange) {
            this.props.onChange(List)
        }
    }
    onCheckAllChange = (e) => {
        this.setState({
            checkedList: e.target.checked ? [...this.props.tags.map((item) => item.id)] : [],
            indeterminate: false,
            checkAll: e.target.checked,
        })
        if (e.target.checked) {
            this.props.tags.map((item) => {
                let index = List.findIndex((mess) => mess === item.id)
                index !== -1 ? "" : List.push(item.id)
            })
        } else {
            this.props.tags.map((item) => {
                let index = List.findIndex((mess) => mess === item.id)
                index !== -1 ? List.splice(index, 1) : ""
            })
        }
        if (this.props.onChange) {
            this.props.onChange(List)
        }
    }
    render () {
        const { checkedList, coDisplay, closeOpen, indeterminate } = this.state
        let { tags, devicename } = this.props
        return (
            <div className={styles.tagBox}>
                <div className={styles.tagHeader} title={devicename}>
                    <Checkbox value={devicename} indeterminate={indeterminate} onChange={this.onCheckAllChange} checked={this.state.checkAll}>
                        {devicename}
                    </Checkbox>
                </div>
                <div className={styles.box} onChange={this.onCheckChange} style={closeOpen ? {} : { height: limitHeight, overflow: "hidden" }}>
                    {coDisplay && <Icon type={closeOpen ? "down" : "left"} onClick={this.handleSwitch} className={styles.closeOpen} title={closeOpen ? "收起" : "更多"} />}
                    <div className={styles.container} ref="container">
                        {tags &&
                            tags.map((item, index) => {
                                const { name, id } = item
                                return (
                                    <div className={styles.item + " " + styles.right} key={id} title={name}>
                                        <Checkbox value={id} checked={checkedList.findIndex((mess) => mess === id) !== -1}>
                                            {name}
                                        </Checkbox>
                                    </div>
                                )
                            })}
                    </div>
                </div>
            </div>
        )
    }
}
export default Tag
