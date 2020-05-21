import React from 'react';
import ImpactType from './ImpactType';
import RecommendationsRow from './RecommendationsRow';

export default class RecommendationsBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            name: props.name,
            theme: props.theme,
            required_improvements: true,
        }
    }

    auditsSorted;

    AddImpactType = (audits, impactType) => {
        audits[impactType.id] = impactType
    }

    GetTypeImpact = (audit) => {
        const audits = {}

        this.AddImpactType(audits, new ImpactType('uses-optimized-images', 'Images', 3, 1, true))
        this.AddImpactType(audits, new ImpactType('uses-webp-images', 'Images', 3, 1, true))
        this.AddImpactType(audits, new ImpactType('offscreen-images', 'Images', 3, 3, false))
        this.AddImpactType(audits, new ImpactType('uses-responsive-images', 'Images', 3, 2, true))
        this.AddImpactType(audits, new ImpactType('efficient-animated-content', 'Images', 3, 2, true))
      
        this.AddImpactType(audits, new ImpactType('font-display', 'CSS', 2, 1, false))
        this.AddImpactType(audits, new ImpactType('unminified-css', 'CSS', 2, 1, true))
        this.AddImpactType(audits, new ImpactType('unused-css-rules', 'CSS', 2, 3, true))
      
        this.AddImpactType(audits, new ImpactType('unminified-javascript', 'JS', 3, 2, true))
        ///////////////
        this.AddImpactType(audits, new ImpactType('third-party-summary', 'JS', 3, 2, false))
        this.AddImpactType(audits, new ImpactType('bootup-time', 'JS', 3, 2, false))
        this.AddImpactType(audits, new ImpactType('mainthread-work-breakdown', 'JS', 3, 2, false))
      
        this.AddImpactType(audits, new ImpactType('render-blocking-resources', 'Content', 2, 2, true))
        this.AddImpactType(audits, new ImpactType('uses-rel-preconnect', 'Content', 3, 2, true))
        this.AddImpactType(audits, new ImpactType('uses-rel-preload', 'Content', 3, 2, true))
        //////
        this.AddImpactType(audits, new ImpactType('network-requests', 'Content', 2, 3, false))
        this.AddImpactType(audits, new ImpactType('estimated-input-latency', 'Content', 3, 2, false))
        this.AddImpactType(audits, new ImpactType('dom-size', 'Content', 3, 2, false))
        this.AddImpactType(audits, new ImpactType('total-byte-weight', 'Content', 3, 2, false))
        this.AddImpactType(audits, new ImpactType('first-contentful-paint-3g', 'Content', 3, 2, false))
        this.AddImpactType(audits, new ImpactType('first-contentful-paint', 'Content', 3, 2, false))
        this.AddImpactType(audits, new ImpactType('first-meaningful-paint', 'Content', 3, 2, false))
        this.AddImpactType(audits, new ImpactType('speed-index', 'Content', 3, 2, false))
        this.AddImpactType(audits, new ImpactType('first-cpu-idle', 'Content', 3, 2, false))
        this.AddImpactType(audits, new ImpactType('max-potential-fid', 'Content', 3, 2, false))
        this.AddImpactType(audits, new ImpactType('interactive', 'Content', 3, 2, false))
        this.AddImpactType(audits, new ImpactType('total-blocking-time', 'Content', 3, 2, false))
      
        this.AddImpactType(audits, new ImpactType('uses-text-compression', 'Server', 3, 2, false))
        this.AddImpactType(audits, new ImpactType('use-long-cache-ttl', 'Server', 3, 2, false))
        this.AddImpactType(audits, new ImpactType('network-rtt', 'Server', 3, 2, false))
        this.AddImpactType(audits, new ImpactType('network-server-latency', 'Server', 3, 2, false))
        this.AddImpactType(audits, new ImpactType('redirects', 'Server', 3, 2, false))
        this.AddImpactType(audits, new ImpactType('time-to-first-byte', 'Server', 3, 2, false))
      
        return audits[audit.id] || new ImpactType('unknown', 'Unknown', 0, 0, false)
    }

    GetRecommendationsList = () => {
        if(this.state.data) {
            let audits = this.state.data.lighthouseResult.audits
            let auditsMap = new Map(Object.entries(audits))
            this.auditsSorted = [...auditsMap.entries()]
                .filter((item) => {
                    const accumulate = (currentValue, accumulator) => {
                        let s2 = accumulator.wastedBytes ? accumulator.wastedBytes : 0
                        return s2 + currentValue
                    }
                    const e1 = item[1]
                    if (e1.details && e1.details.items) e1.totalWastedBytes = e1.details.items.reduce(accumulate, 0)
                    else e1.totalWastedBytes = 0
                    return this.GetTypeImpact(e1).display
                })
                .sort((x, y) => {
                    const e1 = x[1]
                    const e2 = y[1]
                    const i1 = this.GetTypeImpact(e1).getSortOrder()
                    const i2 = this.GetTypeImpact(e2).getSortOrder()
                    let w1 = e1.totalWastedBytes
                    let w2 = e2.totalWastedBytes
                    if (i1 === i2) {
                        return w2 - w1
                    } else {
                        return i2 - i1
                    }
                })
        }
    }

    ToggleScores = () => {
        this.setState({
            required_improvements: !this.state.required_improvements
        })
    }

    filteredLength = [];
    GetTotalLength = () => {
        this.filteredLength = [];
        if(this.state.required_improvements && this.auditsSorted) {
            this.auditsSorted.forEach(item => {
                if(item[1].score * 100 < 100) {
                    this.filteredLength.push(item);
                }
            });
            // this.auditsSorted.map(item => {
            //     if(item[1].score * 100 < 100) {
            //         this.filteredLength.push(item);
            //     }
            // })
        } else {
            // this.auditsSorted.forEach(item => {
            //     if(item[1].score * 100 >= 100) {
            //         this.filteredLength.push(item);
            //     }
            // });
            // this.auditsSorted.map(item => {
            //     if(item[1].score * 100 >= 100) {
            //         this.filteredLength.push(item);
            //     }
            // })

            this.auditsSorted.forEach(item => {
                if(item[1].score * 100 >= 100) {
                    this.filteredLength.push(item);
                }
            });
        }
    }

    render() {
        this.GetRecommendationsList();
        // this.GetTotalLength();
        
        return (
            <>
                <div className="p-detail-box">
                    <h2>{this.state.theme ? 'Recommendations' : this.state.name} </h2>
                    <div className="p-card-box-detail">
                        <div className="p-card-box-heading p-card-box-row p-card-box-suggestion">
                            <p className="card-name">Recommendation</p>
                            <p className="type">Type</p>
                            <p className="effort">Effort</p>
                            <p className="card-loading-detail">Potential savings</p>
                        </div>
                        {
                            this.auditsSorted ?

                                this.auditsSorted.map((item) => {
                                    const impactType = this.GetTypeImpact(item[1])
                                    if(this.state.required_improvements) {
                                        if(item[1].score * 100 < 100) {
                                            return (
                                                <div className="p-card-box-row p-card-box-suggestion" key={item[1].id}>
                                                    <RecommendationsRow 
                                                        data={item[1]}
                                                        title={item[1].title} 
                                                        category={impactType.category} 
                                                        effort={impactType.getEffortString()} 
                                                        description={item[1].description}
                                                        savings={item[1].numericValue} 
                                                    />
                                                </div>
                                            )
                                        }
                                    } else {
                                        if(item[1].score * 100 >= 100) {
                                            return (
                                                <div className="p-card-box-row p-card-box-suggestion" key={item[1].id}>
                                                    <RecommendationsRow 
                                                        data={item[1]}
                                                        title={item[1].title} 
                                                        category={impactType.category} 
                                                        effort={impactType.getEffortString()} 
                                                        description={item[1].description}
                                                        savings={item[1].numericValue} 
                                                    />
                                                </div>
                                            )
                                        }
                                    }
                                    
                                })

                                :

                                <div className="p-card-box-row p-card-box-suggestion">
                                    <p>No Data!</p>
                                </div>
                        }
                    </div>

                    {
                        this.auditsSorted ?
                        <div className="advance-button">
                            <p onClick={this.ToggleScores}>
                                <i className="fa fa-angle-right"></i>
                                Show {this.state.required_improvements ? 'perfect' : 'incorrect'} scores
                            </p>
                        </div>
                        :
                        null
                    }
                </div>
            </>
        )
    }
}
