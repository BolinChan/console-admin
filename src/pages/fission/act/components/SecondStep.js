import { Form, Input, Button} from "antd"
import styles from "../../page.css"
const FormItem = Form.Item
const {TextArea} = Input
const extraList = [
    "参考例子：您的朋友#昵称#关注了，您现在已完成#已完成#个任务，离总目标#总数#，还有#剩余数#个继续加油哦！",
    "参考例子：双11免费领取，快来一起参与吧 ### 快来跟我一起参与双11大战吧(注：如需多段内容随机发送，每段内容用###分开即可)",
    "参考例子：#昵称#：欢迎关注，你是由#上级#推荐的，分享朋友关注可免费兑换礼品！ 复制下面的文字和图片，分享到朋友圈，群，邀请 10个人就可以免费领取拉。",
    "参考例子：#昵称#恭喜您完成任务了，您的兑换码是#兑换码#（或者您的链接是#链接#），稍等我会主动联系你兑换，不要捉鸡，不要捉鸡。", "参考例子：长按识别图中的二维码，加我为好友，免费领取xxx礼品"]
const SecondStep = ({form, record, onsubmit, prev, onValuesChange}) => {
    const handleSubmit = (e) => {
        form.validateFields((err, values) => {
            if (!err) {
                // values.firstHint = " "
                if (e === "isChange") {
                    onValuesChange && onValuesChange(values)
                    return
                }
                onsubmit && onsubmit(values)
            }
        })
    }
    const { getFieldDecorator } = form
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 17 },
    }
    return (
        <Form onChange={() => handleSubmit("isChange")}>
            <FormItem {...formItemLayout} label="活动未开始提示语">
                {getFieldDecorator("notStartHint",
                    { initialValue: record && record.notStartHint || "亲，活动尚未开始，请耐心等待", rules: [{ required: true, message: "请输入提示语" }] })(<TextArea placeholder="请输入提示语" autosize={{ minRows: 1 }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="活动结束提示语">
                {getFieldDecorator("c",
                    { initialValue: record && record.endHint || "亲，感谢你的参与，本次活动已经结束。", rules: [{ required: true, message: "请输入提示语" }] })(<TextArea placeholder="请输入提示语" autosize={{ minRows: 1 }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="活动暂停提示语">
                {getFieldDecorator("pauseHint",
                    { initialValue: record && record.pauseHint || "亲，活动已暂停，请耐心等待活动恢复。", rules: [{ required: true, message: "请输入提示语" }] })(<TextArea placeholder="请输入提示语" autosize={{ minRows: 1 }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="发送给上级" extra={extraList[0]}>
                {getFieldDecorator("parentHint", { initialValue: record && record.parentHint})(<TextArea placeholder="请输入提示语" autosize={{ minRows: 4 }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="分享引导语" extra={extraList[1]}>
                {getFieldDecorator("firstPicHint",
                    { initialValue: record && record.firstPicHint, rules: [{ required: true, message: "请输入提示" }] })(<TextArea placeholder="请输入提示语" autosize={{ minRows: 4 }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="新会员提示语" extra={extraList[2]}>
                {getFieldDecorator("newMemberHint",
                    { initialValue: record && record.newMemberHint})(<TextArea placeholder="请输入提示语" autosize={{ minRows: 4 }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="任务完成提示语" extra={extraList[3]}>
                {getFieldDecorator("actOverHint",
                    { initialValue: record && record.actOverHint, rules: [{ required: true, message: "请输入提示" }] })(<TextArea placeholder="请输入提示语" autosize={{ minRows: 4 }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="落地页引导语" extra={extraList[4]}>
                {getFieldDecorator("landPageHint", { initialValue: record && record.landPageHint })(<TextArea placeholder="请输入引导语" autosize={{ minRows: 4 }} />)}
            </FormItem>
            <div className={styles.formboot}>
                <Button className="mr10" onClick={prev}>上一步</Button>
                <Button type="primary" onClick={handleSubmit}>下一步</Button>
            </div>
        </Form>
    )
}
const setForm = Form.create()(SecondStep)
export default setForm
