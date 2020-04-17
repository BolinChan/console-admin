import { Checkbox, Icon, Tooltip, Row } from "antd"
import { Component } from "react"
import styles from "./SelectWeChat.css"
const limitHeight = 33
let isw = false
class SelectWeChat extends Component {
    state = {
        first: true,
        checkedList: [],
        indeterminate: false,
        checkAll: false,
        coDisplay: false,
        closeOpen: false,
        isdire: false,
    }
    componentDidUpdate (nexProps) {
        this.initDeviceFun(nexProps)
    }
    componentDidMount () {
        this.initDeviceFun()
        window.addEventListener("resize", this.resize)
    }
    componentWillUnmount () {
        window.removeEventListener("resize", this.resize)
    }
    resize = (e) => {
        let {isdire} = this.state
        if (this.refs.container) {
            if (!isdire && this.refs.container.offsetHeight > limitHeight) {
                isdire = true
            }
            this.setState({ coDisplay: this.refs.container.offsetHeight > limitHeight, isdire })
        }
    }
    handleSwitch = () => {
        this.setState({
            closeOpen: !this.state.closeOpen,
        })
    }
    initDeviceFun=(nexProps) => {
        let { initValue, data, ischeck, indeterminate} = this.props
        let {checkedList, checkAll} = this.state
        let isTrue = data && data.length > 0 && this.state.first
        if (isTrue) {
            if (data && initValue) {
                const list = []
                data.map((mess) => {
                    const index = initValue.findIndex((wxid) => wxid === mess.wxid)
                    index !== -1 && (list.push(mess.wxid))
                })
                initValue = list
            }
            checkedList = initValue ? initValue : []
            this.setState({first: false})
            if (checkedList.length > 0) {
                this.onChangeSelect(checkedList)
            }
            this.resize()
        }
        if ((!checkAll && ischeck) || (!indeterminate && !ischeck && nexProps && nexProps.ischeck)) {
            this.onChangeSelect(ischeck ? data.map((item) => item.wxid) : [])
        }
    }
    onChangeSelect=(e) => {
        let {checkedList} = this.state
        if (e.target) {
            const {value, checked} = e.target
            checked ? checkedList.push(value) : (checkedList = checkedList.filter((item) => item !== value))
        } else {
            checkedList = e
        }
        const { data, onChange, fenzuSelect, zuname } = this.props
        this.setState({
            visible: true,
            indeterminate: checkedList.length !== 0 && checkedList.length < data.length,
            checkAll: checkedList.length === data.length,
            checkedList,
        })
        fenzuSelect && fenzuSelect(checkedList, (zuname || "未分组"))
        onChange && onChange(checkedList)
    }
    onCheckAllChange=(e) => {
        const {checked} = e.target
        const {data} = this.props
        let value = data && data.map((item) => item.wxid)
        if (checked) {
            this.onChangeSelect(value)
        } else {
            this.onChangeSelect([])
        }
    }
    render () {
        const { data, direction, isDevicename, zuname } = this.props
        const {checkedList, coDisplay, closeOpen, isdire} = this.state
        coDisplay && (isw = true)
        let widthclass = isDevicename && isw ? styles.dingW250 : isw ? styles.dingW156 : ""
        return (
            <div className={styles.checkBox}>
                {data && data.length > 0 ? <div className={styles.deviceBox} style={{flexDirection: direction && isdire && "column"}}>
                    <div className={styles.header + " " + widthclass}>
                        <Checkbox
                            indeterminate={this.state.indeterminate}
                            onChange={this.onCheckAllChange}
                            checked={this.state.checkAll}
                            style={{display: "flex", alignItems: "flex-end"}}
                        >
                            <Row type="flex" justify="space-between" style={{width: 160}}>
                                <Tooltip className={styles.tagHeader} title={zuname}>{zuname || "全选"}</Tooltip>
                            （{checkedList.length || "0"}/{data && data.length || "0"}）
                            </Row>
                        </Checkbox>
                    </div>
                    <div className={styles.box} onChange={this.onCheckChange} style={closeOpen ? {} : { height: limitHeight, overflow: "hidden" }}>
                        {coDisplay &&
                        <a className={styles.closeOpen} onClick={this.handleSwitch} >
                            <Icon type={closeOpen ? "down" : "left"} title={closeOpen ? "收起" : "更多"} />{closeOpen ? "收起" : "更多"}
                        </a> }
                        <div className={styles.container} ref="container">
                            {data && data.map((item, index) => {
                                const {nickname, devicename} = item
                                const isName = nickname ? nickname.length > 8 : false
                                const isdevice = devicename ? devicename.length > 4 : false
                                let isCheck = checkedList && checkedList.find((mess) => mess === item.wxid)
                                return (
                                    <Checkbox key={index} className={widthclass} checked={!!isCheck} value={item.wxid} onChange={this.onChangeSelect}>
                                        <Tooltip placement="top" key={index} title={isName || isdevice ? "(" + item.devicename + ")" + item.nickname : ""}>
                                            { isDevicename && <span> ( {isdevice ? `${devicename.slice(0, 4)}...` : devicename || "未命名"})</span>}
                                            {isName && !coDisplay ? `${nickname.slice(0, 8)}...` : nickname || "未命名"}
                                        </Tooltip>
                                    </Checkbox>
                                )
                            })}
                            {/* <CheckboxGroup options={data} value={checkedList} onChange={this.onChangeSelect}></CheckboxGroup> */}
                        </div>
                    </div>
                </div> : <div style={{lineHeight: "42px"}}>暂无数据</div>}
            </div>
        )
    }
}
export default SelectWeChat

// direction="vertical" 并且this.state.coDisplay=true时  全选和内容垂直或者水平排列，默认水平
// initValue 默认值
// data 数据
// isDevicename={true} 是否显示（设备名称）+ 微信昵称 ，默认不显示
