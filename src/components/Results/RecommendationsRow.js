import React from 'react';

export default class RecommendationsRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            title: props.title,
            category: props.category,
            effort: props.effort,
            description: props.description,
            savings: props.savings,
            folded: true
        }
    }

    ToggleFolded = () => {
        this.setState({
            folded: !this.state.folded
        })
    }
    render() {
        return (
            <>
                <p className="card-name have-icon" onClick={this.ToggleFolded}>
                    <span className="p-card-icon">
                        <i className={this.state.folded ? "fa fa-angle-right" : "fa fa-angle-down"}></i>
                    </span>
                    <span className="text">{this.state.title ? this.state.title : null}</span>
                </p>
                <p className="type">{this.state.category}</p>
                <p className="effort">{this.state.effort}</p>
                <p className="card-loading-detail">
                    {this.state.savings} ms 
                    <span className="p-card-bar">
                        <span style={{width: (this.state.savings <= 20) ? '20%' : (this.state.savings <= 80) ? '50%' : '100%' }}
                            className={ (this.state.savings <= 20) ? 'p-result-bar p-success-bar' : (this.state.savings <= 80 ) ? 'p-result-bar p-warning-bar' : 'p-result-bar p-danger-bar'}>
                        </span>
                    </span>
                </p>
                <div style={{textAlign: 'left'}} className={this.state.folded ? "p-card-hidden-detail p-hide-detail" : "p-card-hidden-detail"}>
                    {this.state.description}

                    <ul className="p-card-hidden-detail" style={{marginTop: '10px'}}>
                    {
                        this.state.data.details && this.state.data.details.items ? this.state.data.details.items.map((item, index) => {
                            if (item.url) {
                                return (
                                    <li key={index}><span>{JSON.stringify(item.url)}</span></li>
                                )
                            } else {
                                return null
                            }
                        }) : null
                    }
                    </ul>
                </div>
            </>
        )
    }
}
