import { Steps } from "antd"
import {Component} from "react"
// import AddPoster from "./AddPoster"
import FristStep from "./FristStep"
import SecondStep from "./SecondStep"
import ThirdStep from "./ThirdStep"
import AddPrize from "./AddPrize"
import styles from "../../page.css"
import moment from "moment"
const Step = Steps.Step

class StepModel extends Component {
    state = {
        current: 0,
        valuelist: {},
        status: [],
    }
    componentDidUpdate () {
        if (this.props.loading && this.state.current === 2) {
            const current = this.state.current + 1
            this.setState({current})
        }
    }
    onClick=(current) => {
        this.setState({ current })
    }
    next= () => {
        const current = this.state.current + 1
        this.setState({ current })
    }
    prev =() => {
        const current = this.state.current - 1
        this.setState({ current })
    }
    onValuesChange=(list) => {
        const {valuelist} = this.state
        this.setState({valuelist: {...valuelist, ...list}})
    }
    onsubmit=(list) => {
        const {valuelist} = this.state
        const current = this.state.current + 1
        this.setState({ current, valuelist: {...valuelist, ...list}})
    }
    // 提交海报数据
    handleSumbit=(values) => {
        let {valuelist} = this.state
        const {record} = this.props
        if (!valuelist.actTime && record) {
            const {actTimeEnd, actTimeStart} = record
            let s_time = moment(new Date(Number(actTimeStart) * 1000)).format("YYYY-MM-DD HH:mm:ss")
            let e_time = moment(new Date(Number(actTimeEnd) * 1000)).format("YYYY-MM-DD HH:mm:ss")
            let actTime = { start: s_time, end: e_time }
            valuelist = {...valuelist, actTime}
        }
        if (record) {
            valuelist = {...record, ...valuelist}
        }
        this.props.dispatch({
            type: "fission/uptatePoster",
            payload: { ...valuelist, ...values },
        })
        this.setState({valuelist: {...valuelist, ...values}})
    }
    render () {
        const { current, valuelist, status } = this.state
        const {record} = this.props
        let steps = [{
            title: <div style={{cursor: "pointer"}} onClick={() => this.onClick(0)}>基本设置</div>,
            content: <FristStep onValuesChange={this.onValuesChange} {...this.props} record={{...record, ...valuelist}} onsubmit={this.onsubmit}></FristStep>,
        }, {
            title: <div style={{cursor: "pointer"}} onClick={() => this.onClick(1)}>提示语</div>,
            content: <SecondStep onValuesChange={this.onValuesChange} {...this.props} record={{...record, ...valuelist}} onsubmit={this.onsubmit} prev={this.prev}></SecondStep>,
        }, {
            title: <div style={{cursor: "pointer"}} onClick={() => this.onClick(2)}>海报设置</div>,
            content: <ThirdStep onValuesChange={this.onValuesChange} {...this.props} record={{...record, ...valuelist}} onsubmit={this.handleSumbit} prev={this.prev}></ThirdStep>,
        }, {
            title: <div style={{cursor: "pointer"}} onClick={() => this.onClick(3)}>奖品设置</div>,
            content: <AddPrize {...this.props} current={current} prev={this.prev}></AddPrize>,
        }]
        status.map((item, index) => steps[index].status = item)
        return (
            <div>
                <div className={styles.stepsLayout} >
                    <Steps current={current}>
                        {steps.map((item, index) => <Step key={index} status={item.status} title={item.title} />)}
                    </Steps>
                </div>
                <br></br>
                <div className="steps-content">{steps[current].content}</div>
            </div>
        )
    }
}
export default StepModel
