import React from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'react-apexcharts';
import Helpers from '../../Helpers';
import ClipLoader from "react-spinners/ClipLoader";
import CompareHistory from './CompareHistory';
const axios = require('axios');

export default class SpeedHistory extends React.Component {

    BACKEND_URL = 'https://api.testmystorespeed.com/api/v1';
    constructor (props) {
        super(props);
    
        this.state = {
            loading: true,
            // data: {
            //     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            //     datasets: [
            //         {
            //             label: 'My First dataset',
            //             fill: false,
            //             lineTension: 0.1,
            //             backgroundColor: 'rgba(75,192,192,0.4)',
            //             borderColor: 'rgba(75,192,192,1)',
            //             borderCapStyle: 'butt',
            //             borderDash: [],
            //             borderDashOffset: 0.0,
            //             borderJoinStyle: 'miter',
            //             pointBorderColor: 'rgba(75,192,192,1)',
            //             pointBackgroundColor: '#fff',
            //             pointBorderWidth: 1,
            //             pointHoverRadius: 5,
            //             pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            //             pointHoverBorderColor: 'rgba(220,220,220,1)',
            //             pointHoverBorderWidth: 2,
            //             pointRadius: 1,
            //             pointHitRadius: 10,
            //             data: props.history[0].data.length === 0 ? [] : props.history
            //         }
            //     ],
            // },
            // options: {
            //     noData: {
            //         text: 'No history, yet',
            //         align: 'center',
            //         verticalAlign: 'middle',
            //         offsetX: 0,
            //         offsetY: 0,
            //         style: {
            //             color: undefined,
            //             fontSize: '14px',
            //             fontFamily: undefined
            //         }
            //     },
            //     chart: {
            //         id: 'history',
            //         animations: {
            //             enabled: true,
            //             easing: 'easeinout',
            //             speed: 400,
            //             animateGradually: {
            //                 enabled: false,
            //                 delay: 50
            //             },
            //             dynamicAnimation: {
            //                 enabled: true,
            //                 speed: 350
            //             }
            //         },
            //         toolbar: {
            //             show: true,
            //             tools: {
            //                 download: false,
            //                 selection: false,
            //                 zoom: false,
            //                 zoomin: false,
            //                 zoomout: false,
            //                 pan: false,
            //                 reset: false,
            //                 customIcons: []
            //             },
            //             autoSelected: 'zoom'
            //         },
            //     },
            //     markers: {
            //         size: 6,
            //     },
            //     stroke: {
            //         show: true,
            //         curve: 'smooth',
            //         lineCap: 'round',
            //         colors: undefined,
            //         width: 2,
            //         dashArray: 0,
            //     },
            //     yaxis: {
            //         seriesName: 'Time',
            //         labels: {
            //             formatter: (value) => { return value.toFixed(2) + 's' },
            //         },
            //         axisBorder: {
            //             show: true
            //         }
            //     },
            //     xaxis: {
            //         type: 'datetime',
            //         axisBorder: {
            //             show: true
            //         }
            //     },
            //     tooltip: {
            //         enabled: true,
            //         enabledOnSeries: undefined,
            //         shared: false,
            //         followCursor: false,
            //         intersect: true,
            //         inverseOrder: false,
            //         custom: undefined,
            //         fillSeriesColor: false,
            //         theme: false,
            //         style: {
            //             fontSize: '12px',
            //             fontFamily: undefined
            //         },
            //         onDatasetHover: {
            //             highlightDataSeries: false,
            //         },
            //         x: {
            //             show: true,
            //             format: 'dd MMM',
            //             formatter: undefined,
            //         },
            //         y: {
            //             formatter: undefined,
            //             title: {
            //                 formatter: (seriesName) => seriesName,
            //             },
            //         },
            //         z: {
            //             formatter: undefined,
            //             title: 'Size: '
            //         },
            //         marker: {
            //             show: true,
            //         },
            //         items: {
            //             display: 'flex',
            //         },
            //         fixed: {
            //             enabled: false,
            //             position: 'topRight',
            //             offsetX: 0,
            //             offsetY: 0,
            //         },
            //     }
            // },
            series: props.history[0].data.length === 0 ? [] : props.history,
            url: props.url,
            advanceData: false,
            leftValue: '',
            rightValue: '',
            leftSideResults: null,
            rightSideResults: null,
            historyList: [],


            lpageLoadTime: 0,
            lpageSize: 0,
            ltotalRequests: 0,
            lpageScore: 0,
            lpageScoreText: 0,

            rpageLoadTime: 0,
            rpageSize: 0,
            rtotalRequests: 0,
            rpageScore: 0,
            rpageScoreText: 0,
        }

        this.handleLeftChange = this.handleLeftChange.bind(this);
        this.handleRightChange = this.handleRightChange.bind(this);

        this.GetPreviousHistoryList();
    }

    DisplayAdvanceData = () => {
        this.setState({
            advanceData: true
        })
    }

    leftValue = false;
    leftData;
    rightData;
    rightValue = false;
    handleLeftChange = (e) => {
        console.log(e.target.value)
        this.leftValue = true;
        this.leftData = e.target.value;
        // this.setState({
        //     leftValue: e.target.value
        // })

        if(this.leftValue && this.rightValue) {
            this.LoadPreviousHistory();
        }
    }

    handleRightChange = (e) => {
        console.log(e.target.value)
        this.rightValue = true;
        this.rightData = e.target.value;
        // this.setState({
        //     rightValue: e.target.value
        // })

        if(this.leftValue && this.rightValue) {
            this.LoadPreviousHistory();
        }
    }

    leftSide = false;
    rightSide = false;
    LoadPreviousHistory = () => {
        this.setState({
            loading: true,
            leftValue: this.leftData,
            rightValue: this.rightData
        })
        this.leftSide = false;
        this.rightSide = false;
        axios({
            method: 'get',
            url: this.BACKEND_URL + '/sc/id/' + this.leftData,
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              'Access-Control-Allow-Origin': '*',
              'X-Content-Type-Options': 'nosniff'
            }
        }).then(response => {
            console.log(response);
            this.leftSide = true;
            this.setState({
                leftSideResults: response.data
            })

            this.UpDateLoadingHistoryData();
        })

        axios({
            method: 'get',
            url: this.BACKEND_URL + '/sc/id/' + this.rightData,
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              'Access-Control-Allow-Origin': '*',
              'X-Content-Type-Options': 'nosniff'
            }
        }).then(response => {
            console.log(response);
            this.rightSide = true;
            this.setState({
                rightSideResults: response.data
            })

            this.UpDateLoadingHistoryData();
        })

        
    }

    UpDateLoadingHistoryData() {
        if(this.leftSide && this.rightSide) {
            console.log('loading is false now')
            this.setState({
                loading: false
            })
            // this.CountLeftTotalResult();
            // this.CountRightTotalResult();
            console.log(this.state);
        }
    }

    // CountLeftTotalResult() {
    //     let data = new Helpers().calculatePageScores(this.state.leftSideResults.google_pagespeed_home.lighthouseResult.audits)
    //     let score = Math.abs(100 * this.state.leftSideResults.google_pagespeed_home.lighthouseResult.categories.performance.score);

    //     this.setState({
    //         lpageLoadTime: data[3],
    //         lpageSize: data[5],
    //         lpageRequests: data[6],
    //         lpageScore: score,
    //         lpageScoreText: score < 0 ? "N/A" : Math.round(score)
    //     })
    // }

    // CountRightTotalResult() {
    //     let data = new Helpers().calculatePageScores(this.state.rightSideResults.google_pagespeed_home.lighthouseResult.audits)
    //     let score = Math.abs(100 * this.state.rightSideResults.google_pagespeed_home.lighthouseResult.categories.performance.score);

    //     this.setState({
    //         rpageLoadTime: data[3],
    //         rpageSize: data[5],
    //         rpageRequests: data[6],
    //         rpageScore: score,
    //         rpageScoreText: score < 0 ? "N/A" : Math.round(score)
    //     })
    // }

    mounted = false;
    GetPreviousHistoryList = () => {
        axios({
            method: 'get',
            url: this.BACKEND_URL + '/sc/hl/' + this.state.url.replace('https://', ''),
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                'X-Content-Type-Options': 'nosniff'
            }
        }).then(response => {
            this.PutDataInHistoryList(response.data);
        }).catch(error => {
            this.setState({
                loading: false
            })
        });
    }

    PutDataInHistoryList = (data) => {
        let lists = [];
        data.map(item => {
            const d = new Date(item.timestamp)
            lists.push({id: item.id, label: d.toLocaleDateString() + ' ' + d.toLocaleTimeString()});
        })
        
        if(this.mounted) {
            this.setState({
                historyList: lists,
                loading: false
            })
        }
    } 

    componentWillMount() { this.mounted = true; }
    componentWillUnmount() { this.mounted = false; }

    componentDidUpdate() {
        console.log('component is updated')
    }


    render() {

        return (
            <>
                <div className="single-section-box">
                    <div className="p-detail-box">
                        <h2>Speed over time</h2>
                    </div>

                    <div className="p-detail-box">
                        <h2>Compare Performance</h2>
                        
                        {
                            this.state.loading ? 

                            <div className="loading-screen">
                                <ClipLoader
                                    size={35}
                                    color={"#123abc"}
                                    loading={this.state.loading}
                                />
                            </div>

                            : 

                            null
                        }
                        
                        <div className="p-compare-card-box">
                            <div className="p-compare-box-heading">
                            
                                <div className="p-compare-box-row">
                                    <p></p>
                                    <p>
                                        <select id="userleftlist" onChange={this.handleLeftChange}>
                                            <option>Select Value</option>
                                            {this.state.historyList.map((v, i) => <option key={i} value={v.id}>{v.label}</option>)}
                                        </select>
                                    </p>
                                    <p>
                                        <select id="userrightlist" onChange={this.handleRightChange}>
                                            <option>Select Value</option>
                                            {this.state.historyList.map((v, i) => <option key={i} value={v.id}>{v.label}</option>)}
                                        </select>
                                    </p>
                                </div>
                            </div>

                            {
                                // this.state.leftValue && this.state.rightValue ? 

                                <div className="result">

                                    {
                                        this.leftSide && this.rightSide ? 

                                        <>
                                            <CompareHistory 
                                                data={this.state.leftSideResults} 
                                            />

                                            <CompareHistory 
                                                data={this.state.rightSideResults}
                                            />
                                        </>

                                        :

                                        null
                                    }


                                    {/* <CompareHistory data={this.state.leftSideResults.google_pagespeed_home} /> */}
                                    {/* <div className="p-compare-card-box">
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
                                                <p>Page Load time</p>
                                                <p>{this.state.dLoadTime} s</p>
                                                <p>{this.state.mLoadTime}</p>
                                            </div>

                                            <div className="p-compare-box-row">
                                                <p>Total Page size</p>
                                                <p>{this.state.dSize}</p>
                                                <p>{this.state.mSize}</p>
                                            </div>

                                            <div className="p-compare-box-row">
                                                <p>Requests</p>
                                                <p>{this.state.dRequests}</p>
                                                <p>{this.state.mRequests}</p>
                                            </div>
                                        </div>
                                    </div> */}
                                    

                                    {/* <div className="p-compare-card-box">
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
                                                <p>Page Load time</p>
                                                <p>{this.state.dLoadTime} s</p>
                                                <p>{this.state.mLoadTime}</p>
                                            </div>

                                            <div className="p-compare-box-row">
                                                <p>Total Page size</p>
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
                                                        <p>%</p>
                                                        <p>%</p>
                                                    </div>

                                                    <div className="p-compare-box-row">
                                                        <p>HTML</p>
                                                        <p>%</p>
                                                        <p>%</p>
                                                    </div>

                                                    <div className="p-compare-box-row">
                                                        <p>CSS</p>
                                                        <p>%</p>
                                                        <p>%</p>
                                                    </div>
                                                </>

                                                : 

                                                null
                                            }
                                        </div>
                                    </div> */}
                                </div>
                                
                            
                                // :

                                // null
                            }

                            {/* {
                                this.state.leftValue && this.state.rightValue ? 

                                this.state.advanceData ? null :

                                <div className="advance-button" onClick={this.DisplayAdvanceData}>
                                    <p><i className="fa fa-angle-right"></i> Show advance</p>
                                </div>

                                :

                                null
                            } */}
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
