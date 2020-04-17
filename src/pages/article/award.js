import {Component} from "react"
import { Table, Row, Col, Button, Input } from "antd"
import statStyle from "../statistical/page.css"
import { connect } from "dva"
const Search = Input.Search

const columns = [
    {title: "推广用户", dataIndex: "user"},
    {title: "文章总数", dataIndex: ""},
    {title: "累计分享", dataIndex: ""},
    {title: "累计推广", dataIndex: ""},
    {title: "累计提现", dataIndex: ""},
    {title: "操作", dataIndex: ""},
]
class Award extends Component {
    state={}
    onChangePage=(current) => {
        this.setState({current})
    }
    onSearch=(value) => {
        this.setState({value})
    }
    onSelectChange=(selectRowKeys) => {
        this.setState({selectRowKeys})
    }
    render () {
        const {awardList} = this.props
        const {current, selectRowKeys} = this.state
        const pagination = {
            total: awardList.length,
            defaultPageSize: 10,
            hideOnSinglePage: true,
            current,
            onChange: this.onChangePage,
            showTotal: `共 ${awardList.length} 条 `,
        }
        const rowSelection = {
            selectRowKeys,
            onChange: this.onSelectChange,
        }
        return (
            <div>
                <div className={statStyle.container}>
                    <Row className={statStyle.headerItems} style={{marginBottom: 20, padding: 20}}>
                        <Col span={8} className={statStyle.headerItem}>
                            <p>未领取奖励</p>
                            <span>{1000}</span>
                            <Button style={{position: "absolute", marginLeft: 20}} type="primary">提现</Button>
                        </Col>
                        <Col span={8} className={statStyle.headerItem}>
                            <p>累计奖励</p>
                            <span>{1000}</span>
                        </Col>
                        <Col span={8} className={statStyle.headerItem}>
                            <p>提现奖励</p>
                            <span>{100}</span>
                        </Col>
                    </Row>
                </div>
                <div className="pad10">
                    <div className="pad10 f fj">
                        <Button type="primary">查看推广海报</Button>
                        <Search
                            style={{width: 300}}
                            placeholder="请输入"
                            onSearch={this.onSearch}
                            enterButton
                        />
                    </div>
                    <div className="pad10">
                        <Table dataSource={awardList} columns={columns} rowKey="id" rowSelection={rowSelection} pagination={pagination}/>
                    </div>
                </div>

            </div>

        )
    }
}
function mapStateToProps (state) {
    const {awardList} = state.article
    return {awardList}
}
export default connect(mapStateToProps)(Award)
