import React from 'react';
import {Icon} from '@shopify/polaris';
import { CircleInformationMajorMonotone } from '@shopify/polaris-icons';

export default class ImagesList extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            data: props.data,
            name: props.name,
            folded: true
        }
        this.GetImagesList(); 
    }

    toggleFolded = () => {
        this.setState({
            folded: !this.state.folded
        })
    }

    imagesList = [];
    GetImagesList = () => {
        this.imagesList = [];
        const audits = this.state.data.lighthouseResult.audits
        const keys = [
            'uses-optimized-images',
            'uses-webp-images',
            'offscreen-images',
            'uses-responsive-images',
            'efficient-animated-content',
        ]
        keys.forEach((key) => {
            if (audits[key].details && audits[key].details.items) {
                audits[key].details.items.forEach((item) => {
                    this.imagesList.push(item)
                })
            }
        })
    }

    render() {

        return (
            <>
                <div className="p-detail-box">
                    <div className="p-message-box p-warning-box">
                        <div className="p-icon-section"><Icon source={CircleInformationMajorMonotone} /></div>
                        <div className="p-message-box-detail">
                            <h2>Bad Images: {this.state.name}</h2>
                            <p>
                                Below are the images on your site which are not optimized for desktop usage. You may want to reduce the image size or 
                                switch to a better image format to improve performance. 
                            </p>
                        </div>
                    </div>

                    <div className="p-card-box-detail">
                        <div className="p-card-box-heading p-card-box-row">
                            <p className="card-name">Image</p>
                            <p className="card-loading-detail">Recommendation</p>
                        </div>

                        {
                            this.imagesList.length > 0 ? 
                            this.imagesList.map((image, i) => {
                                if(!this.state.folded || (this.state.folded && i < 5)) {
                                    return (
                                        <div className="p-card-box-row" key={i}>
                                            <p className="card-name have-bg-img">
                                                <span className="p-card-icon">
                                                    <img src={image.url} alt='url'/>
                                                </span> 
                                                <span className="text text-nowrap">{JSON.stringify(image.url)}</span>    
                                            </p>
                                            <p className="card-loading-detail">Properly size images</p>
                                        </div>
                                    )
                                }
                            })

                            : 

                            <div className="p-card-box-row">
                                <p>No Data!</p>
                            </div>
                        }

                        {
                            this.imagesList.length > 0 ? 
                             
                            <div className="advance-button" onClick={this.toggleFolded}>
                                <p><i className="fa fa-angle-right"></i> Show {this.state.folded ? 'more' : 'less'}</p>
                            </div>

                            : 

                            null
                        }
                    </div>
                </div>
            </>
        )
    }
}
