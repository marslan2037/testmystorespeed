import React, { useEffect } from 'react';
import { fromHar } from 'perf-cascade';

export const Waterfall = ({ data, tabIndex, id }) => {
    useEffect(() => {
        const options = {
            showIndicatorIcons: true,
            leftColumnWidth: 30,
            rowHeight: 35,
            legendHolder: document.getElementById('legendHolder'),
            pageSelector: document.getElementById('pageSelector')
        }
        const perfCascadeSvg = fromHar(data, options)
        let element = document.getElementById('har_chart' + id)
        if (element.childElementCount === 0) {
            document.getElementById('har_chart' + id).appendChild(perfCascadeSvg)
        }
    }, [id, data])

    return (
        <div className="res_section">
            <div className={'helpMoreInfo'}>
                <div className='head'>Waterfall</div>
                <a href={'#faq-waterfall'}></a>
            </div>
            <div className={'waterFallChart'} id={'legendHolder'} />
            <div className={'waterFallChart'} id={'har_chart' + id}/>
            <select className={'waterFallChart'} id={'pageSelector'} />
        </div>
    )
}


