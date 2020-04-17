import {Input, Radio, Icon, Popconfirm, Row, Form, message, InputNumber } from "antd"
import UploadImg from "../../../components/UploadImg"
import UploadVideo from "../../../components/UploadVideo"
const { TextArea } = Input
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const FormItem = Form.Item
const ReplyContent = ({ acceptList, formItemLayout, form, isAutoRe, changeContent, styleContent, title, isvideo, showTime}) => {
    const {getFieldValue, getFieldDecorator} = form
    // 添加回复内容
    const addArea = () => {
        let len = acceptList && (acceptList.filter((item) => !item.isdelete).length - 1)
        const isTrue = (getFieldValue(`type${len}`) === "1" && getFieldValue(`text${len}`)) ||
         (getFieldValue(`type${len}`) === "2" && getFieldValue(`img${len}`)) ||
         (getFieldValue(`type${len}`) === "4" && getFieldValue(`url${len}`))
        if (isTrue || !acceptList || acceptList.length === 0) {
            acceptList.push({type: "1", text: "", img: ""})
        } else {
            message.error("请填写回复内容")
        }
        changeContent && changeContent(acceptList)
    }
    const delContent = (index) => () => {
        acceptList[index].isdelete = true
        changeContent && changeContent(acceptList)
    }
    const visibleDelete = acceptList && acceptList.filter((item) => !item.isdelete)
    let step = 1
    return (
        <div>
            {acceptList && acceptList.map((item, index) => {
                if (item.isdelete) {
                    return
                }
                const label = <span><span style={{fontSize: "16px"}}>{step++}</span> .  {title || "回复内容"}</span>
                return <div key={index}>
                    <FormItem {...formItemLayout} label={label} style={{marginBottom: 5}}>
                        <Row type="flex" justify="space-between">
                            {form.getFieldDecorator(`type${index}`, { initialValue: step === 2 && isvideo && item.type === "4" ? "1" : item.type})(
                                <RadioGroup>
                                    <RadioButton value="1">文字</RadioButton>
                                    {<RadioButton value="2">图片</RadioButton>}
                                    {!(step === 2 && isvideo) && <RadioButton value="4">视频</RadioButton>}
                                </RadioGroup>
                            )}
                            {visibleDelete.length > 1 &&
                             <Popconfirm title="确定要删除吗?" onConfirm={delContent(index)}>
                                 <a style={{color: "#f5222d"}}><Icon type="delete" /> 删除内容</a>
                             </Popconfirm>}
                        </Row>
                    </FormItem>
                    <FormItem label=" " {...formItemLayout} colon={false} style={styleContent}>
                        {getFieldValue(`type${index}`) === "1" &&
                            getFieldDecorator(`text${index}`, { initialValue: item.text })(
                                <TextArea rows={6} disabled={!isAutoRe} placeholder="请输入内容" style={{ resize: "none" }} />
                            )}
                        {getFieldValue(`type${index}`) === "2" && getFieldDecorator(`img${index}`, {initialValue: item.img && [item.img]})(<UploadImg uploadMaxNum={1} />)}
                        {getFieldValue(`type${index}`) === "4" && getFieldDecorator(`url${index}`, {initialValue: item.url && item.url})(<UploadVideo/>)}
                    </FormItem>
                    {showTime && <FormItem label="等待时间(s)" {...formItemLayout}>
                        {getFieldDecorator(`time${index}`,
                            {initialValue: item && item.time || "3", rules: [{ required: true, message: "请选择等待时间!" }]})(<InputNumber style={{width: "100%"}} min={0} placeholder="等待时间单位秒"/>)}
                    </FormItem>}
                </div>
            })}
            <FormItem {...formItemLayout} label=" " colon={false} style={{padding: 0}}>
                { <a onClick={addArea}><Icon type="plus-circle" style={{fontSize: "16px"}}/>&nbsp;添加回复内容</a>}
            </FormItem>
        </div>
    )
}
export default ReplyContent
