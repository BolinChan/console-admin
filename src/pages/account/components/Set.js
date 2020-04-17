import { Checkbox } from "antd"
import {Component} from "react"
const CheckboxGroup = Checkbox.Group
let dataList = []
class Set extends Component {
  state = {
      checkedList: [],
      indeterminate: true,
      checkAll: false,
  };
  componentDidMount () {
      const {data, defaultV} = this.props
      let checkedList = []
      dataList = []
      data && data.map((item) => {
          if (defaultV.find((id) => id === item.id)) {
              checkedList.push(item.id)
          }
      })
      this.onChange(checkedList)
  }
  onChange = (checkedList) => {
      const {data, index, onChange} = this.props
      this.setState({
          checkedList,
          indeterminate: !!checkedList.length && (checkedList.length < data.length),
          checkAll: checkedList.length === data.length,
      })
      dataList[index] = checkedList
      onChange && onChange(dataList)
  }

  onCheckAllChange = (e) => {
      const {onChange, data, index} = this.props
      let checkedList = e.target.checked ? data.map((item) => item.id) : []
      this.setState({
          checkedList,
          indeterminate: false,
          checkAll: e.target.checked,
      })
      dataList[index] = checkedList
      onChange && onChange(dataList)
  }
  render () {
      const {checkedList, indeterminate, checkAll} = this.state
      const {data, titleName} = this.props
      return (
          <div>
              <div >
                  <Checkbox
                      style={{width: "100%"}}
                      indeterminate={indeterminate}
                      onChange={this.onCheckAllChange}
                      checked={checkAll}
                  >
                      {titleName} 全选（{checkedList.length}/{data.length}）
                  </Checkbox>
              </div>
              <CheckboxGroup options={data} value={checkedList} onChange={this.onChange} />
              <br />
              <br />
          </div>
      )
  }
}
export default Set
