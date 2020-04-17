// import { connect } from "dva"
import { Component } from "react"
import { Input, Select } from "antd"
const Option = Select.Option
class SetName extends Component {
    state = {
        visible: false,
    }
    componentDidMount () {
        document.body.addEventListener("click", this.Listener)
        document.body.addEventListener("keyup", this.inputNumSub)
    }
    componentDidUpdate () {
        if (document.getElementById("boxInput")) {
            document.getElementById("boxInput").removeEventListener("click", this.onClickFun)
            document.getElementById("boxInput").addEventListener("click", this.onClickFun)
        }
    }
    componentWillUnmount () {
        document.body.removeEventListener("click", this.Listener)
    }
    Listener = (e) => {
        if (this.props.type !== "select") {
            this.setState({ visible: false })
        }
    }
    onClickFun = (e) => {
        e.stopPropagation()
    }
    setName = () => {
        this.setState({ visible: true })
    }
    onChange=(e) => {
        let name = e.target.value
        const { type } = this.props
        if (type) {
            e.target.value = name.replace(/[^\d]/g, "")
        }
    }
    // 提交数据
    enterSubmit = (e) => {
        let name = e.target.value
        const { record, onSubmit } = this.props
        this.setState({ visible: false, name: name.replace(/(\s*$)/g, "") })
        onSubmit && onSubmit(record, name)
    }
    onSelect = (value, e) => {
        const { record, onSubmit } = this.props
        this.setState({ visible: false })
        onSubmit && onSubmit(record, value)
    }
    render () {
        const { defaultname, holder, type, option, record} = this.props
        let { visible, name} = this.state
        return (
            <div>
                <a style={{ display: !visible ? "block" : "none" }} onDoubleClick={this.setName} title="双击修改，Enter键保存">
                    {defaultname}
                </a>
                {visible && (
                    type === "select"
                        ? <Select
                            open={true}
                            // onMouseLeave={this.onMouseLeave}
                            id="boxInput"
                            defaultValue={record.receive}
                            onSelect={this.onSelect}
                            style={{ width: "100%" }}>
                            {option.map((item) => <Option key={item.value} value={item.value}>{item.lable}</Option>)}
                        </Select>
                        : <Input
                            id="boxInput"
                            placeholder={holder}
                            defaultValue={name || (defaultname === "无" || defaultname === "未绑定" || defaultname === "未设置" ? "" : defaultname)}
                            ref={(input) => input && input.focus()}
                            onPressEnter={this.enterSubmit}
                            onChange={this.onChange}
                        />
                )}
            </div>
        )
    }
}
export default SetName
