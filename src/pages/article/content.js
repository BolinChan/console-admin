import { Component } from "react"
import { connect } from "dva"
import { Button, Row, Popover, message } from "antd"
import styles from "./page.css"
import Record from "./components/Record"
import Editor from "./components/Editor"
import Analysis from "./components/Analysis"
import request from "../../utils/request"
const url = "//wechat.yunbeisoft.com/index_test.php/home/article/copyArticle"
class Page extends Component {
    state = {
        id: "",
        visible: false,
        page: 1,
        values: {},
        pageSize: 12,
        type: this.props.type || "3",
    }
    componentDidMount () {
        this.fetchData()
    }
    fetchData = () => {
        const { dispatch, all } = this.props
        const {type, page} = this.state
        dispatch({ type: "article/fetchArticle", payload: {all, page, type} })
        dispatch({ type: "article/getMiniQrcode" })
    }
    pageChangeHandler = async (page) => {
        await this.setState({ page })
        this.fetchData()
    }
    showAnalysis = (itemList) => {
        this.setState({ analy: true, itemList })
    }
    showEditor = (id, pervisible) => {
        this.setState({ visible: true, id, pervisible })
    }
    closeEditor = () => {
        this.setState({ visible: false, analy: false })
    }
    submitEditor = async (payload) => {
        await this.props.dispatch({ type: "article/edit", payload })
        this.fetchData()
        this.closeEditor()
    }
    deleteConfirm = (id) => {
        this.props.dispatch({
            type: "article/del",
            payload: { id },
        })
    }
    onChangeType=async (e) => {
        await this.setState({type: e.target.value})
        this.fetchData()
    }
    // 收藏
    onCollection=async (article_id, item) => {
        const option = {method: "post", url, data: JSON.stringify({article_id})}
        let {data} = await request(option)
        if (data.error) {
            return message.error(data.errmsg)
        }
        item.color = "#f5222d"
        this.setState({article_id})
        message.success("已成功拷贝到我的分享")
    }
    render () {
        const { minQrcode, auth } = this.props
        const { visible, id, analy, page, pageSize, type, pervisible} = this.state
        const moren = auth && Number(auth.moren)
        return (
            analy
                ? <Analysis handleChance={this.closeEditor} {...this.state} />
                : <div className={styles.wz}>
                    <div style={{ display: visible && !pervisible ? "none" : "block" }} className={styles.rec + " pad10"}>
                        {type !== "0" && <Row className="pad10 fj" type="flex" align="middle">
                            <div>
                                <Button type="primary" onClick={() => this.showEditor("")}>新增分享</Button>
                                <Popover
                                    placement="bottom"
                                    content={<img alt="" src={minQrcode} style={{ height: 200, width: 200 }}/>}
                                >
                                    <a style={{ marginLeft: 50 }}>扫码绑定小程序，随时随地看数据</a>
                                </Popover>
                            </div>
                        </Row>}
                        <Record
                            {...this.props}
                            moren={moren}
                            type={type}
                            current={page}
                            pageSize={pageSize}
                            deleteConfirm={this.deleteConfirm}
                            pageChangeHandler={this.pageChangeHandler}
                            showEditor={this.showEditor}
                            showAnalysis={this.showAnalysis}
                            onCollection={this.onCollection}
                        />
                    </div>
                    {visible && <div className="pad20">
                        <Editor
                            submitEditor={this.submitEditor}
                            closeEditor={this.closeEditor}
                            id={id}
                            moren={moren}
                            pervisible={pervisible}
                        />
                    </div>}
                </div>
        )
    }
}
function mapStateToProps (state) {
    const { articledata, total, minQrcode } = state.article
    return {
        articledata,
        total,
        minQrcode,
        auth: state.login.auth,
        loading: state.loading.models.article,
    }
}
export default connect(mapStateToProps)(Page)
