import {Select} from "antd"
import { Component } from "react"
const {Option} = Select

class SelectMultple extends Component {
    state={value: [], staticpage: 1}
    // 搜索
    handleSearch=async (tagname) => {
        let {data, type, dispatch, total} = this.props
        if (type === "wxTag" && (total !== data.length)) {
            await dispatch({type: "tagManage/fetchWeChatlabel", payload: {tagname, page: 1}})
            this.onDropdownVisibleChange(true, tagname)
        }
        data = data.filter((mess) => mess.tag_name && mess.tag_name.indexOf(tagname.toLocaleLowerCase()) !== -1 ||
                mess.fenzu_name && mess.fenzu_name.indexOf(tagname.toLocaleLowerCase()) !== -1 ||
                mess.name && mess.name.indexOf(tagname.toLocaleLowerCase()) !== -1 ||
                mess.tagname && mess.tagname.indexOf(tagname.toLocaleLowerCase()) !== -1 ||
                mess.wxremark && mess.wxremark.toLocaleLowerCase().indexOf(tagname.toLocaleLowerCase()) !== -1 ||
                mess.nickname && mess.nickname.indexOf(tagname.toLocaleLowerCase()) !== -1
        )
        this.setState({tagname, data})
    }
    // 选择
     handleChange = (e, list) => {
         const {data, onChange, mode} = this.props
         let ids = [e]
         if (mode === "multiple") {
             ids = e.length > 0 ? e : undefined
         }
         if (e === "") {ids = ""}
         onChange && onChange(ids)
         this.setState({data})
     }
    onBlur=async () => {
        let {data, type, dispatch, total} = this.props
        if (type === "wxTag" && (total !== data.length)) {
            dispatch({type: "tagManage/fetchWeChatlabel", payload: { page: this.state.staticpage}})
        }
    }
     onDropdownVisibleChange=(open, name) => {
         open && (this.setState({data: this.props.data, tagname: name}))
         if (this.props.type === "wxTag" && open) {
             let Inlabel = setInterval(async () => {
                 let {page, total, data, dispatch} = this.props
                 let {tagname, staticpage} = this.state
                 if ((page > total / 100) || (total === data.length)) {
                     clearInterval(Inlabel)
                     return
                 }
                 await dispatch({type: "tagManage/fetchWeChatlabel", payload: {page: page + 1, tagname}})
                 tagname && (data = data.filter((mess) => mess.tagname && mess.tagname.indexOf(tagname.toLocaleLowerCase()) !== -1))
                 !tagname && (staticpage = this.props.page + 1)
                 this.setState({data, staticpage})
             }, 1500)
         }
     }
     render () {
         let {data, width, className, placeholder, istag, mode, disnone, disabled, value} = this.props
         data = this.state.data || data
         return (
         //  <Select value={value} className={className} mode="multiple" placeholder={placeholder} onChange={this.handleChange} style={{width: width || "100%"}}>
         //      {data && data.map((item) => {
         //          let name = item.nickname || item.tag_name || item.name || item.fenzu_name
         //          return <Option key={(name || item.accountnum) + item.id} id={item.id}>
         //              {name}
         //              {item.accountnum && <span>{item.nickname === item.accountnum ? "" : `（${item.accountnum}）`}</span>}
         //          </Option>
         //      })}
         //  </Select>
             <Select
                 showSearch
                 defaultActiveFirstOption={false}
                 showArrow={false}
                 filterOption={false}
                 onSearch={this.handleSearch}
                 onChange={this.handleChange}
                 className={className}
                 value={value}
                 style={{width: width || "100%"}}
                 placeholder={placeholder}
                 onDropdownVisibleChange={this.onDropdownVisibleChange}
                 onBlur={this.onBlur}
                 mode={mode}
                 // multiple
                 disabled={disabled}
             >
                 {(!mode && !disnone) && <Option value="" style={{color: "rgb(63, 120, 173)"}}>请选择</Option>}
                 {istag && <Option value="-1" key="-1" style={{color: "rgb(63, 120, 173)"}}>无标签的好友</Option>}
                 {data && data.map((item) => {
                     let name = item.nickname || item.tag_name || item.name || item.fenzu_name || item.tagname || item.wxremark
                     return <Option key={item.uniacid || item.wxid || item.id || item.tagname}>
                         {name}
                         {item.accountnum && <span>{item.nickname === item.accountnum ? "" : `（${item.accountnum}）`}</span>}
                     </Option>
                 })}
             </Select>
         )
     }
}
export default SelectMultple
