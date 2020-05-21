import React from 'react';
import ResponseCodeRow from './ResponseCodeRow';

export default class ResponseCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            folded: true
        }
    } 

    responseCodeList = [];
    GetResponseSectionData = (data) => {
        this.responseCodeList = [];
        const entries = data.log.entries;

        entries.forEach((item) => {
            if (!this.responseCodeList[item.response.status]) {
                this.responseCodeList[item.response.status] = [];
            }
            this.responseCodeList[item.response.status].push(item);
        })
    }

    render() {
        this.GetResponseSectionData(this.state.data);

        return (
            <>
                <div className="p-detail-box">
                    <h2>Response Codes</h2>

                    <div className="p-card-box-detail">
                        <div className="p-card-box-heading p-card-box-row">
                            <p className="card-name">Code</p>
                            <p className="card-loading-detail">Responses</p>
                        </div>
                        {
                            this.responseCodeList ? 
                            this.responseCodeList.map((item) => {
                                return (
                                    <div className="p-card-box-row" key={item[0].response.status}>
                                        <ResponseCodeRow status={item[0].response.status} item={item} />
                                    </div>
                                )
                            })

                            : 

                            <div className="p-card-box-row">
                                <p>No Data!</p>
                            </div>
                        }
                    </div>
                </div>   
            </>
        )
    }
}
