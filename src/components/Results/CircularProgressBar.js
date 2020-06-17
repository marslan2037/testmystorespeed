import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import Helpers from '../../Helpers';

export default class CircularProgressBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <CircularProgressbar 
                    value={this.props.score} 
                    text={this.props.text}
                    styles={
                        buildStyles({
                            pathColor: new Helpers().getColor(this.props.score),
                            textColor: new Helpers().getColor(this.props.score),
                        })
                    }
                />
            </>
        )
    }
}
