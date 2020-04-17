import {Input, Form, Icon} from "antd"
import { Component } from "react"
const FormItem = Form.Item
class Content extends Component {
    state={acceptList: [undefined]}
    componentDidMount () {
        let {acceptList} = this.state
        if (this.props.acceptList) {
            acceptList = this.props.acceptList
        } else {
            acceptList = [""]
        }
        this.setState({acceptList})
    }
     onChangeFun = () => {
         const {onChange, form} = this.props
         const {acceptList} = this.state
         form.validateFields((err, values) => {
             if (!err) {
                 let content = []
                 acceptList && acceptList.map((item, index) => {
                     const text = form.getFieldValue(`index${index}`)
                     text && content.push(text)
                 })
                 onChange && onChange({id: this.props.contentid, content})
             }
         })
     }
     delContent = (index) => () => {
         let {acceptList} = this.state
         acceptList.splice(index, 1)
         this.setState({acceptList})
         this.props.onChange && this.props.onChange({id: this.props.contentid, content: acceptList})
     }
    // 添加回复内容
     addContent = () => {
         let {acceptList} = this.state
         acceptList.push("")
         this.setState({acceptList})
     }

     render () {
         const {form} = this.props
         const { getFieldDecorator} = form
         const {acceptList} = this.state
         const style = {position: "absolute", right: "-50px", width: 50, paddingLeft: 10}
         return (
             <div onChange={this.onChangeFun}>
                 {acceptList && acceptList.map((mess, i) => <FormItem key={i} style={{margin: 0}}>
                     {getFieldDecorator(`index${i}`, {initialValue: mess })(<Input placeholder="请输入内容"/>)}
                     {i === 0
                         ? <a onClick={this.addContent} style={style} title="点击添加内容"><Icon type="plus-square" /> </a>
                         : <a title="点击删除" style={{color: "red", ...style }} onClick={this.delContent(i)}>
                             <Icon type="minus-square" />
                         </a>
                     }
                 </FormItem>)}
             </div>
         )
     }
}
const ListForm = Form.create()(Content)
export default ListForm
