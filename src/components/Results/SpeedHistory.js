import React from 'react';
import Chart from 'react-apexcharts';
import moment from 'moment';
import ClipLoader from "react-spinners/ClipLoader";
import CompareHistory from './CompareHistory';
const axios = require('axios');

export default class SpeedHistory extends React.Component {

    BACKEND_URL = 'https://api.testmystorespeed.com/api/v1';
    constructor (props) {
        super(props);

        this.days_zoom = 9999;
        this.selection = '1w';
    
        this.state = {
            loading: true,
            chartLoading: false,
            options: {
                noData: {
                    text: 'No history, yet',
                    align: 'center',
                    verticalAlign: 'middle',
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        color: undefined,
                        fontSize: '14px',
                        fontFamily: undefined
                    }
                },
                chart: {
                    id: 'history',
                    animations: {
                        enabled: true,
                        easing: 'easeinout',
                        speed: 400,
                        animateGradually: {
                            enabled: false,
                            delay: 50
                        },
                        dynamicAnimation: {
                            enabled: true,
                            speed: 350
                        }
                    },
                    toolbar: {
                        show: true,
                        tools: {
                            download: false,
                            selection: false,
                            zoom: false,
                            zoomin: false,
                            zoomout: false,
                            pan: false,
                            reset: false,
                            customIcons: []
                        },
                        autoSelected: 'zoom'
                    },
                },
                markers: {
                    size: 6,
                },
                stroke: {
                    show: true,
                    curve: 'smooth',
                    lineCap: 'round',
                    colors: undefined,
                    width: 2,
                    dashArray: 0,
                },
                yaxis: {
                    seriesName: 'Time',
                    labels: {
                        formatter: (value) => { return value.toFixed(2) + 's' },
                    },
                    axisBorder: {
                        show: true
                    }
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        formatter: function (value, timestamp) {
                            return moment(timestamp).format("MMM Do YY, hA")
                        },
                        show: true,
                        style: {
                            fontWeight: 100,
                            fontSize: '0.75rem',
                        }
                    },
                    axisBorder: {
                        show: true
                    }
                },
                tooltip: {
                    enabled: true,
                    enabledOnSeries: undefined,
                    shared: false,
                    followCursor: false,
                    intersect: true,
                    inverseOrder: false,
                    custom: undefined,
                    fillSeriesColor: false,
                    theme: false,
                    style: {
                        fontSize: '12px',
                        fontFamily: undefined
                    },
                    onDatasetHover: {
                        highlightDataSeries: false,
                    },
                    x: {
                        show: true,
                        format: 'dd MMM',
                        formatter: undefined,
                    },
                    y: {
                        formatter: undefined,
                        title: {
                            formatter: (seriesName) => seriesName,
                        },
                    },
                    z: {
                        formatter: undefined,
                        title: 'Size: '
                    },
                    marker: {
                        show: true,
                    },
                    items: {
                        display: 'flex',
                    },
                    fixed: {
                        enabled: false,
                        position: 'topRight',
                        offsetX: 0,
                        offsetY: 0,
                    },
                }
            },
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

    updateSeries () {
        const zoom_min = Number(moment().subtract(this.days_zoom, 'days').format("x"))
        this.setState({
            options: { xaxis: { min: zoom_min , max: Number(moment().format('x'))} },
            chartLoading: false
        })
    }
    
    zoom (v) {
        setTimeout(() => {
            this.days_zoom = v;
            this.updateSeries();
        }, 500)
    }

    UpdateData(value) {
        this.setState({
            chartLoading: true
        })
        this.selection = value;
        if(value === '1d') {
            this.zoom(1);
        } else if(value === '1w') {
            this.zoom(7);
        } else if(value === '1m') {
            this.zoom(31);
        } else if(value === '3m') {
            this.zoom(93);
        } else if(value === '6m') {
            this.zoom(186);
        } else if(value === '1y') {
            this.zoom(365);
        } else if(value === 'all') {
            this.zoomAll();
        }
    }
    
    zoomAll () {
        const min_date = Math.min.apply(Math, this.props.history[0].data.map((o) => o.x))
        const duration = moment.duration(moment().diff(moment(min_date)))
        this.zoom(duration.asDays())
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
        this.leftValue = true;
        this.leftData = e.target.value;

        if(this.leftValue && this.rightValue) {
            this.LoadPreviousHistory();
        }
    }

    handleRightChange = (e) => {
        this.rightValue = true;
        this.rightData = e.target.value;

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
            this.rightSide = true;
            this.setState({
                rightSideResults: response.data
            })

            this.UpDateLoadingHistoryData();
        })

        
    }

    UpDateLoadingHistoryData() {
        if(this.leftSide && this.rightSide) {
            this.setState({
                loading: false
            })
        }
    }

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

    render() {

        return (
            <>
                <div className="single-section-box">

                    <ul className="chart-range-list">
                        <li className={this.selection === '1d' ? ' active' : null} onClick={() => this.UpdateData('1d')}>1d</li>
                        <li className={this.selection === '1w' ? ' active' : null} onClick={() => this.UpdateData('1w')}>1w</li>
                        <li className={this.selection === '1m' ? ' active' : null} onClick={() => this.UpdateData('1m')}>1m</li>
                        <li className={this.selection === '3m' ? ' active' : null} onClick={() => this.UpdateData('3m')}>3m</li>
                        <li className={this.selection === '6m' ? ' active' : null} onClick={() => this.UpdateData('6m')}>6m</li>
                        <li className={this.selection === '1y' ? ' active' : null} onClick={() => this.UpdateData('1y')}>1y</li>
                        <li className={this.selection === 'all' ? ' active' : null} onClick={() => this.UpdateData('all')}>all</li>
                    </ul>

                    <div className="p-detail-box">
                        
                        {
                            this.state.chartLoading ?
                                <div className="loading-screen">
                                    <ClipLoader
                                        size={35}
                                        color={"#123abc"}
                                        loading={this.state.chartLoading}
                                    />
                                </div>
                            :
                            
                            null
                        }
                        

                        <h2>Speed over time</h2>
                        <div className="chart line-chart">
                            <Chart options={this.state.options} series={this.state.series} type="line" height='450'/>
                        </div>
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

                                </div>
                            }
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
