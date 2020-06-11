import React from 'react';
import ImagesList from './ImagesList';
import ComparePerformance from './ComparePerformance';
import Helpers from '../../Helpers';
import {Icon} from '@shopify/polaris';
import { 
    MobileMajorMonotone,
    DesktopMajorMonotone 
} from '@shopify/polaris-icons';

export default class PageBreakdown extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            desktopData: props.desktopData,
            mobileData: props.mobileData,
            name: props.name,
            linkName: props.linkName
        }
    }

    render() {

        let desktopScore; 
        let mobileScore; 
        let desktopSpeedText; 
        let mobileSpeedText; 
        let desktopPLT; 
        let desktopTPS; 
        let desktopTR; 
        let mobilePLT; 
        let mobileTPS; 
        let mobileTR;
        let desktop_html_score;
        let desktop_javascript_score;
        let desktop_css_score;
        
        let mobile_html_score;
        let mobile_javascript_score;
        let mobile_css_score;
        let desktop_language_score;
        let mobile_language_score;

        if(this.state.desktopData) {
            desktop_language_score = new Helpers().calculatePageScores(this.state.desktopData.lighthouseResult.audits);
            mobile_language_score = new Helpers().calculatePageScores(this.state.mobileData.lighthouseResult.audits);
            desktopScore = Math.abs(100 * this.state.desktopData.lighthouseResult.categories.performance.score);
            mobileScore = Math.abs(100 * this.state.mobileData.lighthouseResult.categories.performance.score);

            desktopSpeedText = desktopScore < 0 ? "N/A" :  Math.round(desktopScore);
            mobileSpeedText = mobileScore < 0 ? "N/A" :  Math.round(mobileScore);

            let desktopScores = new Helpers().calculatePageScores(this.state.desktopData.lighthouseResult.audits);
            desktopPLT = desktopScores[3];
            desktopTPS = desktopScores[5];
            desktopTR = this.state.desktopData.lighthouseResult.audits['resource-summary'].details.items[0].requestCount;
            // desktopTR = desktopScores[6];

            let mobileScores = new Helpers().calculatePageScores(this.state.mobileData.lighthouseResult.audits);
            mobilePLT = mobileScores[3];
            mobileTPS = mobileScores[5];
            mobileTR = this.state.mobileData.lighthouseResult.audits['resource-summary'].details.items[0].requestCount;
            // mobileTR = mobileScores[6];

            desktop_html_score = desktop_language_score[0]
            desktop_css_score = desktop_language_score[1]
            desktop_javascript_score = desktop_language_score[2]
            mobile_html_score = mobile_language_score[0]
            mobile_css_score = mobile_language_score[1]
            mobile_javascript_score = mobile_language_score[2]
        }
        

        return (
            <>
                <div name={this.state.linkName}>
                    <h2 className="p-small-heading">{this.state.name} <span>{this.state.desktopData ? this.state.desktopData.id : null}</span></h2>
                    {
                        this.state.desktopData ? 
                            <>
                                <div className="single-section-box">
                                    <div className="p-screen-sizes-box">
                                        <div></div>
                                        <div></div>
                                        <div className="desktop-screen">
                                            <img src={this.state.desktopData.lighthouseResult.audits['final-screenshot'].details.data} alt='screenshot'/>
                                        </div>
                                        <div className="mobile-screen">
                                            <img src={this.state.mobileData.lighthouseResult.audits['final-screenshot'].details.data} alt='screenshot'/>
                                        </div>
                                    </div>
                                    
                                    <div className="p-detail-box">
                                        <h2>Performance</h2>

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

                                            <ComparePerformance 
                                                dScore={desktopScore} 
                                                mScore={mobileScore} 
                                                dText={desktopSpeedText} 
                                                mText={mobileSpeedText} 
                                                dLoadTime={desktopPLT}
                                                mLoadTime={mobilePLT}
                                                dSize={new Helpers().formatBytes(desktopTPS)} 
                                                mSize={new Helpers().formatBytes(mobileTPS)} 
                                                dRequests={desktopTR} 
                                                mRequests={mobileTR} 
                                                desktop_html_score={desktop_html_score}
                                                desktop_css_score={desktop_css_score}
                                                desktop_javascript_score={desktop_javascript_score}
                                                mobile_html_score={mobile_html_score}
                                                mobile_css_score={mobile_css_score}
                                                mobile_javascript_score={mobile_javascript_score}
                                            />
                                            
                                        </div>
                                    </div>

                                    <ImagesList data={this.state.desktopData} name={'Desktop'} />

                                    <ImagesList data={this.state.mobileData} name={'Mobile'} />
                                </div>
                            </>

                        :

                        <div className="single-section-box">
                            <p>No Data!</p>
                        </div>
                    }
                </div>
            </>
        )
    }
}
