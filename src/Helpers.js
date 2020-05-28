export default class Helpers {

    calculatePageScores (audits) {
        const cssIds = [
            'unminified-css',
            'unused-css-rules',
        ]
        const jsIds = [
            'unminified-javascript',
        ]
        const contentIds = [
            'render-blocking-resources',
            'uses-rel-preconnect',
            'uses-rel-preload',
        ]
  
        const scoreHTML = contentIds.map(item => audits[item] ? Number(audits[item].score) : 1).reduce((acc, score) => acc + score, 0)
        const scoreCSS = cssIds.map(item => audits[item] ? Number(audits[item].score) : 1).reduce((acc, score) => acc + score, 0)
        const scoreJS = jsIds.map(item => audits[item] ? Number(audits[item].score) : 1).reduce((acc, score) => acc + score, 0)
    
        const score_html = Math.floor(100 * scoreHTML / contentIds.length)
        const score_css = Math.floor(100 * scoreCSS / cssIds.length)
        const score_js = Math.floor(100 * scoreJS / jsIds.length)
    
        const plt = audits.interactive.displayValue
        const plt_num = audits.interactive.numericValue
        const page_size = audits['total-byte-weight'].numericValue
        const num_requests = audits['network-requests'].numericValue
        console.log(audits['network-requests'])
        return [score_html, score_css, score_js, plt, plt_num, page_size, num_requests]
    }
  
    formatBytes (bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        const i = 2
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + '' + sizes[i]
    }
  
    FormatBytes (bytes, decimals = 2) {
        console.log(bytes)
        if (bytes === 0) return 'Bytes'
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        const i = 1
        console.log(bytes / Math.pow(k, i))
        return sizes[i]
    }
  
    getRating (score) {
        if (score >= 90) {
            return 'A';
        } else if (score >= '80') {
            return 'B';
        } else if (score >= '70') {
            return 'C';
        } else if (score >= '60') {
            return 'D';
        } else if (score >= '30') {
            return 'E';
        } else return 'F';
    }

    getStatusColor(code) {
        if (code >= 200 && code < 300) {
            return 'green';
        } else if (code >= 300 && code < 400) {
            return 'orange';
        } else if (code >= 400 && code < 600) {
            return 'red';
        } else {
            return 'black';
        }
    }
  
    getColor (score) {
        if (score < 0) {
            return 'black';
        }
        if (score >= 90) {
            return '#08d15c';
        } else if (score >= '80') {
            return '#85e1ac';
        } else if (score >= '70') {
            return '#ffb400';
        } else if (score >= '60') {
            return '#e18267';
        } else if (score >= '30') {
            return '#d05347';
        } else return '#ff474e';
    }
}
  