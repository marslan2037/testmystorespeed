import React from 'react';
import Helpers from '../../Helpers';
var HttpStatus = require('http-status-codes');

export default class ResponseCodeRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: props.status,
            item: props.item,
            folded: true
        }
    }

    ToggleFolded = () => {
        this.setState({
            folded: !this.state.folded
        })
    }

    GetResponseStatusText = (code) => {
        try {
            return HttpStatus.getStatusText(code);
        } catch (e) {
            return 'N/A';
        }
    }

    render() {
        
        return (
            <>
                <p className="card-name have-icon" onClick={this.ToggleFolded}>
                    <span className="p-card-icon">
                        <i className={this.state.folded ? 'fa fa-angle-right' : 'fa fa-angle-down'}></i>
                    </span>
                    <span className="text">
                        <span className={'mini-number-label label-' + new Helpers().getStatusColor(this.state.status)}>
                            {this.state.status}
                        </span>
                        {this.GetResponseStatusText(this.state.status)}
                    </span>
                </p>
                <p className="card-loading-detail">{this.state.item.length}</p>
                <ul className={this.state.folded ? 'p-card-hidden-detail p-hide-detail' : 'p-card-hidden-detail'}>
                {
                    this.state.item.map((i, index) => {
                        if (i.request.url) {
                            return (
                                <li key={index}><span>{JSON.stringify(i.request.url)}</span></li>
                            )
                        } else {
                            return null;
                        }
                    })
                }
                </ul>
            </>
        )
    }
}
