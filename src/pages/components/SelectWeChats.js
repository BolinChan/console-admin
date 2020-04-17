import SelectWeChat from "./SelectWeChat"
import { Checkbox } from "antd"
import { Component} from "react"
let selectlist = []
class SelectWeChats extends Component {
    state={checkedList: [], checkAll: false}
    UNSAFE_componentWillMount () {
        selectlist = []
    }
    fenzuSelect = (values, name) => {
        let index = selectlist.findIndex((item) => item.name === name)
        if (index === -1) {
            selectlist.push({name, sel: values})
        } else {
            selectlist[index].sel = values
        }
        let checkedList = []
        selectlist.map((item) => checkedList.push(...item.sel))
        this.targetChange(checkedList)
        this.props.onChange && this.props.onChange(checkedList)
    }
    onCheckAllChange=(e) => {
        const {checked} = e.target
        const {data} = this.props
        let {checkedList} = this.state
        if (checked) {
            checkedList = data && data.map((item) => item.wxid)
        } else {
            checkedList = []
        }
        this.targetChange(checkedList)
    }
    targetChange=(checkedList) => {
        const {data} = this.props
        this.setState({
            indeterminate: checkedList.length !== 0 && checkedList.length < data.length,
            checkAll: checkedList.length === data.length,
            checkedList,
        })
    }
    render () {
        const {data, isDevicename, direction, initValue} = this.props
        let {checkedList, checkAll, indeterminate} = this.state
        let chatLists = []
        if (data && data.length > 0) {
            data.map((item) => {
                let index = chatLists.findIndex((zu) => zu.zuname === item.zuname)
                if (index === -1) {
                    chatLists.push({zuname: item.zuname, children: [item]})
                } if (index !== -1) {
                    chatLists[index].children.push(item)
                }
            })
        }
        return (
            <div>
                {chatLists.length > 1 && <div>
                    <Checkbox
                        indeterminate={indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={checkAll}
                    >
                     全选（已选 {checkedList.length || "0"}/{data && data.length || "0"}）
                    </Checkbox>
                </div>}
                {chatLists.map((item, index) =>
                    <SelectWeChat
                        initValue={initValue}
                        key={index}
                        indeterminate={indeterminate}
                        ischeck={checkAll}
                        direction={direction}
                        isDevicename={isDevicename}
                        zuname={item.zuname || "未分组"}
                        data={item.children}
                        // onChange={this.onChange}
                        fenzuSelect={this.fenzuSelect}
                    />
                ) }
                {chatLists.length === 0 && <div style={{lineHeight: "42px"}}>暂无数据</div>}
            </div>

        )
    }


}
export default (SelectWeChats)
