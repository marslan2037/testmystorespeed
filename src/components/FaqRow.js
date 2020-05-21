import React from 'react';

export default class FaqRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.item,
            folded: true
        }
    }

    ToggleQuestion = () => {
        this.setState({
            folded: !this.state.folded
        })
    } 

    render() {
        return (
            <div>
                <div className={this.state.folded ? 'single-question closed-question' : 'single-question'}>
                    <h2 className="question" onClick={this.ToggleQuestion}>
                        {this.state.data.question} 
                        <i className={this.state.folded ? 'fa fa-angle-left' : 'fa fa-angle-down'}></i>
                    </h2>
                    <p className="answer">
                        {this.state.data.answer}
                    </p>
                </div>
            </div>
        )
    }
}
