import React from 'react';
import { Pie } from 'react-chartjs-2';

export default class PieChart extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            data: {
                labels: ['Script', 'HTML', 'Font', 'Image', 'CSS', 'Other'],
                datasets: [{
                    data: props.data,
                    backgroundColor: [
                        '#e0ecf4',
                        '#bfd3e6',
                        '#9ebcda',
                        '#958cc6',
                        '#895cc4',
                        '#6b3ca9'
                    ],
                    hoverBackgroundColor: [
                        '#e0ecf4',
                        '#bfd3e6',
                        '#9ebcda',
                        '#958cc6',
                        '#895cc4',
                        '#6b3ca9'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                tooltips: {
                    callbacks: {
                        label: function(tooltipItems, data) {
                            if(props.chart_section === 'processing_request') {
                                return data.labels[tooltipItems.index] +': ' + data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] + ' requests';
                            } else {
                                var num = data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index];
                                var num_parts = num.toString().split(".");
                                num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                
                                return data.labels[tooltipItems.index] +': ' + num_parts + ' Kb';
                            }
                        }
                    },
                },
                responsive: true,
                legend: {
                    display: true,
                    position: 'right',
                    fullWidth: false,
                    labels: {
                        boxWidth: 15,
                    }
                },
            }
        }
    }

    render () {
        return (
            <>
                <div className='pie'>
                    <div className="chart">
                        <Pie data={this.state.data} options={this.state.options} />
                    </div>
                </div>                
            </>
        )
    }
}

