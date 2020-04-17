import { Component } from "react"
import "./DragScale.css"
class DragScale extends Component {
    state={
        space: {
            move: { // [移动]
                content: { // [移动备注框]
                    width: 100, // 默认div的宽度
                    height: 100, // 默认div的高度
                    top: 0, // 默认div的距离头部距离
                    right: 0, // 默认div的距离右侧距离
                    bottom: 0, // 默认div的距离底部距离
                    left: 0, // 默认div的距离左侧距离
                    min: 50, // div宽度高度不能小于min
                    buttomTarget: null, // 鼠标按下之后的target
                    moveTarget: null, // 鼠标按下之后移动的target
                },
            },
        },
    }
    componentDidMount () {
        let {space} = this.state
        if (this.props.min) {
            space.move.content.min = this.props.min
            this.setState({space})
        }
        let ele = document.getElementById(this.props.heard)
        ele.onmousedown = () => {
            document.onmousemove = (e) => {
                this.addMoveContentControl(ele, e)
            }
        }
    }
     addMoveContentSuper = (divEle, e) => {
         const {onChange} = this.props
         document.onmouseup = () => {
             onChange && onChange(this)
         }
         let {space} = this.state
         // 缩小保护
         this.min = space.move.content.min

         // 所有元素
         this.divEle = divEle

         // // 最大div的style
         this.divStyle = this.divEle.style
         this.divWidth = this.divStyle.width
         this.divHeight = this.divStyle.height
         this.divTop = this.divStyle.top
         this.divRight = this.divStyle.right
         this.divBottom = this.divStyle.bottom
         this.divLeft = this.divStyle.left

         // 头部移动高度
         this.hreadHeight = space.move.content.moveHeight

         // 鼠标事件event
         this.e = e
         this.x = e.movementX
         this.y = e.movementY
         this.moveTarget = space.move.content.moveTarget // 正在移动的target

         // 修改属性的值
         this.divWidth = (this.divWidth === "" || !this.divWidth)
             ? space.move.content.width : Math.floor(this.divWidth.replace("px", ""))

         this.divHeight = (this.divHeight === "" || !this.divHeight)
             ? space.move.content.height : Math.floor(this.divHeight.replace("px", ""))

         this.divTop = (this.divTop === "" || !this.divTop)
             ? space.move.content.top : Math.floor(this.divTop.replace("px", ""))

         this.divRight = (this.divRight === "" || !this.divRight)
             ? space.move.content.right : Math.floor(this.divRight.replace("px", ""))

         this.divBottom = (this.divBottom === "" || !this.divBottom)
             ? space.move.content.bottom : Math.floor(this.divBottom.replace("px", ""))

         this.divLeft = (this.divLeft === "" || !this.divLeft)
             ? space.move.content.left : Math.floor(this.divLeft.replace("px", ""))

     }
     addMoveContentControl =(divEle, e) => {
         let {space} = this.state
         if (e.buttons !== 1) { // 当鼠标没有按下则不走方法
             space.move.content.moveTarget = null
             return
         } else if (space.move.content.moveTarget === null) { // 当鼠标按下了,movetarget为空则赋值
             space.move.content.moveTarget = e.target // 这里利用了成员变量
         }
         var move = divEle.firstElementChild // 获取头部移动元素
         var direction = divEle.getElementsByClassName("s-move-content-direction") // 获取所有拉伸的节点
         //  var direction = divEle.getElementsByClassName(this.props.heard) // 获取所有拉伸的节点
         switch (space.move.content.moveTarget) {
             case move: this.addMoveContentMove(divEle, e, move); break // 移动
             case direction[0]: this.addMoveContentTop(divEle, e, direction[0]); break // 上拉伸
             case direction[1]: this.addMoveContentRightTop(divEle, e, direction[1]); break // 右上拉伸
             case direction[2]: this.addMoveContentRight(divEle, e, direction[2]); break // 右拉伸
             case direction[3]: this.addMoveContentRightButtom(divEle, e, direction[3]); break // 右下拉伸
             case direction[4]: this.addMoveContentButtom(divEle, e, direction[4]); break // 下拉伸
             case direction[5]: this.addMoveContentLeftButtom(divEle, e, direction[5]); break // 左下拉伸
             case direction[6]: this.addMoveContentLeft(divEle, e, direction[6]); break // 左上拉伸
             case direction[7]: this.addMoveContentLeftTop(divEle, e, direction[7]); break // 左上拉伸
             default: break
         }
     }
     range =(iNum, iMax, iMin) => {// 限制范围
         if (iNum > iMax) {
             return iMax
         } else if (iNum < iMin) {
             return iMin
         } else {
             return iNum
         }
     }
     addMoveContentMove = (divEle, e, thisEle) => { // 移动
         const {boxWidth, boxHeight} = this.props
         this.addMoveContentSuper(divEle, e)
         var left = this.range(this.divLeft + this.x, (boxWidth || document.documentElement.clientWidth) - thisEle.offsetWidth, 0)
         var top = this.range(this.divTop + this.y, (boxHeight || document.documentElement.clientHeight) - thisEle.offsetHeight, 0)
         this.divStyle.top = top + "px"
         this.divStyle.left = left + "px"
     }

     addMoveContentTop = (divEle, e, thisEle) => { // 向上拉伸
         this.addMoveContentSuper(divEle, e)
         var top = this.divTop
         var height = this.divHeight + (-this.y)
         if (height < this.min) {height = this.min} else {top = this.divTop + this.y}
         this.divStyle.top = top + "px"
         if (this.props.isSquare) {
             this.divStyle.width = height + "px"
             this.divStyle.height = height + "px"
             return
         }
         this.divStyle.height = height + "px"
     }

     addMoveContentRightTop = (divEle, e, thisEle) => { // 右上拉伸
         this.addMoveContentSuper(divEle, e)
         var top = this.divTop
         var width = this.divWidth + this.x
         var height = this.divHeight + (-this.y)
         if (height < this.min) {height = this.min}
         if (width < this.min) {width = this.min} else {top = this.divTop + this.y}
         this.divStyle.top = top + "px"
         if (this.props.isSquare) {
             this.divStyle.width = height + "px"
             this.divStyle.height = height + "px"
             return
         }
         this.divStyle.width = width + "px"
         this.divStyle.height = height + "px"

     }

     addMoveContentRight = (divEle, e, thisEle) => { // 右侧拉伸
         this.addMoveContentSuper(divEle, e)
         var width = this.divWidth + this.x
         if (width < this.min) {width = this.min}
         if (this.props.isSquare) {
             this.divStyle.width = width + "px"
             this.divStyle.height = width + "px"
             return
         }
         this.divStyle.width = width + "px"
     }

     addMoveContentRightButtom = (divEle, e, thisEle) => { // 右下拉伸
         this.addMoveContentSuper(divEle, e)
         var width = this.divWidth + this.x
         var height = this.divHeight + this.y
         if (height < this.min) {height = this.min}
         if (width < this.min) {width = this.min}
         if (this.props.isSquare) {
             this.divStyle.width = height + "px"
             this.divStyle.height = height + "px"
             return
         }
         this.divStyle.width = width + "px"
         this.divStyle.height = height + "px"
     }

     addMoveContentButtom = (divEle, e, thisEle) => { // 向下拉伸
         this.addMoveContentSuper(divEle, e)
         var height = this.divHeight + this.y
         if (height < this.min) {height = this.min}
         if (this.props.isSquare) {
             this.divStyle.width = height + "px"
             this.divStyle.height = height + "px"
             return
         }
         this.divStyle.height = height + "px"
     }

     addMoveContentLeftButtom = (divEle, e, thisEle) => { // 左下拉伸
         this.addMoveContentSuper(divEle, e)
         var left = this.divLeft
         var width = this.divWidth + (-this.x)
         var height = this.divHeight + this.y
         if (height < this.min) {height = this.min}
         if (width < this.min) {width = this.min} else {left = this.divLeft + this.x}
         this.divStyle.left = left + "px"
         if (this.props.isSquare) {
             this.divStyle.width = height + "px"
             this.divStyle.height = height + "px"
             return
         }
         this.divStyle.width = width + "px"
         this.divStyle.height = height + "px"
     }

     addMoveContentLeft = (divEle, e, thisEle) => { // 向左拉伸
         this.addMoveContentSuper(divEle, e)
         var left = this.divLeft
         var width = this.divWidth + (-this.x)
         if (width < this.min) {width = this.min} else {left = this.divLeft + this.x}
         this.divStyle.left = left + "px"
         if (this.props.isSquare) {
             this.divStyle.width = width + "px"
             this.divStyle.height = width + "px"
             return
         }
         this.divStyle.width = width + "px"
     }

     addMoveContentLeftTop = (divEle, e, thisEle) => { // 左上拉伸
         this.addMoveContentSuper(divEle, e)
         var top = this.divTop
         var left = this.divLeft
         var width = this.divWidth + (-this.x)
         var height = this.divHeight + (-this.y)
         if (height < this.min) {height = this.min} else {top = this.divTop + this.y}
         if (width < this.min) {width = this.min} else {left = this.divLeft + this.x}
         this.divStyle.top = top + "px"
         this.divStyle.left = left + "px"
         if (this.props.isSquare) {
             this.divStyle.width = height + "px"
             this.divStyle.height = height + "px"
             return
         }
         this.divStyle.width = width + "px"
         this.divStyle.height = height + "px"
     }
     render () {
         const {outerStyle, headerStyle, headerClass, heard, disScale} = this.props
         return (
             <div className="s-move-content-outer" id={heard} style={outerStyle}>
                 <div className={headerClass + " s-move-content-header"} style={headerStyle}>
                     {this.props.children}
                     {!disScale && <div>
                         <div className="s-move-content-direction s-show s-move-content-direction-n"></div>
                         <div className="s-move-content-direction s-show s-move-content-direction-ne"></div>
                         <div className= "s-move-content-direction s-show s-move-content-direction-e"></div>
                         <div className="s-move-content-direction s-show s-move-content-direction-se"></div>
                         <div className="s-move-content-direction s-show s-move-content-direction-s"></div>
                         <div className="s-move-content-direction s-show s-move-content-direction-sw"></div>
                         <div className= "s-move-content-direction s-show s-move-content-direction-w"></div>
                         <div className= "s-move-content-direction s-show s-move-content-direction-nw"></div>
                     </div>}

                 </div>
             </div>
         )
     }
}
export default DragScale

// boxWidth, 可移动最大宽度（容器的宽度）
//  boxHeight, 可移动最大高度（容器的高度）
// min div宽度高度不能小于min
// disScale 是否可伸缩，默认false可伸缩
// isSquare 是否为正方形 ，默认false；true为正方形
// outerStyle 可设置移动框的位置，大小
// headerStyle,
