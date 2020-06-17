import React from 'react';
import staticPerformanceResult from '../assets/images/static-performance-result.png';
import footerLogo from '../assets/images/footer-logo.svg';
import firstServiceImg from '../assets/images/first-service-img.png';
import secondServiceImg from '../assets/images/second-service-img.png';
import thirdServiceImg from '../assets/images/third-service-img.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPixel from 'react-facebook-pixel';
import TagManager from 'react-gtm-module';
import ReactGA from 'react-ga';
import { hotjar } from 'react-hotjar'
import {Icon} from '@shopify/polaris';
import { 
    WandMajorMonotone, 
    StoreStatusMajorMonotone, 
    TipsMajorMonotone,
    ArrowRightMinor 
} from '@shopify/polaris-icons';
import Faq from './Faq';
const axios = require('axios');

export default class Home extends React.Component {

    url;
    endpoint;
    interval;
    urlId;
    directCheckLoader = false;
    enableTracking = true;
    tracking = false;
    // BACKEND_URL = 'https://api.testmystorespeed.com/api/v1';
    BACKEND_URL = 'https://speedchecker-1.herokuapp.com/api/v1';
    dotsBackground = { "firstDot": "#4758be", "secondDot": "#3043af", "thirdDot": "#1b2f9f"};

    loadingScreenTextList = [
        {id: 1, detail: '64% of smartphone users expect pages to load in 5 seconds or less.', display: true},
        {id: 2, detail: 'Amazon did tests that showed they would lose $1.6 billion every year if they slowed down by just one second.', display: false},
        {id: 3, detail: 'Google announced in 2010 that website speed is taken into account when ranking websites.', display: false},
        {id: 4, detail: 'A two-second delay in page load time can cause your bounce rate to double.', display: false},
    ]

    constructor(props) {
        super(props);
        
        this.state = {
            data: null,
            loader: false,
            dataLoaded: false,
            counter: 0,
            url: null,
            tracking: false,
            error: {
                hasError: false,
                message: null
            }
        }
        this.DirectApiSearchUsingId();
        this.EnableTracking();

        if(this.props.location.state && this.props.location.state.data) {
            this.url = this.props.location.state.data;

            this.ClearInterval();
            this.setState({
                data: null,
                loading: false,
                dataLoaded: false,
                error: {
                    hasError: false,
                    message: null
                }
            })
            if (this.url) {
                this.directCheckLoader = true;
                this.setState({
                    loader: true
                })
                this.StartIntervalToCount();
                this.StartIntervalForLoadingScreenText();
                this.LoadApiData();
            }
        }
    }

    lsCurrentTextItem = 0;
    DisplayLoadingScreenText() {
        if(this.lsCurrentTextItem === (this.loadingScreenTextList.length - 1)) {
            this.lsCurrentTextItem = -1;
        }
        this.lsCurrentTextItem = this.lsCurrentTextItem+1;
        this.loadingScreenTextList.map((i, index) => {
            this.loadingScreenTextList[index].display = false;
        })
        this.loadingScreenTextList[this.lsCurrentTextItem].display = true;
    }

    StartIntervalForLoadingScreenText() {
        this.loadingScreenTextInterval = setInterval(this.DisplayLoadingScreenText.bind(this), 10000);
    }

    UpdateLoaderValue = (value) => {
        this.setState({
            loader: value
        })

        if(value === true) {
            this.StartIntervalToCount();
        }
    }

    GetRandomNumber(max) {
        return Math.floor(Math.random() * Math.floor(max))
    }
    CountUp() {
        this.setState({
            counter: (this.state.counter + this.GetRandomNumber(2))
        })
        if(this.state.counter >= 98) {
            this.ClearInterval();
        }
    }
    ClearInterval() {
        clearInterval(this.countInterval);
    }
    StartIntervalToCount() {
        this.countInterval = setInterval(this.CountUp.bind(this), 250);
    }

    LoadApiData() {
        this.endpoint = null;
        if (this.urlId !== undefined && this.urlId !== '/home' && this.urlId !== '/result' && this.urlId !== '/') {
            this.endpoint = this.BACKEND_URL + '/sc/id' + this.urlId;
        }
        if (this.url) {
            this.endpoint = this.BACKEND_URL + '/sc/hn?url=' + this.url.replace(/^https?:\/\//, '').replace(/^http?:\/\//, '') + '&pages=' + 'all';
            // this.endpoint = this.BACKEND_URL + '/?url=' + this.url.replace(/^https?:\/\//, '').replace(/^http?:\/\//, '') + '&pages=' + 'all';
        }

        axios({
            method: 'get',
            url: this.endpoint,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                'X-Content-Type-Options': 'nosniff'
            }
        }).then(res => {
            this.ClearInterval();
            console.log(res.data)
            let data = [{
                product: res.data.google_pagespeed_products,
                collection: res.data.google_pagespeed_collections,
                cart: res.data.google_pagespeed_cart,
                home: res.data.google_pagespeed_home,
                product_mobile: res.data.google_pagespeed_mobile_products,
                collection_mobile: res.data.google_pagespeed_mobile_collections,
                cart_mobile: res.data.google_pagespeed_mobile_cart,
                home_mobile: res.data.google_pagespeed_mobile_home,
                detect: res.data.detection_result,
                gt_pagespeed: res.data.gtmetrix_pagespeed,
                gt_result: res.data.gtmetrix_result,
                gt_screenshot: res.data.gtmetrix_screenshot,
                gt_har: res.data.gtmetrix_har,
                url: res.data.url,
                id: res.data._id,
                history: res.data.history,
            }];
            this.directCheckLoader = false;
            
            clearInterval(this.loadingScreenTextInterval)
            this.props.history.push('/result/performance', { data });
            this.setState({
                counter: 0
            })
            
        }).catch(err => {
            this.ClearInterval();
            this.setState({
                counter: 0
            })
            this.setState({
                data: null,
                loader: false,
                dataLoaded: false,
                error: {
                    hasError: true
                }
            })
            this.directCheckLoader = false;
            if (err.response && err.response.data) {
                this.setState({
                    error: {
                        message: err.response.data
                    }
                })
            } else {
                this.setState({
                    error: {
                        message: 'An unknown error occurred while testing this site. We are already informed and fixing this Problem'
                    }
                })
            }
            clearInterval(this.loadingScreenTextInterval)
            this.props.history.push('/');
            this.DisplayMessage();
        })
    }

    OnUrlChange = (event) => {
        this.url = event.target.value.replace(/^https?:\/\//, '').replace(/\//, '');
        this.setState({
            url: this.url
        })
    }

    TestShopifyUrlSpeed = (e) => {
        e.preventDefault();
        this.ClearInterval();
        this.setState({
            data: null,
            loading: false,
            dataLoaded: false,
            error: {
                hasError: false,
                message: null
            }
        })
        if (this.url) {
            this.setState({
                loader: true
            })
            this.StartIntervalToCount();
            this.StartIntervalForLoadingScreenText();
            this.LoadApiData();
        }
    }

    DirectApiSearchUsingId = () => {
        this.urlId = this.props.match.params[0];
        this.directCheckLoader = false;
        if (this.urlId !== undefined && this.urlId !== '/home' && this.urlId !== '/result' && this.urlId !== '/') {
            this.setState({
                loader: true
            })
            this.directCheckLoader = true;
            this.StartIntervalToCount();
            this.StartIntervalForLoadingScreenText();
            this.LoadApiData();
        }
    } 

    DisplayMessage = () => {
        toast.error(this.state.error.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
        });
    }

    EnableTracking = () => {
        if(!this.tracking && this.enableTracking) {
            const tagManagerArgs = {
                gtmId: 'GTM-MWVC4KG'
            }
            TagManager.initialize(tagManagerArgs);
            const advancedMatching = {}
            ReactGA.initialize('UA-130515862-2')
            ReactGA.pageview(window.location.pathname + window.location.search)
            const fbOptions = {
                autoConfig: true,
                debug: false,
            }
            ReactPixel.init('136616084074089', advancedMatching, fbOptions)
            ReactPixel.pageView();
            hotjar.initialize(1676568, 6)
            this.tracking = true;
        }
    }

    render() {

        return (
            <>
                <ToastContainer/>
                {
                    this.state.loader || this.directCheckLoader
                    ? 
                        <div className="main-container loading-screen">
                            <div className="header-section content-section">
                                <div className="inner-container">
                                    <h2 className="logo">
                                        <a href="/">Ecom Experts</a>
                                    </h2>
                                    <div className='cmp-title-name dark-text'>
                                        <h2 className="cmp-title">Test My Store Speed</h2>
                                        <p className="cmp-name">by Ecom Experts</p>
                                    </div>
                                </div>
                            </div>

                            <div className="slider-services">
                                <div className="inner-container">
                                    <div className="single-slider-item">
                                        <div className="single-slider-content">
                                            <p className="title-message">Did you know…</p>
                                            {
                                                this.loadingScreenTextList.map((i, index) => {
                                                    if(i.display === true) {
                                                        return(
                                                            <h2 className="service-title" key={index}>{i.detail}</h2>
                                                        )
                                                    }
                                                })
                                            }
                                        </div>
                    
                                        <div className="single-slider-animation">
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="progress-bar bottom-bar">
                                <span className="complete-progress" style={{width: this.state.counter + '%'}}>
                                    <span className="progress-value">{this.state.counter}%</span>
                                </span>
                            </div>
                        </div>
                    : 
                        <div className="main-container">
                            <div className="header-section content-section home-page-header">
                                <div className="inner-container">
                                    <h2 className="logo">
                                        <a href="/">Ecom Experts</a>
                                    </h2>
                                    <div className='cmp-title-name'>
                                        <h2 className="cmp-title">Test My Store Speed</h2>
                                        <p className="cmp-name">by Ecom Experts</p>
                                    </div>
                    
                                    <div className="speed-test-section">
                                        <h2 className="title-text">How fast is your Shopify store?</h2>
                    
                                        <div className="speed-test-input-section">
                                            <form>
                                                <input type="text" placeholder="Enter your store URL" onChange={this.OnUrlChange} />
                                                <button type="submit" onClick={this.TestShopifyUrlSpeed} className="desktop-button">Test my speed</button>
                                                <button type="submit" onClick={this.TestShopifyUrlSpeed} className="mobile-button">
                                                    <Icon source={ArrowRightMinor} color="white" />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                    
                                    <div className="static-performance">
                                        <img src={staticPerformanceResult} alt="Static Result" />
                                    </div>
                                </div>
                            </div>

                            <div className="services-section">
                                <div className="inner-container">
                                    <p className="title-message">Did you know…</p>
                                    <h2 className="services-title" style={{marginBottom: 0}}>Every extra second that it takes to load your site results in a 7% loss of conversions.</h2>

                                    <ul className="dots">
                                        <li style={{backgroundColor: this.dotsBackground.firstDot}}></li>
                                        <li style={{backgroundColor: this.dotsBackground.secondDot}}></li>
                                        <li style={{backgroundColor: this.dotsBackground.thirdDot}}></li>
                                    </ul>

                                    <h2 className="services-title">We built Test My Store Speed to help you win them back.</h2>
                                    <div className="single-service">
                                        <div className="service-detail">
                                            <Icon source={StoreStatusMajorMonotone} />
                                            <h2>Analyze your entire Shopify website.</h2>
                                            <p>
                                                We’ve combined the web’s best performance tools to provide a comprehensive diagnostic solution.
                                            </p>

                                            <ul>
                                                <li>Best-in-class speed insights from Google Page Speed</li>
                                                <li>Advanced website diagnostics from GT Metrix</li>
                                                <li>Custom built tools, specifically made for Shopify</li>
                                            </ul>
                                        </div>
                                        
                                        <div className="service-advertise">
                                            <img src={firstServiceImg} alt="First Service" />
                                        </div>
                                    </div>

                                    <div className="single-service">
                                        <div className="service-advertise">
                                            <img src={secondServiceImg} alt="Second Service" />
                                        </div>

                                        <div className="service-detail">
                                            <Icon source={TipsMajorMonotone} />
                                            <h2>See precisely what you can do about it.</h2>
                                            <p>
                                                We’ll create a personalized list of recommendations to help you maximize your store’s potential.
                                            </p>

                                            <ul>
                                                <li>See how your theme is affecting your speed</li>
                                                <li>Assess the apps that are loading across your site</li>
                                                <li>See the images that are not optimized for web</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="single-service">
                                        <div className="service-detail">
                                            <Icon source={WandMajorMonotone} />
                                            <h2>See precisely what you can do about it.</h2>
                                            <p>
                                                We’ll create a personalized list of recommendations to help you maximize your store’s potential.
                                            </p>

                                            <ul>
                                                <li>See how your theme and apps could be optimized</li>
                                                <li>Learn how to fix your non-web optimized images</li>
                                                <li>SView a full list of technical improvements for your HTML, CSS, and JavaScript</li>
                                            </ul>
                                        </div>
                                        
                                        <div className="service-advertise">
                                            <img src={thirdServiceImg} alt="Third Service" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="stop-losing-section content-section">
                                <h2 className="title-text">Stop losing sales.</h2>
                                <p>Analyze your Shopify store today — for free.</p>
                                
                                <div className="speed-test-input-section">
                                    <form>
                                        <input type="text" placeholder="Enter your store URL" onChange={this.OnUrlChange} />
                                        <button type="submit" onClick={this.TestShopifyUrlSpeed} className="desktop-button">Test my speed</button>
                                        <button type="submit" onClick={this.TestShopifyUrlSpeed} className="mobile-button">
                                            <Icon source={ArrowRightMinor} color="white" />
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <Faq />

                            <div className="footer-section">
                                <div className="inner-container">
                                    <span>
                                        <img src={process.env.PUBLIC_URL + footerLogo} alt="Footer Logo" />
                                        Test My Store Speed is brought to you by Ecom Experts
                                    </span>
                                </div>
                            </div>
                        </div>
                }
            </>
        )
    }
}
