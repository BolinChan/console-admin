import { Component } from "react"
import Sidebar from "./components/Sidebar"
import Content from "./components/Content"
import Allocation from "./components/Allocation"
import {message} from "antd"
import {connect} from "dva"
import styles from "./page.css"
class Page extends Component {
    state={targetKeys: [], selectedKeys: []}
    onSelect=(id) => {
        const {partmentList} = this.props
        let list = partmentList && partmentList.find((item) => item.id === id[0])
        this.setState({selectID: id[0], targetKeys: list ? list.rights_id : []})
    }
    // 选择权限
    handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] })
    }
    // 分配权限
    handleChange = async (nextTargetKeys, direction, moveKeys) => {
        if (!this.state.selectID) {
            return message.error("请选择部门")
        }
        let isTrue = await this.props.dispatch({
            type: "account/allotpartment",
            payload: {rights_id: nextTargetKeys, id: this.state.selectID},
        })
        if (isTrue) {
            this.setState({ targetKeys: nextTargetKeys })
        }
    }
    radioChange=(e) => {
        this.setState({iservice: e.target.value})
    }
    render () {
        let {dispatch, partmentList, permissions, loading} = this.props
        let {targetKeys, selectID, selectedKeys, iservice} = this.state
        let permissList = []
        permissions && permissions.map((item) => {
            // let title = item.is_service === "1" ? item.rights_name + "（管理端）" : item.rights_name + "（客服端）"
            // permissList.push({title, key: item.id, is_service: item.is_service})
            permissList.push({title: item.rights_name, key: item.id, is_service: item.is_service})
        })
        if (iservice && iservice !== "") {
            permissList = permissList.filter((item) => item.is_service === iservice)
        }
        let list = partmentList && partmentList.find((item) => item.id === selectID)
        return (
            <div className={styles.boxFl}>
                <div className={styles.left}><Sidebar list={list || {}} loading={loading} onSelect={this.onSelect} partmentList={partmentList} dispatch={dispatch}></Sidebar></div>
                <div className={styles.right}>
                    <Content list={list || {}} dispatch={dispatch}></Content>
                    <Allocation
                        iservice={iservice}
                        handleSelectChange={this.handleSelectChange}
                        data={permissList}
                        list={list}
                        dispatch={dispatch}
                        handleChange={this.handleChange}
                        selectedKeys={selectedKeys}
                        targetKeys={targetKeys}
                        radioChange={this.radioChange}/>
                </div>
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { partmentList, permissions } = state.account
    return {
        partmentList,
        permissions,
        loading: state.loading.models.account,
    }
}
export default connect(mapStateToProps)(Page)
