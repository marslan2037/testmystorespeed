import React from 'react';
import Helpers from '../../Helpers';
import CircularProgressBar from './CircularProgressBar';
import {Icon} from '@shopify/polaris';
import { 
    MobileMajorMonotone,
    DesktopMajorMonotone 
} from '@shopify/polaris-icons';

export default class CompareHistory extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
        }
    }

    GetData() {
        let data = new Helpers().calculatePageScores(this.state.data.lighthouseResult.audits)

        this.setState({
            pageLoadTime: data[3],
            pageSize: data[5],
            pageRequests: data[6],
            pageScore: Math.abs(100 * this.state.data.lighthouseResult.categories.performance.score)
        })
    }

    render() {
        let desktop_data;
        let desktop_audits;
        let mobile_data;
        let mobile_audits;
        let desktop_score;
        let desktop_score_text;
        let mobile_score;
        let mobile_score_text;

        desktop_data = this.props.data.google_pagespeed_home;
        desktop_audits = new Helpers().calculatePageScores(desktop_data.lighthouseResult.audits);
        desktop_score = Math.abs(100 * desktop_data.lighthouseResult.categories.performance.score);
        desktop_score_text = desktop_score < 0 ? "N/A" : Math.round(desktop_score);

        if(this.props.data && this.props.data.google_pagespeed_mobile_home) {
            mobile_data = this.props.data.google_pagespeed_mobile_home;
            mobile_audits = new Helpers().calculatePageScores(mobile_data.lighthouseResult.audits);
            mobile_score = Math.abs(100 * mobile_data.lighthouseResult.categories.performance.score);
            mobile_score_text = mobile_score < 0 ? "N/A" : Math.round(mobile_score);
        }

        return (
            <>
                <div className="p-compare-card-box">
                    <div className="p-compare-box-heading">
                        <div className="p-compare-box-row">
                            <p></p>
                            <p>
                                <span>
                                    <Icon source={DesktopMajorMonotone} />
                                </span>
                                DESKTOP
                            </p>
                            <p>
                                <span>
                                    <Icon source={MobileMajorMonotone} />
                                </span>
                                MOBILE
                            </p>
                        </div>
                    </div>

                    <div className="p-compare-box-detail">
                        <div className="p-compare-box-row">
                            <p>Performance Score</p>
                            <p>
                                <span className="mini-circlular-bar">
                                    <CircularProgressBar score={desktop_score} text={desktop_score_text} />
                                </span>
                            </p>
                            <p>
                                <span className="mini-circlular-bar">
                                    {
                                        mobile_score && mobile_score_text ?
                                            <CircularProgressBar score={mobile_score} text={mobile_score_text} />
                                        :
                                        null
                                    }
                                </span>
                            </p>
                        </div>

                        <div className="p-compare-box-row">
                            <p>Page Load time</p>
                            <p>{desktop_audits[3]} s</p>
                            <p>{mobile_audits ? mobile_audits[3] : null}</p>
                        </div>

                        <div className="p-compare-box-row">
                            <p>Total Page size</p>
                            <p>{new Helpers().formatBytes(desktop_audits[5])}</p>
                            <p>{new Helpers().formatBytes(mobile_audits ? mobile_audits[5] : 0)}</p>
                        </div>

                        <div className="p-compare-box-row">
                            <p>Requests</p>
                            <p>{desktop_audits[6]}</p>
                            <p>{mobile_audits ? mobile_audits[6] : null}</p>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
