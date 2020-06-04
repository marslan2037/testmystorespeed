import React from 'react';

export default class InstalledApps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apps: props.apps
        }
    }
    render() {
        return (
            <>
                <div className="p-detail-box">
                    <h2>Connected Apps ({this.state.apps.length})</h2>

                    <div className="p-card-box-detail">
                        <div className="p-card-box-heading p-card-box-row">
                            <p className="card-name">App</p>
                            {/* <p className="card-loading-detail">Load time</p> */}
                            <p className="card-loading-detail"></p>
                        </div>

                        {
                            this.state.apps.length > 0 ?
                            this.state.apps.map((app) => {
                                return(
                                    <div className="p-card-box-row" key={app.name}>
                                        <p className="card-name have-img">
                                            <span className="p-card-icon">
                                                <img src={app.image_url} alt={app.name + " image"} />
                                            </span> 
                                            <span className="text">{app.name}</span>    
                                        </p>
                                        <p></p>
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
