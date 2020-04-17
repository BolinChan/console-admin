import {Component} from "react"
import {connect} from "dva"
import { Button, Row} from "antd"
import FieldForm from "./components/FieldForm"
import Record from "./components/Record"

const TyList = [
    {id: "1", value: "数字类型"},
    {id: "2", value: "字符类型"},
    {id: "3", value: "多行字符类型"},
    {id: "4", value: "日期类型"},
    {id: "5", value: "日期时间类型"},
    {id: "6", value: "单选类型"},
    {id: "7", value: "多选类型"}]
class Page extends Component {
    state={page: 1, visible: false}
    deleteConfirm=(id) => {
        this.props.dispatch({
            type: "chat/delField",
            payload: {id},
        })
    }
    showModal=(record) => {
        this.setState({record, visible: true})
    }
    handleCancel=() => {
        this.setState({visible: false})
    }
    onMove=(record, type) => {
        const {fieldata, dispatch} = this.props
        let index = fieldata.findIndex((item) => item.id === record.id)
        if (type === "up") {
            dispatch({type: "chat/orderField", payload: {topid: record.id, bottomid: fieldata[index - 1].id}})
        }
        if (type === "down") {
            dispatch({type: "chat/orderField", payload: {bottomid: record.id, topid: fieldata[index + 1].id}})
        }
    }
    render () {
        const {visible, current} = this.state
        const {fieldata, fieldtotal, loading} = this.props
        return (
            <div className="pad10">
                <Row className="pad10" type="flex" justify="space-between">
                    <Button type="primary" onClick={this.showModal}>新增字段</Button>
                    <FieldForm {...this.props} TyList={TyList} visible={visible} handleCancel={this.handleCancel}></FieldForm>
                </Row>
                <Record loading={loading} data={fieldata} total={fieldtotal} current={current} deleteConfirm={this.deleteConfirm} TyList={TyList} onMove={this.onMove}></Record>
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { fieldata, fieldtotal } = state.chat
    return {
        fieldata,
        fieldtotal,
        loading: state.loading.models.chat,
    }
}
export default connect(mapStateToProps)(Page)
