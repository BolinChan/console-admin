import {Select} from "antd"
import { Component } from "react"
const {Option} = Select
class SearchInput extends Component {
        // 搜索所属微信
        handleSearch = (searchValue) => {
            let data = this.props.data.filter((mess) =>
                mess.nickname && mess.nickname.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase()) !== -1 ||
                mess.wxremark && mess.wxremark.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase()) !== -1 ||
                mess.accountnum && mess.accountnum.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase()) !== -1)
            this.setState({data})
        }
        handleChange=(value) => {
            const {data, onChange} = this.props
            this.setState({data})
            onChange && onChange(value)
        }
        render () {
            let {data, style} = this.props
            if (this.state) {
                data = this.state.data || data
            }
            return (
                <Select
                    style={style}
                    showSearch
                    placeholder="请选择所属微信"
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={this.handleSearch}
                    notFoundContent={null}
                    onChange={this.handleChange}
                >
                    <Option value="">请选择</Option>
                    {data &&
                        data.map((item) => (
                            <Option key={item.wxid || item.id} value={item.wxid || item.id}>
                                {item.wxremark || item.nickname }{item.accountnum && <span>{item.nickname === item.accountnum ? "" : `（${item.accountnum}）`}</span>}
                            </Option>
                        ))}
                </Select>
            )
        }
}
export default SearchInput
