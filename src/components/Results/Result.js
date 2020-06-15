import React from 'react';
import ReactTooltip from "react-tooltip";
import 'react-circular-progressbar/dist/styles.css';
import Helpers from '../../Helpers';
import { Link, Events, animateScroll as scroll, scrollSpy, scroller } from "react-scroll";
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
    
    currentUrl;
    shareReportUrl;
    constructor(props) {
        super(props);
        this.scrollToTop = this.ScrollToTop.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            sidebarFolded: false,
            sectionList: [
                {
                    id: 1, 
                    name: 'Performance', 
                    display: true,
                    inner: [
                        {id: 1, name: 'Summary', active: true},
                        {id: 2, name: 'Theme', active: false},
                        {id: 3, name: 'Apps', active: false},
                        {id: 4, name: 'Advanced', display: false},
                        {id: 5, name: 'Waterfall', display: false},
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
            totalImagesLength: 0,
            url: this.props.location.state ? this.props.location.state.data[0].url : ''
        }
        
        if(this.props.location.state) {
        } else {
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

    componentDidMount() {
        scrollSpy.update();

        if(this.props.location.state) {
            if(this.props.location.pathname === '/result/performance') {
                this.ToggleTab(1, 1, 'true', 'true')
            } else if(this.props.location.pathname === '/result/pages') {
                this.ToggleTab(2, 1, 'true', 'true')
            } else if(this.props.location.pathname === '/result/recommendations') {
                this.ToggleTab(3, 1, 'true', 'true')
            } else if(this.props.location.pathname === '/result/speed-history') {
                this.ToggleTab(4, 1, 'true', 'true')
            } else if(this.props.location.pathname === '/result/hire-developer') {
                this.ToggleTab(5, 1, 'true', 'true')
            }
        }
    }

    

    ToggleTab = (id, inner_id, toggle_menu, scroll_to_top) => {
        let data = this.data;
        if(id === 1) {
            if (this.props.location.pathname === '/result/performance') { } else { this.props.history.push('/result/performance', { data }) };
        } else if(id === 2) {
            if (this.props.location.pathname === '/result/pages') { } else { this.props.history.push('/result/pages', { data }) };
        } else if(id === 3) {
            if (this.props.location.pathname === '/result/recommendations') {  } else { this.props.history.push('/result/recommendations', { data }) };
        } else if(id === 4) {
            if (this.props.location.pathname === '/result/speed-history') {  } else { this.props.history.push('/result/speed-history', { data }) };
        } else if(id === 5) {
            if (this.props.location.pathname === '/result/hire-developer') {  } else { this.props.history.push('/result/hire-developer', { data }) };
        } 

        scrollSpy.update();
        const updatedState = [];
        const updatedInnerState = [];
        if (this.state.sectionList.length) {
            this.state.sectionList.forEach(v => {
                v.display = (id === v.id) ? true : false;
                if(v.inner) {
                    v.inner.forEach((x, index) => {
                        if(id === v.id) {
                            v.inner[index].active = (inner_id === x.id) ? true : false;
                        } else {
                            v.inner[index].active = false;
                        }
                        updatedInnerState.push(v);
                        this.setState({
                            ...this.state,
                            ...updatedState,
                        });
                    })
                }
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

    ToggleInnerTab(id, inner_id, section) {
        this.ToggleTab(id, inner_id, 'true', 'false');
        
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
            return accumulator + currentValue.time;
        }

        this.weightSeriesData = [
            script_entries.reduce(sum_reducer, 0).toFixed(0),
            html_entries.reduce(sum_reducer, 0).toFixed(0),
            font_entries.reduce(sum_reducer, 0).toFixed(0),
            image_entries.reduce(sum_reducer, 0).toFixed(0),
            css_entries.reduce(sum_reducer, 0).toFixed(0),
            other_entries.reduce(sum_reducer, 0).toFixed(0)
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

    SearchFromResults = () => {
        let data = this.state.url;
        this.props.history.push('/', { data });
    }

    handleChange(event) {
        this.setState({url: event.target.value})
    }

    UpdateUrl(url) {
        setTimeout(() => {
            this.setState({
                url: url
            })
        }, 1000)
    }

    GotoHomePage() {
        window.location = '/';
    }
    data;
    render() {
        let data;  
        let theme_data; 
        let installedApps; 
        let desktopHomePageScore;        
        let performace_data;
        let desktopPageSpeedText; 
        
        if(this.props.location.state) {
            if(this.props.location.state.data) {
                this.data = this.props.location.state.data;
                console.log(this.data)
                data = this.props.location.state.data;

                this.shareReportUrl = window.location.origin + '/' + data[0].id;
                this.GetAdvanceChartEntries(data[0].gt_har.log.entries);
                desktopHomePageScore = data[0].gt_pagespeed.pageStats.overallScore;
                // detectedTheme = data[0].detect.theme.name;
                theme_data = data[0].detect.theme_data ? data[0].detect.theme_data : {name: 'NaN', score: 0, speed: 0, theme_data: null};
                console.log(theme_data)
                installedApps = data[0].detect.installed_apps;
                performace_data = data[0].gt_result;

                desktopPageSpeedText = desktopHomePageScore < 0 ? "N/A" : Math.round(desktopHomePageScore)
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
                        <div className="logo grid-item" onClick={this.GotoHomePage}>
                            <h2 className="logo">
                                <span className="header-logo">Ecom Experts</span>
                            </h2>
                            <p className="cmp-title">Test My Store Speed</p>
                        </div>

                        <span className="mobile-icon fa fa-bars" onClick={this.ToggleMobileMenu}></span>

                        <div className="search-bar grid-item">
                            <div className="search-input">
                                <form onSubmit={this.SearchFromResults}>
                                    <input 
                                        type="text" 
                                        name="url" 
                                        value={this.state.url}
                                        onChange={this.handleChange}
                                    />
                                    <span className="search-icon" onClick={this.SearchFromResults}><Icon source={RedoMajorMonotone} /></span>
                                </form>
                            </div>
                        </div>

                        <div className="empty-section grid-item"></div>
                    </div>

                    <div className="p-content-container p-have-grid">
                        <div className={this.state.sidebarFolded ? 'p-sidebar grid-item display-mobile-sidebar' : 'p-sidebar grid-item' }>
                            <ul>
                                <li className={this.state.sectionList[0].display ? 'have-icon active' : 'have-icon'} onClick={() => this.ToggleTab(1, 1, 'true', 'true')}>
                                    <span className="anchor">
                                        <span className="icon">
                                            <Icon source={AnalyticsMajorMonotone} />
                                        </span> 
                                        Performance
                                    </span>
                                </li>
                                
                                <li>
                                    <span className={this.state.sectionList[0].display ? 'anchor' : 'anchor dummy-anchor'}>
                                        <Link 
                                            to="summary_section" 
                                            onClick={() => this.ToggleInnerTab(1, 1, 'summary_section')} 
                                            activeClass="active"
                                            smooth={true} 
                                            spy={true}
                                            offset={-185}
                                        >Summary</Link>
                                    </span>
                                </li>

                                <li>
                                    <span className={this.state.sectionList[0].display ? 'anchor' : 'anchor dummy-anchor'}>
                                        <Link 
                                            to="theme_section" 
                                            onClick={() => this.ToggleInnerTab(1, 2, 'theme_section')} 
                                            activeClass="active"
                                            smooth={true} 
                                            spy={true}
                                            offset={-60}
                                        >Theme</Link>
                                    </span>
                                </li>

                                <li>
                                    <span className={this.state.sectionList[0].display ? 'anchor' : 'anchor dummy-anchor'}>
                                        <Link 
                                            to="apps_section" 
                                            onClick={() => this.ToggleInnerTab(1, 3, 'apps_section')} 
                                            activeClass="active"
                                            smooth={true} 
                                            spy={true}
                                            offset={-60}
                                        >Apps</Link>
                                    </span>
                                </li>

                                <li>
                                    <span className={this.state.sectionList[0].display ? 'anchor' : 'anchor dummy-anchor'}>
                                        <Link 
                                            to="advance_section" 
                                            onClick={() => this.ToggleInnerTab(1, 4, 'advance_section')} 
                                            activeClass="active"
                                            smooth={true} 
                                            spy={true}
                                            offset={-60}
                                        >Advanced</Link>
                                    </span>
                                </li>

                                <li>
                                    <span className={this.state.sectionList[0].display ? 'anchor' : 'anchor dummy-anchor'}>
                                        <Link 
                                            to="waterfall_section" 
                                            onClick={() => this.ToggleInnerTab(1, 5, 'waterfall_section')} 
                                            activeClass="active"
                                            smooth={true} 
                                            spy={true}
                                            offset={-60}
                                        >Waterfall</Link>
                                    </span>
                                </li>

                                <li className={this.state.sectionList[1].display ? 'have-icon active' : 'have-icon'} onClick={() => this.ToggleTab(2, 1, 'true', 'true')}>
                                    <span className="anchor">
                                        <span className="icon">
                                            <Icon source={PageMajorMonotone} />
                                        </span> 
                                        Page Breakdown
                                    </span>
                                </li>

                                <li>
                                    <span className={this.state.sectionList[1].display ? 'anchor' : 'anchor dummy-anchor'}>
                                        <Link 
                                            to="home_section" 
                                            onClick={() => this.ToggleInnerTab(2, 1, 'home_section')} 
                                            activeClass="active"
                                            smooth={true}
                                            spy={true}
                                            offset={-185}
                                        >Home</Link>
                                    </span>
                                </li>

                                <li>
                                    <span className={this.state.sectionList[1].display ? 'anchor' : 'anchor dummy-anchor'}>
                                        <Link 
                                            to="product_section" 
                                            onClick={() => this.ToggleInnerTab(2, 2, 'product_section')} 
                                            activeClass="active"
                                            smooth={true}
                                            spy={true}
                                            offset={-60}
                                        >Product</Link>
                                    </span>
                                </li>

                                <li>
                                    <span className={this.state.sectionList[1].display ? 'anchor' : 'anchor dummy-anchor'}>
                                        <Link 
                                            to="collection_section" 
                                            onClick={() => this.ToggleInnerTab(2, 3, 'collection_section')} 
                                            activeClass="active"
                                            smooth={true}
                                            spy={true}
                                            offset={-60}
                                        >Collection</Link>
                                    </span>
                                </li>

                                <li>
                                    <span className={this.state.sectionList[1].display ? 'anchor' : 'anchor dummy-anchor'}>
                                        <Link 
                                            to="checkout_section" 
                                            onClick={() => this.ToggleInnerTab(2, 4, 'checkout_section')} 
                                            activeClass="active"
                                            smooth={true}
                                            spy={true}
                                            offset={-60}
                                        >Cart</Link>
                                    </span>
                                </li>
                                
                                <li className={this.state.sectionList[2].display ? 'have-icon active' : 'have-icon'} onClick={() => this.ToggleTab(3, 1, 'true', 'true')}>
                                    <span className="anchor">
                                        <span className="icon">
                                            <Icon source={ChecklistMajorMonotone} />
                                        </span> 
                                        Recommendations
                                    </span>
                                </li>
                                
                                <li className={this.state.sectionList[3].display ? 'have-icon active' : 'have-icon'} onClick={() => this.ToggleTab(4, 1, 'true', 'true')}>
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
                                
                                <li className={this.state.sectionList[4].display ? 'have-icon active' : 'have-icon'} onClick={() => this.ToggleTab(5, 1, 'true', 'true')}>
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

                                        <div name="summary_section">
                                            <h2 className="p-small-heading">Summary <span>{data[0].url}</span></h2>
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
                                                            {performace_data.results.page_load_time / 1000} s
                                                            <i className={performace_data.results.page_load_time / 1000 < 6.3 ? "fa fa-angle-up success-icon" : "fa fa-angle-down danger-icon"}></i>
                                                        </h2>
                                                        <span 
                                                            className="mini-title" 
                                                            data-for="main" 
                                                            data-tip="The average load time is 7.3s across the industry"
                                                        >Load Time</span>
                                                    </div>
                                                    <div className="single-result-card">
                                                        <h2 className="p-small-heading">
                                                            {new Helpers().formatBytes(performace_data.results.page_bytes)}
                                                            <i className={performace_data.results.page_bytes < 2900000 ? "fa fa-angle-up success-icon" : "fa fa-angle-down danger-icon"}></i>
                                                        </h2>
                                                        <span 
                                                            className="mini-title" 
                                                            data-for="main" 
                                                            data-tip="The average pagesize is 2.9MB across the industry"
                                                        >Page size</span>
                                                    </div>
                                                    <div className="single-result-card">
                                                        <h2 className="p-small-heading">
                                                            {performace_data.results.page_elements}
                                                            <i className={performace_data.results.page_elements < 119 ? "fa fa-angle-up success-icon" : "fa fa-angle-down danger-icon"}></i>
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
                                        </div>

                                        <div name="theme_section">
                                            <h2 className="p-small-heading">Theme</h2>
                                            <div className="single-section-box">
                                                <div className="p-result-cards">
                                                    <div className="single-result-card">
                                                        <h2 className="p-small-heading">{theme_data.name}</h2>
                                                        <span 
                                                            className="mini-title" 
                                                            data-for="main" 
                                                            data-tip="This is the theme that we detected on your store"
                                                        >Detected theme</span>
                                                    </div>

                                                    <div className="single-result-card">
                                                        <h2 className="p-small-heading">{theme_data.score}</h2>
                                                        <span 
                                                            className="mini-title" 
                                                            data-for="main" 
                                                            data-tip="This is the score of your theme."
                                                        >Theme score</span>
                                                    </div>

                                                    <div className="single-result-card">
                                                        {/* <h2 className="p-small-heading">{theme_data.speed} s</h2> */}
                                                        <h2 className="p-small-heading">{(Math.round(theme_data.speed * 100) / 100).toFixed(2)} s</h2>
                                                        
                                                        <span 
                                                            className="mini-title" 
                                                            data-for="main" 
                                                            data-tip="This is the speed of your theme."
                                                        >Default load time</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div name="apps_section">
                                            <h2 className="p-small-heading">Apps</h2>
                                            <div className="single-section-box">
                                                <InstalledApps apps={installedApps} />
                                            </div>
                                        </div>
                                        
                                        <div name="advance_section">
                                            <h2 className="p-small-heading">Advanced</h2>
                                            <div className="single-section-box">
                                                <div className="p-pi-chart">
                                                    <div className="p-detail-box">
                                                        <h2>Processing Requests</h2>
                                                        <PieChart data={this.requestSeriesData} chart_section={'processing_request'}/>
                                                    </div>
                            
                                                    <div className="p-detail-box">
                                                        <h2>Processing Weight</h2>
                                                        <PieChart data={this.weightSeriesData} chart_section={'processing_weight'}/>
                                                    </div>
                                                </div>

                                                <ResponseCode data={data[0].gt_har} />
                                            </div>
                                        </div>

                                        <div name="waterfall_section">
                                            <h2 className="p-small-heading">Waterfall</h2>
                                            <div className="single-section-box">
                                                <div className="p-detail-box">
                                                    <h2>Waterfall</h2>
                                                    <Waterfall data={data[0].gt_har}  id={1} />
                                                    <p className="waterfall-mobile">Switch to Desktop view to see Waterfall</p>
                                                </div>
                                            </div>                
                                        </div>                
                                                    
                                        <ul className="p-buttons page-bottom-button">
                                            <li onClick={() => this.ToggleTab(2, 1, 'false', 'true')}><button>Next: Page Breakdown</button></li>
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
                                            <li onClick={() => this.ToggleTab(3, 1, 'false', 'true')}><button>Next: Recommendations</button></li>
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
                                            <li onClick={() => this.ToggleTab(4, 1, 'false', 'true')}><button>Next: Speed History</button></li>
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
                                            <li onClick={() => this.ToggleTab(5, 1, 'false', 'true')}><button>Next: Hire Developer</button></li>
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
