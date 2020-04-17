
import { Checkbox, Row, DatePicker, Modal, Form } from "antd"
import SearchInput from "../../../components/SearchInput"
import styles from "../page.css"
import moment from "moment"
const {RangePicker} = DatePicker
const FormItem = Form.Item
const SearchResult = ({form, accountList, action, title, options, record, searchVaule, visible, handleCancel, dispatch }) => {
    const { getFieldDecorator, validateFields } = form
    const modalOk = () => {
        validateFields(async (err, values) => {
            const {time} = values
            if (time) {
                options.StartTime = moment(time[0]._d).format("YYYY-MM-DD")
                options.EndTime = moment(time[1]._d).format("YYYY-MM-DD")
            }
            if (!err) {
                // 同步好友历史记录
                if (action === "getHistoryMsg") {
                    dispatch({ type: "message/getHistoryMsg", payload: options})
                    handleCancel()
                    return
                }
                // 取消搜索结果"deleteSelectFriend"
                // 分配客服selectFriend
                await dispatch({ type: `chat/${action}`, payload: {...options, ...values} })
                dispatch({ type: "chat/fetchContactList", payload: searchVaule})
                handleCancel()
            }
        })
    }
    return (
        <Modal
            visible={visible}
            title={title}
            onCancel={handleCancel}
            onOk={modalOk}
        >
            <div className={styles.modalItem}>选择的好友数量：{options.total}</div>
            {record && <Row type="flex" align="middle" className={styles.modalItem}>
                <img src={record.headImg} style={{ width: 40, height: 40 }} alt="头像" />
                <div className="pad10">
                    <p>昵称：{record.nick}</p>
                    <p>微信：{record.FriendNo || "未知"}</p>
                </div>
            </Row>}
            <Form>
                {action !== "getHistoryMsg"
                    ? <div>
                        {action !== "deleteSelectFriend" &&
                     <FormItem className={styles.modalItem}>
                         {getFieldDecorator("unique")(<Checkbox>好友去重分配</Checkbox>)}
                     </FormItem>
                        }
                        <FormItem className={styles.modalItem}>
                            {getFieldDecorator("kfId")(
                                <SearchInput data={accountList} style={{ width: 200 }}></SearchInput>
                            )}
                        </FormItem>
                    </div>
                    : <FormItem className="pad10" label="选择日期：">
                        {getFieldDecorator("time")(<RangePicker format="YYYY-MM-DD" allowClear={false} ranges={{
                            "今天": [moment(), moment()],
                            "昨天": [moment().days(moment().days() - 1)
                                .startOf("days"), moment().days(moment().days() - 1)
                                .endOf("days")],
                            "过去一周": [moment().days(moment().days() - 7)
                                .startOf("days"), moment().endOf(moment())],
                            "过去一个月": [moment().days(moment().days() - 30)
                                .startOf("days"), moment().endOf(moment())],
                            "过去半年": [moment().days(moment().days() - 183)
                                .startOf("days"), moment().endOf(moment())],
                        }}/>)}
                    </FormItem>}
            </Form>
        </Modal>
    )
}
const RecordSearcheForm = Form.create()(SearchResult)
export default RecordSearcheForm
