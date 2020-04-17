import { Modal, Button, Tabs, Icon, Spin} from "antd"
import {Component} from "react"
import ImgItem from "./ImgItem"
// import ImgItem from "../../../material/common/page"
const TabPane = Tabs.TabPane
const TabPaneLayout = {height: "calc(100% - 43px)", overflowY: "auto"}
class SelectMerital extends Component {
  state = {
      visible: false,
  }
  showModal = () => {
      this.setState({
          visible: true,
      })
      this.props.dispatch({ type: "material/fetchMyMaterial"})
      //   this.props.dispatch({ type: "material/fetchMaterial"})
  }
  callback=(key) => {
      const {myMaterial, dispatch} = this.props
      if (key === "2" && myMaterial && myMaterial.length === 0) {
          dispatch({ type: "material/fetchMyMaterial"})
      }
  }
  handleCancel = () => {
      this.setState({
          visible: false,
      })
  }
  selectMaterial=(item) => {
      const {selectMaterial} = this.props
      this.setState({
          visible: false,
      })
      selectMaterial && selectMaterial(item)
  }
  render () {
      const { visible, confirmLoading } = this.state
      const { loadingMater, myMaterial} = this.props
      return (
          <span>
              <Button type="primary" onClick={this.showModal}>
                  <Icon type="plus" theme="outlined" />
                   选择素材
              </Button>
              <Modal
                  visible={visible}
                  //   onOk={this.handleOk}
                  confirmLoading={confirmLoading}
                  onCancel={this.handleCancel}
                  footer={null}
                  bodyStyle={{ height: "100%", overflow: "hidden", padding: 0 }}
                  wrapClassName="wrapClass"
                  style={{ height: "80%", padding: 0, top: "5%" }}
                  width="60%"
              >
                  <Tabs size="large" defaultActiveKey="2" onChange={this.callback} style={{height: "100%"}} tabBarStyle={{margin: 0}}>
                      {/* <TabPane tab="云素材" key="1" style={TabPaneLayout}>
                          <ImgItem data={material} selectMaterial={this.selectMaterial}></ImgItem>
                          <div style={{textAlign: "center"}}> <Spin spinning={loadingMater}></Spin></div>
                      </TabPane> */}
                      <TabPane tab="我的素材" key="2" style={TabPaneLayout}>
                          <ImgItem data={myMaterial} selectMaterial={this.selectMaterial} pyq={true} loading={loadingMater}/>
                          <div style={{textAlign: "center"}}> <Spin spinning={loadingMater}></Spin></div>
                      </TabPane>
                  </Tabs>
              </Modal>
          </span>
      )
  }
}
export default SelectMerital
