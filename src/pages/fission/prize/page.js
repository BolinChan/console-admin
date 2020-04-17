import { Component } from "react"
import { connect } from "dva"
import { Row, Col, Tabs, Input, Icon } from "antd"
import styles from "../page.css"
import Prizes from "./components/Prizes"
// import Records from "./components/Records"
import AddPrize from "../act/components/AddPrize"
import axios from "axios"
const TabPane = Tabs.TabPane
// const Search = Input.Search
const url = "//wechat.yunbeisoft.com/index_test.php/home/prize"
const typeList = [
    { title: "全部", key: "" },
    // { title: "实物奖品", key: "1" },
    { title: "兑换码", key: "2" },
    { title: "自定义链接", key: "3" },
]

class page extends Component {
    state = {
        type: "",
        searchWord: "",
        prizeList: [],
        loading: false,
        editvisible: false,
        current: 1,
        name: "",
    }
    componentDidMount () {
        this.customRequest()
    }
    customRequest= (data) => {
        const formData = new FormData()
        formData.append("aid", window.sessionStorage.getItem("i"))
        if (data) {
            Object.keys(data).map((key) => {
                formData.append(key, data[key])
            })
        }
        this.setState({loading: true})
        axios.post(`${url}/get_prize?access_token=ACCESS_TOKEN`, formData).then(({ data: response }) => {
            if (!response.error) {
                this.setState({prizeList: response.data})
            }
            this.setState({loading: false})

        })
    }
    changeType = (e) => {
        const {name} = this.state
        let data = {page: 1, type: e}
        if (name && name.length > 0) {
            data.name = name
        }
        this.customRequest(data)
        this.setState({ type: e })
        if (e === "0") {
            this.setState({ name: "" })
        }
    }
    handleSearch = (e) => {
        const {value} = e.target
        let data = {page: 1, type: this.state.type, name: value}
        this.customRequest(data)
        // if (value && value.replace(/\s+/g, "").length > 0) {
        //     let data = {page: 1, type: this.state.type, name: value}
        //     this.customRequest(data)
        // }
        // this.setState({name: name.replace(/\s+/g, "")})
    }
    onChange=(e) => {
        this.setState({name: e.target.value})
    }
    pageChangeHandler=(page) => {
        const {type, name} = this.props
        let data = {page, type, name}
        this.setState({current: page})
        this.customRequest(data)
    }
    // 删除奖品
    deleteConfirm=(id) => {
        const formData = new FormData()
        formData.append("id", id)
        axios.post(`${url}/delete_prize?access_token=ACCESS_TOKEN`, formData).then(({ data: response }) => {
            if (!response.error) {
                let prizeList = this.state.prizeList
                prizeList = prizeList.filter((item) => item.id !== id)
                this.setState({prizeList})
            }
        })
    }
    handleCancel = () => {
        this.setState({
            editvisible: false,
        })
    }
    handleOk=(vaule) => {
        let prizeList = this.state.prizeList
        let index = prizeList.findIndex((item) => item.id === vaule.id)
        index !== "-1" && (prizeList[index] = vaule)
        this.setState({prizeList})
        this.handleCancel()
    }
    showModal = (record) => {
        this.setState({record, editvisible: true})
    }
    render () {
        const { type, prizeList, loading, editvisible, record, current, name} = this.state
        const {posterTotal} = this.props
        const extraContent = (
            <div className={styles.extraContent}>
                <div className={styles.linkList}>
                    {typeList.map((item) => (<a key={item.key} className={type === item.key ? styles.active : null} onClick={() => this.changeType(item.key)}>{item.title}</a>))}
                </div>
                <div><Input placeholder="搜索奖品名称" suffix={<Icon type="search" theme="outlined" />} value={name} onChange={this.onChange} style={{ width: 250 }} onPressEnter={this.handleSearch} /></div>
                {/* <div><Search placeholder="搜索奖品名称" onChange={this.onChange} style={{ width: 250 }} onSearch={this.handleSearch} /></div> */}
            </div >
        )
        // const data = [{
        //     key: "1",
        //     name: "John Brown",
        //     age: 32,
        //     address: "New York Park",
        // }, {
        //     key: "2",
        //     name: "Jim Green",
        //     age: 40,
        //     address: "London Park",
        // }]
        return (
            <div className={styles.container}>
                <Row className={styles.headerItems}>
                    <Col span={8} className={styles.headerItem}>
                        <p>兑换奖品总数</p>
                        <span>20</span>
                    </Col>
                    <Col span={8} className={styles.headerItem}>
                        <p>兑换码</p>
                        <span>9</span>
                    </Col>
                    <Col span={8} className={styles.headerItem}>
                        <p>自定义链接</p>
                        <span>5</span>
                    </Col>
                </Row>
                <div className={styles.dataList}>
                    <Tabs defaultActiveKey="1" size="large" tabBarExtraContent={extraContent} tabBarStyle={{ marginBottom: "20px" }}>
                        <TabPane tab="奖品列表" key="1">
                            <Prizes total={posterTotal} pageChangeHandler={this.pageChangeHandler} current={current}
                                loading={loading} showModal={this.showModal} deleteConfirm={this.deleteConfirm} data={prizeList} />
                        </TabPane>
                        {/* <TabPane tab="兑换记录" key="2">
                            <Records data={data} />
                        </TabPane> */}
                    </Tabs>
                </div>
                <AddPrize loading={loading} visible={editvisible} handleOk={this.handleOk} handleCancel={this.handleCancel} record={record} list={record}></AddPrize>
            </div>
        )
    }
}
function mapStateToProps (state) {
    const {posterTotal } = state.fission
    return { posterTotal }
}
export default connect(mapStateToProps)(page)
