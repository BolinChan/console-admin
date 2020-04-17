import { Form, Input, Row, Button, Icon } from "antd"
import AddForm from "./AddForm"
const FormItem = Form.Item
const OperaFrom = ({ form, dispatch }) => {
    const { getFieldDecorator } = form
    const formItemLayout = {
        style: { display: "flex", margin: 0 },
        labelCol: { style: { minWidth: 100 } },
        wrapperCol: { style: { flex: 1 } },
        colon: false,
    }
    const onSubmit = (e) => {
        e.preventDefault()
        form.validateFields((err, values) => {
            if (!err) {
                dispatch({
                    type: "auxiliary/fetchKeyData",
                    payload: values,
                })
            }
        })
    }
    const AllFun = () => {
        dispatch({
            type: "auxiliary/fetchKeyData",
        })
        form.setFieldsValue({
            keyword: "",
        })
    }
    return (
        <Form onSubmit={onSubmit}>
            <Row type="flex" justify="space-between" align="middle">
                <AddForm dispatch={dispatch} action="addKeyData">
                    <Button type="primary" icon="plus-circle">新增敏感词</Button>
                </AddForm>
                <div className="f">
                    <FormItem {...formItemLayout} label=" ">
                        {getFieldDecorator("keyword")(<Input style={{width: 300}} suffix={<Icon type="search" />} autoComplete="off" placeholder="请输入敏感词" />)}
                    </FormItem>&nbsp;&nbsp;
                    <FormItem {...formItemLayout}>
                        {/* <Button type="primary" htmlType="submit">
                            搜索
                        </Button>
                        &nbsp;&nbsp; */}
                        <Button type="primary" onClick={AllFun}>
                            重置
                        </Button>
                    </FormItem>
                </div>

            </Row>
        </Form>
    )
}
const RecordSearcheForm = Form.create()(OperaFrom)
export default RecordSearcheForm
