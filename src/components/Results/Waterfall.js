// import React, { useEffect }  from 'react';
// import { fromHar } from 'perf-cascade';
// import 'react-perfcascade/dist/react-perfcascade.css';
// import {HarFileView} from 'react-perfcascade';

// export default class Waterfall extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             data: props.data
//         }
//     }

//     perfCascadeSvg;
//     LoadData = () => {
//         const options = {
//             showIndicatorIcons: true,
//             leftColumnWidth: 30,
//             rowHeight: 35,
//           }
//           this.perfCascadeSvg = fromHar(this.state.data, options);
//         //   document.appendChild(this.perfCascadeSvg)
//         console.log(this.perfCascadeSvg)
//         //   console.log(perfCascadeSvg)
//         //   let element = document.getElementById('har_chart' + 1)
//         //   document.getElementById('har_chart' + 1).appendChild(perfCascadeSvg)
//     }

//     render() {
//         this.LoadData();
        
//         return (
//             <>
// <HarFileView harData={this.perfCascadeSvg} />
//             </>
//             // <div>
//             //     <div className="res_section">
//             //         <div className={'helpMoreInfo'}>
//             //             <div className='head'>Waterfall</div>
//             //             <a href={'#faq-waterfall'}>
//             //             {/* <img alt='Help' id="helpImage" src={helpImage} onClick={waterfallFaqClick}/> */}
//             //             </a>
//             //         </div>
//             //         <div className={'waterFallChart'} id={'legendHolder'} />
//             //         <div className={'waterFallChart'} id={'har_chart' + 1}/>
//             //         <select className={'waterFallChart'} id={'pageSelector'} />

//             //         <div>
//             //             {this.perfCascadeSvg}
//             //         </div>
//             //     </div>
//             // </div>
//         )
//     }
// }



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

//   const setOpenFaq = useStore('openFaq')[1]

//   const waterfallFaqClick = () => {
//     setOpenFaq('waterfall')
//     tabIndex(3)
//   }

  return (
    <div className="res_section">
      <div className={'helpMoreInfo'}>
        <div className='head'>Waterfall</div>
        <a href={'#faq-waterfall'}>
          {/* <img alt='Help' id="helpImage" src={helpImage} onClick={waterfallFaqClick}/> */}
        </a>
      </div>
      <div className={'waterFallChart'} id={'legendHolder'} />
      <div className={'waterFallChart'} id={'har_chart' + id}/>
      <select className={'waterFallChart'} id={'pageSelector'} />
    </div>
  )
}


