import React from 'react'
import FaqRow from './FaqRow';

export default class Faq extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [
                {
                    question: 'What pages do you inspect?',
                    answer: 'Contrary to most speedtools that just check 1 page, we check all the pages your costomer would see (home-collection-product-cart) '
                },
                {
                    question: 'Why do you detect the store theme?',
                    answer: 'Garbage in - garbage out. We detect your theme as often a bad theme is at the core of a bad result'
                },
                {
                    question: 'Do you look at mobile speed?',
                    answer: 'Yes - 100% mobile is crucial in todays Ecommerce. all results will have a breakdown of both the mobile and the desktop.'
                },
                {
                    question: 'Why do you detect apps?',
                    answer: 'Apps are a crucial element in determening page speed. You might notice some apps listed that you stopped using a while back, well if we list it that means the code is still there, slowing down your store speed.'
                },
                {
                    question: 'What if I need help?',
                    answer: 'Totally understandable! Within the report there is a section labled "hire a developer". '  
                }
            ]
        }
    }

    render() {
        return (
            <div>
                <div className="faq-section content-section">
                    <h2 className="title-text">FAQs</h2>
                    <div className="questions-list">
                        {
                            this.state.data.map((item, i) => {
                                return(
                                    <div key={i}>
                                        <FaqRow item={item} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}
