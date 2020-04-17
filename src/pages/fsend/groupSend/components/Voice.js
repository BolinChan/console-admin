import React, {Component} from "react"
import {Icon, Button} from "antd"
import AudioAnalyser from "react-audio-analyser"
import style from "../page.css"

export default class demo extends Component {
    constructor (props) {
        super(props)
        this.state = {
            status: null,
        }
    }

    controlAudio (status) {
        this.setState({
            status,
        })
    }

    render () {
        const {status, audioSrc} = this.state
        const audioProps = {
            audioType: "audio/wav", // Temporarily only supported audio/wav, default audio/webm
            status, // Triggering component updates by changing status
            audioSrc,
            startCallback: (e) => {
                // console.log("succ start", e)
            },
            pauseCallback: (e) => {
                // console.log("succ pause", e)
            },
            stopCallback: (e) => {
                this.setState({
                    audioSrc: window.URL.createObjectURL(e),
                })
                // console.log("succ stop", e)
            },
        }
        return (
            <AudioAnalyser {...audioProps}>
                <div style={{display: "flex", width: 500, justifyContent: "space-between", paddingTop: 10}}>
                    {status !== "recording" &&
                    <Icon type="play-circle" className={style.vistart} title="开始录音"
                        onClick={() => this.controlAudio("recording")}/>}

                    {status === "recording" &&
                    <Icon type="pause-circle" className={style.vistart} title="暂停录音"
                        onClick={() => this.controlAudio("paused")}/>}

                    <Button type="primary" className={style.visave} title="保存录音"
                        onClick={() => this.controlAudio("inactive")}>保存录音</Button>
                </div>
            </AudioAnalyser>
        )
    }
}
