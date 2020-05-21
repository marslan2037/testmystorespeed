import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import Helpers from '../../Helpers';

export default class CircularProgressBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            score: props.score,
            text: props.text
        }
    }

    render() {
        return (
            <>
                <CircularProgressbar 
                    value={this.state.score} 
                    text={this.state.text}
                    styles={
                        buildStyles({
                            pathColor: new Helpers().getColor(this.state.score),
                            textColor: new Helpers().getColor(this.state.score),
                        })
                    }
                />
            </>
        )
    }
}
