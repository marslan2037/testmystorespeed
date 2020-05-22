import React, { useRef } from 'react';
import ReactTooltip from "react-tooltip";
import 'react-circular-progressbar/dist/styles.css';
import Helpers from '../../Helpers';
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';
import PieChart from './ChartResults/PieChart';
import {Icon} from '@shopify/polaris';
import { 
    RedoMajorMonotone,
    JobsMajorMonotone,
    SendMajorMonotone,
    ExchangeMajorMonotone,
    ChecklistMajorMonotone,
    PageMajorMonotone,
    AnalyticsMajorMonotone 
} from '@shopify/polaris-icons';
import SpeedHistory from './SpeedHistory';
import HireDeveloper from './HireDeveloper';
import CircularProgressBar from './CircularProgressBar';
import InstalledApps from './InstalledApps';
import Recommendations from './Recommendations';
import PageBreakdown from './PageBreakdown';
import {Waterfall} from './Waterfall';
import ResponseCode from './ResponseCode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class Result extends React.Component {
    
    shareReportUrl;
    constructor(props) {
        super(props);
        this.scrollToTop = this.ScrollToTop.bind(this);

        console.log(this.props.location)

        if(this.props.location.state) {
            console.log('you have data')
        } else {
            console.log('you dont have data')
            this.props.history.push('/');
            window.location = '/';
        }
    }

    ScrollToTop() {
        scroll.scrollToTop();
    }

    componentWillUnmount() {
        Events.scrollEvent.remove("begin");
        Events.scrollEvent.remove("end");
    }

    state = {
        sidebarFolded: false,
        sectionList: [
            {
                id: 1, 
                name: 'Performance', 
                display: true,
                inner: [
                    {id: 1, name: 'Summary', active: false},
                    {id: 2, name: 'Theme', active: false},
                    {id: 3, name: 'Apps', active: false},
                    {id: 4, name: 'Advanced', display: false},
                ]
            },
            {
                id: 2, 
                name: 'Pages', 
                display: false,
                inner: [
                    {id: 1, name: 'Home', active: false},
                    {id: 2, name: 'Product', active: false},
                    {id: 3, name: 'Collection', active: false},
                    {id: 4, name: 'Checkout', display: false},
                ]
            },
            {id: 3, name: 'Recommendations', display: false},
            {id: 4, name: 'Speed History', display: false},
            {id: 5, name: 'Hire a Developer', display: false},
        ],
        totalImagesLength: 0
    }

    ToggleTab = (id, toggle_menu, scroll_to_top) => {
        const updatedState = [];
        if (this.state.sectionList.length) {
            this.state.sectionList.forEach(v => {
                v.display = (id === v.id) ? true : false;
                updatedState.push(v);
                this.setState({
                    ...this.state,
                    ...updatedState,
                });
            });
        }

        if(toggle_menu === 'true') {
            this.ToggleMobileMenu();
        }
        

        if(scroll_to_top === 'true') {
            this.ScrollToTop();
        }
    }

    ToggleMobileMenu = () => {
        this.setState({
            sidebarFolded: !this.state.sidebarFolded
        })
    }

    ToggleInnerTab(id, innerId, section) {
        this.ToggleTab(id, 'true', 'false');
        
        setTimeout(() => {
            scroller.scrollTo(section, {
                duration: 800,
                delay: 0,
                smooth: 'easeInOutQuart'
              });
        }, 700)
    }

    requestSeriesData;
    weightSeriesData;
    GetAdvanceChartEntries = (entries) => {
        const script_entries = entries.filter((item) => {
            return item.response.content.mimeType.indexOf('javascript') !== -1
        })
        
        const html_entries = entries.filter((item) => {
            return item.response.content.mimeType.indexOf('html') !== -1
        })
        
        const font_entries = entries.filter((item) => {
            return item.response.content.mimeType.indexOf('font') !== -1
        })
        
        const image_entries = entries.filter((item) => {
            return item.response.content.mimeType.indexOf('image') !== -1
        })
        
        const css_entries = entries.filter((item) => {
            return item.response.content.mimeType.indexOf('css') !== -1
        })

        const other_entries = entries.filter((item) => {
            return !css_entries.includes(item)
                && !image_entries.includes(item)
                && !font_entries.includes(item)
                && !html_entries.includes(item)
                && !script_entries.includes(item)
        })

        this.requestSeriesData = [
            script_entries.length,
            html_entries.length,
            font_entries.length,
            image_entries.length,
            css_entries.length,
            other_entries.length
        ];

        const sum_reducer = (accumulator, currentValue) => {
            return  accumulator + currentValue.time
        }

        this.weightSeriesData = [
            script_entries.reduce(sum_reducer, 0),
            html_entries.reduce(sum_reducer, 0),
            font_entries.reduce(sum_reducer, 0),
            image_entries.reduce(sum_reducer, 0),
            css_entries.reduce(sum_reducer, 0),
            other_entries.reduce(sum_reducer, 0)
        ];
    }

    DisplayMessage = (message) => {
        toast.success(message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
        });
    }

    copyToClipboard = (e) => {
        this.textArea.select();
        document.execCommand('copy');
        e.target.focus();

        this.DisplayMessage('Url is Copied');
    }

    componentDidMount () {
        console.log(this.props.location)
    }

    render() {
        let data; let desktopHomePageScore; let mobileHomePageScore; let detectedTheme; let installedApps; let desktopPageLoadTime; let mobileScores; 
        let mobilePageLoadTime; let desktopTotalPageSize; let mobileTotalPageSize; let desktopTotalRequests; let mobileTotalRequests; let desktopPageSpeedText; 
        let mobilePageSpeedText; 
        console.log(this.props.location)
        if(this.props.location.state) {
            if(this.props.location.state.state.data) {

                data = this.props.location.state.state.data;
                console.log('this is issue')
                console.log(data[0]);

                this.shareReportUrl = window.location.origin + data[0].id;
                console.log(this.shareReportUrl)

                this.GetAdvanceChartEntries(data[0].gt_har.log.entries);
        

                desktopHomePageScore = data[0].gt_pagespeed.pageStats.overallScore;
                mobileHomePageScore = Math.abs(100 * data[0].home_mobile.lighthouseResult.categories.performance.score);
                
                detectedTheme = data[0].detect.theme.name;
                installedApps = data[0].detect.installed_apps;

                desktopPageLoadTime = data[0].gt_result.results.page_load_time / 1000;
                mobileScores = new Helpers().calculatePageScores(data[0].home_mobile.lighthouseResult.audits);
                mobilePageLoadTime = mobileScores[3];
                
                desktopTotalPageSize = data[0].gt_result.results.page_bytes;
                mobileTotalPageSize = mobileScores[5];

                desktopTotalRequests = data[0].gt_result.results.page_elements;
                mobileTotalRequests = mobileScores[6];
                
                desktopPageSpeedText = desktopHomePageScore < 0 ? "N/A" : Math.round(desktopHomePageScore)
                mobilePageSpeedText = mobileHomePageScore < 0 ? "N/A" :  Math.round(mobileHomePageScore)
            } else {
                this.props.history.push('/');
            }
        } else {
            this.props.history.push('/');
        }

        

        return (
            <>
                <ToastContainer/>
                <textarea ref={(textarea) => this.textArea = textarea} value={this.shareReportUrl} className="hidden-input" readOnly />
                <div className="performance-container">
                <div className="p-header p-have-grid p-middle-grid">
                    <div className="logo grid-item">
                        <h2 className="logo">
                            <a href="/home">Ecom Experts</a>
                        </h2>
                        <p className="cmp-title">Test My Store Speed</p>
                    </div>

                    <span className="mobile-icon fa fa-bars" onClick={this.ToggleMobileMenu}></span>

                    <div className="search-bar grid-item">
                        <div className="search-input">
                            <input ref={(inputRef) => this.inputRef = inputRef} type="text" placeholder="www.brevite.co" value={data[0].url} readOnly />
                            {/* <span className="search-icon"><img src={searchIcon} alt=""/></span> */}
                            <span className="search-icon"><Icon source={RedoMajorMonotone} /></span>
                        </div>
                    </div>

                    <div className="empty-section grid-item"></div>
                </div>

                <div className="p-content-container p-have-grid">
                    <div className={this.state.sidebarFolded ? 'p-sidebar grid-item display-mobile-sidebar' : 'p-sidebar grid-item' }>
                        <ul>
                            <li className={this.state.sectionList[0].display ? 'have-icon active' : 'have-icon'} onClick={() => this.ToggleTab(1, 'true', 'true')}>
                                <span className="anchor">
                                    <span className="icon">
                                        <Icon source={AnalyticsMajorMonotone} />
                                    </span> 
                                    Performance
                                </span>
                            </li>
                            <li><span className="anchor"><Link to="summary_section" onClick={() => this.ToggleInnerTab(1, 1, 'summary_section')} smooth={true}>Summary</Link></span></li>
                            <li><span className="anchor"><Link to="theme_section" onClick={() => this.ToggleInnerTab(1, 2, 'theme_section')} smooth={true}>Theme</Link></span></li>
                            <li><span className="anchor"><Link to="apps_section" onClick={() => this.ToggleInnerTab(1, 3, 'apps_section')} smooth={true}>Apps</Link></span></li>
                            <li><span className="anchor"><Link to="advance_section" onClick={() => this.ToggleInnerTab(1, 4, 'advance_section')} smooth={true}>Advanced</Link></span></li>
                            <li className={this.state.sectionList[1].display ? 'have-icon active' : 'have-icon'} onClick={() => this.ToggleTab(2,  'true', 'true')}>
                                <span className="anchor">
                                    <span className="icon">
                                        <Icon source={PageMajorMonotone} />
                                    </span> 
                                    Page Breakdown
                                </span>
                            </li>
                            <li><span className="anchor"><Link to="home_section" onClick={() => this.ToggleInnerTab(2, 1, 'home_section')} smooth={true}>Home</Link></span></li>
                            <li><span className="anchor"><Link to="product_section" onClick={() => this.ToggleInnerTab(2, 2, 'product_section')} smooth={true}>Product</Link></span></li>
                            <li><span className="anchor"><Link to="collection_section" onClick={() => this.ToggleInnerTab(2, 3, 'collection_section')} smooth={true}>Collection</Link></span></li>
                            <li><span className="anchor"><Link to="checkout_section" onClick={() => this.ToggleInnerTab(2, 4, 'checkout_section')} smooth={true}>Cart</Link></span></li>
                            <li className={this.state.sectionList[2].display ? 'have-icon active' : 'have-icon'} onClick={() => this.ToggleTab(3,  'true', 'true')}>
                                <span className="anchor">
                                    <span className="icon">
                                        <Icon source={ChecklistMajorMonotone} />
                                    </span> 
                                    Recommendations
                                </span>
                            </li>
                            <li className={this.state.sectionList[3].display ? 'have-icon active' : 'have-icon'} onClick={() => this.ToggleTab(4,  'true', 'true')}>
                                <span className="anchor">
                                    <span className="icon">
                                        <Icon source={ExchangeMajorMonotone} />
                                    </span> 
                                    Speed History
                                </span>
                            </li>
                        </ul>

                        <h2 className="menu-heading">Other Options</h2>
                        <ul>
                            <li className="have-icon" onClick={this.copyToClipboard}>
                                <span className="anchor">
                                    <span className="icon">
                                        <Icon source={SendMajorMonotone} />
                                    </span> 
                                    Share Result
                                </span>
                            </li>
                            <li className={this.state.sectionList[4].display ? 'have-icon active' : 'have-icon'} onClick={() => this.ToggleTab(5,  'true', 'true')}>
                                <span className="anchor">
                                    <span className="icon">
                                        <Icon source={JobsMajorMonotone} />
                                    </span> 
                                    Hire Developer
                                </span>
                            </li>
                        </ul>                    
                    </div>
                    <div className="empty-section"></div>
                    <div className="p-content grid-item">
                        {
                            this.state.sectionList[0].display ? 
                            (
                                <div name="performance_section">
                                    <h2 className="main-content-heading">Performance</h2>

                                    <h2 className="p-small-heading" name="summary_section">Summary <span>{data[0].url}</span></h2>
                                    <div className="single-section-box">
                                        <div className="p-site-score">
                                            <div className="round-chart">

                                                <CircularProgressBar score={desktopHomePageScore} text={desktopPageSpeedText} />

                                            </div>
                                            <div className="score-detail">
                                                <h2>
                                                    {
                                                        (desktopHomePageScore >= 90) ? 'Great job! ' : 
                                                        (desktopHomePageScore >= 80) ? 'Better! ' : 
                                                        (desktopHomePageScore >= 60 && desktopHomePageScore < 80) ? 'Ok! ' : 'Ouch! '    
                                                    } 
                                                    Your site scored a {desktopHomePageScore}!
                                                </h2>
                                                <p>
                                                    Page speed score is the ultimate measure of your site’s performance. It’s based on the time it takes to load an 
                                                    average page on your site, as well as its adherence to performance guidelines.
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <ReactTooltip id="main" place="top" type="dark" effect="solid" />

                                        <div className="p-result-cards">
                                            <div className="single-result-card">
                                                <h2 className="p-small-heading">
                                                    {desktopPageLoadTime} s
                                                    <i className={desktopPageLoadTime < 6.3 ? "fa fa-angle-up success-icon" : "fa fa-angle-down danger-icon"}></i>
                                                </h2>
                                                <span 
                                                    className="mini-title" 
                                                    data-for="main" 
                                                    data-tip="The average load time is 7.3s across the industry"
                                                >Load Time</span>
                                            </div>
                                            <div className="single-result-card">
                                                <h2 className="p-small-heading">
                                                    {new Helpers().formatBytes(desktopTotalPageSize)}
                                                    <i className={desktopTotalPageSize < 2900000 ? "fa fa-angle-up success-icon" : "fa fa-angle-down danger-icon"}></i>
                                                </h2>
                                                <span 
                                                    className="mini-title" 
                                                    data-for="main" 
                                                    data-tip="The average pagesize is 2.9MB across the industry"
                                                >Page size</span>
                                            </div>
                                            <div className="single-result-card">
                                                <h2 className="p-small-heading">
                                                    {desktopTotalRequests} 
                                                    <i className={desktopTotalRequests < 119 ? "fa fa-angle-up success-icon" : "fa fa-angle-down danger-icon"}></i>
                                                </h2>
                                                <span 
                                                    className="mini-title" 
                                                    data-for="main" 
                                                    data-tip="The average # of requests is 119 per page cross the industry"
                                                >Requests</span>
                                            </div>
                                        </div>

                                        <div className="p-screen-sizes-box p-screen-sizes-box-performance">
                                            <div></div>
                                            <div className="desktop-screen">
                                                <img src={'data:image/jpeg;base64,' + data[0].gt_screenshot} alt='screenshot'/>
                                            </div>
                                            <div className="mobile-screen">
                                                <img src={data[0].home_mobile.lighthouseResult.audits['final-screenshot'].details.data} alt='screenshoot'/>
                                            </div>
                                            <div></div>
                                        </div>
                                    </div>

                                    <h2 className="p-small-heading" name="theme_section">Theme</h2>
                                    <div className="single-section-box">
                                        <div className="p-result-cards">
                                            <div className="single-result-card">
                                                <h2 className="p-small-heading">{detectedTheme}</h2>
                                                <span 
                                                    className="mini-title" 
                                                    data-for="main" 
                                                    data-tip="This is the theme that we detected on your store"
                                                >Detected theme</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <h2 className="p-small-heading" name="apps_section">Apps</h2>
                                    <div className="single-section-box">
                                        
                                        <InstalledApps apps={installedApps} />

                                    </div>
                                    
                                    <h2 className="p-small-heading" name="advance_section">Advanced</h2>
                                    <div className="single-section-box">
                                        <div className="p-pi-chart">
                                            <div className="p-detail-box">
                                                <h2>Processing Requests</h2>

                                                <PieChart data={this.requestSeriesData}/>
                                            </div>
                    
                                            <div className="p-detail-box">
                                                <h2>Processing Weight</h2>

                                                <PieChart data={this.weightSeriesData}/>
                                            </div>
                                        </div>

                                        <ResponseCode data={data[0].gt_har} />
                                    </div>

                                    <h2 className="p-small-heading">Waterfall</h2>
                                    <div className="single-section-box">
                                        <div className="p-detail-box">
                                            <h2>Waterfall</h2>
                                            <Waterfall data={data[0].gt_har}  id={1} />
                                            <p className="waterfall-mobile">Switch to Desktop view to see Waterfall</p>
                                        </div>
                                    </div>
                                                
                                    <ul className="p-buttons page-bottom-button">
                                        <li onClick={() => this.ToggleTab(2, 'false', 'true')}><button>Next: Page Breakdown</button></li>
                                    </ul>            
                                </div>
                            ) : 
                            
                            null
                        }

                        {
                            this.state.sectionList[1].display ? 
                            (
                                <div div name="pagebreakdown_section">
                                    <h2 className="main-content-heading">Pages</h2>

                                    <PageBreakdown desktopData={data[0].home} mobileData={data[0].home_mobile} name={'Home'} linkName={'home_section'} />
                                    <PageBreakdown desktopData={data[0].product} mobileData={data[0].product_mobile} name={'Product'} linkName={'product_section'} />
                                    <PageBreakdown desktopData={data[0].collection} mobileData={data[0].collection_mobile} name={'Collection'} linkName={'collection_section'} />
                                    <PageBreakdown desktopData={data[0].cart} mobileData={data[0].cart_mobile} name={'Cart'} linkName={'checkout_section'} />

                                    <ul className="p-buttons page-bottom-button">
                                        <li onClick={() => this.ToggleTab(3, 'false', 'true')}><button>Next: Recommendations</button></li>
                                    </ul> 
                                </div>
                            ) : 
                            
                            null
                        }

                        {
                            this.state.sectionList[2].display ? 
                            (
                                <div name="recommendation_section">
                                    <h2 className="main-content-heading">Recommendations</h2>

                                    <Recommendations desktop_data={data[0].theme} mobile_data={null} name={'Theme'} theme={true} /> 
                                    
                                    <h2 className="p-small-heading">Apps</h2>
                                    <p className="p-small-heading-detail">Here are our recommendations for improving your Home page.</p>
                                    <div className="single-section-box">

                                        <InstalledApps apps={installedApps} />

                                    </div>

                                    <Recommendations desktop_data={data[0].home} mobile_data={data[0].home_mobile} name={'Home'} theme={false} />  

                                    <Recommendations desktop_data={data[0].product} mobile_data={data[0].product_mobile} name={'Product'} theme={false} />

                                    <Recommendations desktop_data={data[0].collection} mobile_data={data[0].collection_mobile} name={'Collection'} theme={false} />

                                    <Recommendations desktop_data={data[0].cart} mobile_data={data[0].cart_mobile} name={'Cart'} theme={false} />

                                    <ul className="p-buttons page-bottom-button">
                                        <li onClick={() => this.ToggleTab(4, 'false', 'true')}><button>Next: Speed History</button></li>
                                    </ul> 
                                </div>
                            ) : 
                            
                            null
                        }

                        {
                            this.state.sectionList[3].display ? 
                            (
                                <div name="speed_history_section">
                                    <h2 className="main-content-heading">Speed History</h2>

                                    <SpeedHistory 
                                        history={data[0].history} 
                                        url={data[0].url} 
                                    />

                                    <ul className="p-buttons page-bottom-button">
                                        <li onClick={() => this.ToggleTab(5, 'false', 'true')}><button>Next: Hire Developer</button></li>
                                    </ul> 
                                </div>
                            ) : 
                            
                            null
                        }

                        {
                            this.state.sectionList[4].display ? 
                            (
                                <div name="hire_developer">
                                    <h2 className="main-content-heading">Hire Developer</h2>

                                    <HireDeveloper />
                                </div>
                            ) : 
                            
                            null
                        }
                    </div>

                    <div className="empty-section grid-item"></div>
                </div>
            </div>
            </>
        )
    }
}
