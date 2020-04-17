import { Modal, Button, Pagination, Row } from "antd"
import { Component } from "react"
import { connect } from "dva"
import styles from "./BuddyChat.css"
// import RecordList from "./RecordList"
import SearchRecord from "./SearchRecord"
import Sidebar from "./Sidebar"
import GroupUser from "./GroupUser"
class BuddyChat extends Component {
    state = { visible: false }
    showModal = () => {
        this.setState({
            visible: true,
        })
    }
    handleOk = (e) => {
        const { form, onOk } = this.props
        form.validateFields((err, values) => {
            if (!err) {
                onOk(values)
            }
        })
        this.setState({
            visible: false,
        })
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        })
    }
    handleChangeCurrent = (currentContactId) => {
        this.setState({ currentContactId })
    }
    selectDate = (tiem) => {
        this.setState({ tiem })
    }
    onChangeSearchText = (e) => {
        this.setState({ searchText: e.targrt.values })
    }
    render () {
        const { contacts, weChatList } = this.props
        const { currentContactId, searchText } = this.state
        // let contact = contacts && contacts.find((item) => item.userid === currentContactId)
        return (
            <div>
                <Button type="primary" onClick={this.showModal} disabled>
                    {this.props.children}
                </Button>
                <Modal
                    footer={null}
                    bodyStyle={{ height: "calc(100% - 55px)", overflow: "hidden", padding: 0 }}
                    wrapClassName={styles.buddy}
                    style={{ height: "90%", padding: 0, top: "5%" }}
                    width="60%"
                    title={this.props.children}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >
                    <Row type="flex" className={styles.H}>
                        <Sidebar devices={weChatList} contacts={contacts} handleChangeCurrent={this.handleChangeCurrent} currentContactId={currentContactId} />
                        <div className={styles.rightBox}>
                            <SearchRecord onChangeSearchText={this.onChangeSearchText} searchText={searchText} selectDate={this.selectDate} />
                            {/* <RecordList messages={messages} contact={contact} devices={weChatList} searchText={searchText} /> */}
                            <div className={styles.footer}>
                                <Pagination defaultCurrent={1} total={50} showTotal={() => `共 ${50} 条 `} />
                            </div>
                        </div>
                        <GroupUser devices={weChatList} contacts={contacts} handleChangeCurrent={this.handleChangeCurrent} currentContactId={currentContactId} />
                    </Row>
                </Modal>
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { weChatList, contacts } = state.chat
    return {
        weChatList,
        contacts,
        loading: state.loading.models.chat,
    }
}
export default connect(mapStateToProps)(BuddyChat)
