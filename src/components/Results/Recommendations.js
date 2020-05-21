import React from 'react';
import RecommendationsBox from './RecommendationsBox';

export default class Recommendations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            desktop_data: props.desktop_data,
            mobile_data: props.mobile_data,
            name: props.name,
            theme: props.theme
        }
    }

    render() {
        return (
            <>
                <h2 className="p-small-heading">{this.state.name}</h2>
                <p className="p-small-heading-detail">Here are our recommendations for improving your {this.state.theme ? 'theme performance' : this.state.name+' page'}.</p>
                <div className="single-section-box">
                    <RecommendationsBox data={this.state.desktop_data} name={'Desktop'} theme={this.state.theme} />
                    {
                        this.state.theme ? null : <RecommendationsBox data={this.state.mobile_data} name={'Mobile'} />
                    }
                </div>
            </>
        )
    }
}
