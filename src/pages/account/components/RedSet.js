import { Form, InputNumber, Modal, Table, Button, message, Avatar} from "antd"
import styles from "../page.css"
const FormItem = Form.Item
const columns = [
    {title: "余额", dataIndex: "balance"},
    {title: "变更金额", dataIndex: "money"},
    {title: "类型", dataIndex: "remark"},
    {title: "时间", dataIndex: "createtime"},
    {title: "接收人",
        dataIndex: "headimg",
        render: (headimg, row) => headimg ? <div className="f fc">
            <Avatar icon="user" src={headimg}/>
            <span className="ml10">{row.nickname}</span>
        </div> : "",
    },
]
const RedSet = ({ form, visible, handleSubmit, handleCancel, record, total, balanceList, loading, onChangePage, current, loadingButton }) => {
    const { getFieldDecorator } = form
    const onSubmit = (e) => {
        e.preventDefault()
        form.validateFields((err, values) => {
            if (!err) {
                if (!values.money) {
                    return message.error("请输入充值金额")
                }
                if (handleSubmit) {
                    handleSubmit(values)
                }
            }
        })
    }
    const paginationConfig = {
        total,
        defaultPageSize: 10,
        hideOnSinglePage: true,
        current,
        onChange: onChangePage,
    }
    return (
        <Modal title={record.accountnum + "帐号红包设置"} visible={visible} onOk={onSubmit} onCancel={handleCancel} footer={null} destroyOnClose={true} width={640} wrapClassName="wrapClass"
            bodyStyle={{ height: "calc(100% - 55px)", overflow: "hidden", overflowY: "auto"}}
            style={{ height: "70%", padding: 0, top: "10%", maxHeight: 640 }}
        >
            <Form layout="inline" className={styles.blM}>
                <FormItem label="帐户余额">{record.balance}</FormItem>
                <FormItem label="变更金额">{getFieldDecorator("money")(<InputNumber style={{width: 100}} placeholder="请输入金额"/>)}
                </FormItem>
                <FormItem><Button type="primary" onClick={onSubmit} loading={loadingButton}>充值</Button></FormItem>
            </Form>
            <Table size="small" dataSource={balanceList} bordered={true} pagination={paginationConfig} columns={columns} rowKey="id" simple loading={loading} />
        </Modal>
    )
}
const SetForm = Form.create()(RedSet)
export default SetForm
