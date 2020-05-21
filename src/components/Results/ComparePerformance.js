import React from 'react';
import CircularProgressBar from './CircularProgressBar';


export default class ComparePerformance extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dScore: props.dScore,
            mScore: props.mScore,
            dText: props.dText,
            mText: props.mText,
            dLoadTime: props.dLoadTime,
            mLoadTime: props.mLoadTime,
            dSize: props.dSize,
            mSize: props.mSize,
            dRequests: props.dRequests,
            mRequests: props.mRequests,
            advanceData: false,
            desktop_html_score: props.desktop_html_score, 
            desktop_css_score: props.desktop_css_score,
            desktop_javascript_score: props.desktop_javascript_score,
            mobile_html_score: props.mobile_html_score, 
            mobile_css_score: props.mobile_css_score,
            mobile_javascript_score: props.mobile_javascript_score
        }
    }

    DisplayAdvanceData = () => {
        this.setState({
            advanceData: true
        })
    }

    render() {
        return (
            <>
                <div className="p-compare-box-detail">
                    <div className="p-compare-box-row">
                        <p>Performance Score</p>
                        <p>
                            <span className="mini-circlular-bar">
                                <CircularProgressBar score={this.state.dScore} text={this.state.dText} />
                            </span>
                        </p>
                        <p>
                            <span className="mini-circlular-bar">
                                <CircularProgressBar score={this.state.mScore} text={this.state.mText} />
                            </span>
                        </p>
                    </div>

                    <div className="p-compare-box-row">
                        <p>Page Load Time</p>
                        <p>{this.state.dLoadTime}</p>
                        <p>{this.state.mLoadTime}</p>
                    </div>

                    <div className="p-compare-box-row">
                        <p>Total Page Size</p>
                        <p>{this.state.dSize}</p>
                        <p>{this.state.mSize}</p>
                    </div>

                    <div className="p-compare-box-row">
                        <p>Requests</p>
                        <p>{this.state.dRequests}</p>
                        <p>{this.state.mRequests}</p>
                    </div>

                    {
                        this.state.advanceData ? 
                        
                        <>
                            <div className="p-compare-box-row">
                                <p>Javascript</p>
                                <p>{this.state.desktop_javascript_score}%</p>
                                <p>{this.state.mobile_javascript_score}%</p>
                            </div>

                            <div className="p-compare-box-row">
                                <p>HTML</p>
                                <p>{this.state.desktop_html_score}%</p>
                                <p>{this.state.mobile_html_score}%</p>
                            </div>

                            <div className="p-compare-box-row">
                                <p>CSS</p>
                                <p>{this.state.desktop_css_score}%</p>
                                <p>{this.state.mobile_css_score}%</p>
                            </div>
                        </>

                        : 

                        null
                    }
                </div>

                {
                    this.state.advanceData ? null :
                    <div className="advance-button" onClick={this.DisplayAdvanceData}>
                        <p><i className="fa fa-angle-right"></i> Show advance</p>
                    </div>
                }
            </>
        )
    }
}
