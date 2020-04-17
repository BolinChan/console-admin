import { Component } from "react"
import { connect } from "dva"
import { Table } from "antd"
import styles from "../page.css"
class Page extends Component {
    state = { current: 1, nick: "", status: null }
    componentDidMount () {
        const { location, dispatch } = this.props
        let id = location.query.id
        dispatch({
            type: "fission/getTimeTotal",
            payload: { taskId: id },
        })
    }


    render () {
        const { timeLst, loading } = this.props
        const columns = [{
            title: "",
            dataIndex: "time",
            // width: 500,
            render: (time) => (
                <div>{time}</div>
            ),
        },
        {
            title: "前天(总扫码数)",
            dataIndex: "lstotall",
            align: "center",
        },
        {
            title: "前天(成功加好友数)",
            dataIndex: "ltotal",
            align: "center",
        },
        {
            title: "昨天(总扫码数)",
            dataIndex: "ystotal",
            align: "center",
        },
        {
            title: "昨天(成功加好友数)",
            dataIndex: "ytotal",
            align: "center",
        },
        {
            title: "今天(总扫码数)",
            dataIndex: "stotal",
            align: "center",
        },
        {
            title: "今日(成功加好友数)",
            dataIndex: "total",
            align: "center",
        },
        ]
        return (
            <div className="pad20" >
                <a href="#/fission/act" className={styles.backa} style={{float: "left"}}>返回</a>
                <div style={{marginTop: 40}}>

                    <Table bordered columns={columns} dataSource={timeLst} rowKey="idtable" pagination={false} loading={loading} />
                </div>
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { timeLst } = state.fission
    return {
        timeLst,
        loading: state.loading.models.fission,
    }
}
export default connect(mapStateToProps)(Page)

