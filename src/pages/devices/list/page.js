import { Component } from "react"
import { connect } from "dva"
import { Button, Popconfirm } from "antd"
import DeviceTable from "./components/DeviceTable"
import DeviceForm from "./components/DeviceForm"
import AddDevice from "./components/AddDevice"
import styles from "../page.css"
import SetGroup from "./components/SetGroup"
class Page extends Component {
    state={isloading: true, selectedRowKeys: [], page: 1}
    componentDidUpdate (nextProps) {
        if (!this.props.loading && nextProps.loading && this.state.isloading) {
            this.setState({isloading: false})
        }
    }
    // 添加设备
    hanldAdd = (value) => {
        const { devGroupList, dispatch } = this.props
        if (value.index) {
            value.zu_id = devGroupList[value.index].id
            value.zuname = devGroupList[value.index].name
        }
        dispatch({
            // type: "devices/addDevices",
            type: "devices/addEditDevices",
            payload: value,
        })
        this.setState({isloading: true})
    }
    // 删除设备
    deleteConfirm = (id) => {
        this.props.dispatch({
            type: "devices/delDevices",
            payload: { id },
        })
        this.setState({isloading: true, selectedRowKeys: []})
    }
    // 编辑设备
    hanldEdit = (row) => (value) => {
        const { devGroupList, dispatch } = this.props
        if (value.index && value.index !== -1) {
            value.zu_id = devGroupList[value.index].id
            value.zuname = devGroupList[value.index].name
        }
        dispatch({
            type: "devices/addEditDevices",
            payload: { sncode: row.sncode, id: row.id, ...value },
        })
        this.setState({isloading: true})
    }
    onChangeSort=(record, Sort) => {
        this.props.dispatch({
            type: "devices/addEditDevices",
            payload: { ...record, Sort, op: "sort"},
        })
    }
    // 搜索
    handleSubmit = (values) => {
        this.props.dispatch({
            type: "devices/fetchDevices",
            payload: {...values, page: 1},
        })
        this.setState({isloading: true, values, page: 1})
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys})
    }
    onSelect=(value) => {
        let {selectedRowKeys} = this.state
        const {devices} = this.props
        if (value === "all" && devices) {
            selectedRowKeys = devices.map((item) => item.id)
        } else {
            selectedRowKeys = []
        }
        this.setState({ selectedRowKeys })
    }
    hanldChangePage=(page) => {
        this.props.dispatch({
            type: "devices/fetchDevices",
            payload: {...this.state.values, page},
        })
        this.setState({page})
    }
    render () {
        const { devices, devGroupList, maxnum, num, loading, devtotal, dispatch} = this.props
        const {selectedRowKeys, page} = this.state
        const hasSelected = selectedRowKeys && selectedRowKeys.length > 0
        return (
            <div className="pad10">
                <div className="pad10"><DeviceForm list={devGroupList} handleSubmit={this.handleSubmit}/></div>
                <div className="pad10">
                    <AddDevice onOk={this.hanldAdd} devGroupList={devGroupList}>
                        <Button className="mr10" type="primary" disabled={devices && devices.length >= maxnum}>
                            新增设备
                        </Button>
                    </AddDevice>
                    <SetGroup action="setDevicesGroup" dispatch={dispatch} devGroupList={devGroupList} selectedRowKeys={selectedRowKeys}>
                        <Button disabled={!hasSelected} type="primary" className="mr10">批量设置分组</Button>
                    </SetGroup>
                    <Popconfirm title="确定要删除吗？" onConfirm={() => this.deleteConfirm(selectedRowKeys)}>
                        <Button disabled={!hasSelected} type="danger" className="mr10">
                            批量删除
                        </Button>
                    </Popconfirm>
                    <span className={styles.prompt}>
                        已接入设备
                        {num || 0}/{maxnum || 0}
                    </span>
                    <span>{hasSelected ? `已选择 ${selectedRowKeys.length} 项` : ""}</span>
                </div>
                <div className="pad10">
                    <DeviceTable
                        {...this.props}
                        loading={this.state.isloading && loading}
                        hanldEdit={this.hanldEdit}
                        deleteConfirm={this.deleteConfirm}
                        onSelectChange={this.onSelectChange}
                        selectedRowKeys={selectedRowKeys}
                        onSelect={this.onSelect}
                        onChangeSort={this.onChangeSort}
                        hanldChangePage={this.hanldChangePage}
                        current={page}
                        total={devtotal}
                    />
                </div>
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { devices, devGroupList, maxnum, num, devtotal} = state.devices
    return {
        devices,
        loading: state.loading.models.devices,
        devGroupList,
        maxnum,
        num,
        devtotal,
    }
}
export default connect(mapStateToProps)(Page)
