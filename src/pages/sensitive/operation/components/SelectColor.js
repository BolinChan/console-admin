// import { connect } from "dva"
import { Component } from "react"
import { Popconfirm } from "antd"
import { CirclePicker } from "react-color"
import styles from "../page.css"
class SelectColor extends Component {
    state = {
        visible: false,
    }
    // 提交数据
    handleChangeComplete = (color) => {
        this.setState({ color: color.hex })
    }
    onConfirm = () => {
        const { record, dispatch } = this.props
        dispatch({
            type: "auxiliary/updateActions",
            payload: { id: record.id, is_exception: record.is_exception, color: this.state.color },
        })
    }
    // content = () => (
    //     <div>
    //         <SketchPicker color={this.state.background} width={300} onChangeComplete={this.handleChangeComplete} />
    //     </div>
    // )
    render () {
        return (
            <div className={styles.selColor}>
                <Popconfirm
                    placement="rightTop"
                    // title="选择颜色"
                    style={{ paddingLeft: 0 }}
                    icon=""
                    title={<CirclePicker color={this.state.color || this.props.color} width={300} onChangeComplete={this.handleChangeComplete} />}
                    okText="确定"
                    cancelText="取消"
                    onConfirm={this.onConfirm}
                >
                    <span style={{ color: this.state.color || this.props.color }}>颜色</span>
                </Popconfirm>
            </div>
        )
    }
}
export default SelectColor
