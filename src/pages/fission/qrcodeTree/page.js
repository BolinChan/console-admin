import { Component } from "react"
import { connect } from "dva"
import { Tree, Avatar, Spin } from "antd"
import styles from "../page.css"
const { TreeNode } = Tree
class Page extends Component {
    componentDidMount () {
        const { location, dispatch } = this.props
        let id = location.query.id
        dispatch({
            type: "fission/getQrcodeTree",
            payload: { taskId: id },
        })
    }
    componentWillUnmount () {
        this.props.dispatch({
            type: "fission/Unmount",
        })
    }
    renderTreeNodes = (data) => data.map((item) => {
        if (item.children) {
            return (
                <TreeNode title={
                    <div>
                        <Avatar src={item.headimgurl} icon="user" />
                        <strong className={styles.treeName} style={{ color: "#1890ff" }}>{item.nickname || "未知"}</strong>
                        <span className={styles.treeName} style={{ color: "rgba(0,0,0,0.7)" }}>{item.add_time}</span>
                    </div>} key={item.id} >
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            )
        }
        return <TreeNode title={
            <div>
                <Avatar src={item.headimgurl} icon="user" />
                <strong className={styles.treeName} style={{ color: "#1890ff" }}>{item.nickname || "未知"}</strong>
                <span className={styles.treeName} style={{ color: "rgba(0,0,0,0.7)" }}>{item.add_time}</span>
            </div>
        } key={item.id} ></TreeNode>
    })
    render () {
        const { qrcodeTree, loading } = this.props
        return (
            <div style={{ padding: 16 }}>
                <Spin tip="Loading..." spinning={loading}>
                    <div style={{ marginBottom: 30 }}>
                        <a href="#/fission/act" className={styles.backa} >返回</a>
                    </div>
                    {qrcodeTree && qrcodeTree.length ? <div id="treeTed">
                        <Tree showLine defaultExpandAll={true}>
                            {this.renderTreeNodes(qrcodeTree)}
                        </Tree>
                    </div> : <div>暂无数据</div>}
                </Spin>
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { qrcodeTree } = state.fission
    return {
        qrcodeTree,
        loading: state.loading.models.fission,
    }
}
export default connect(mapStateToProps)(Page)

