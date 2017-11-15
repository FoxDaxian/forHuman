import { Component } from 'react'

class Tools extends Component {
	// async化setState
	promiseSetState (state, value) {
		return new Promise((resolve, reject) => {
			this.setState({
				[state]: value
			}, () => {
				resolve(true)
			})
		})
	}

	limitLength (str, limit) {
	    var i = 0,
	        len = str.trim().length,
	        tempLen = 0,
	        res = null,
	        s;
	    for (; i < len; i++) {
	        s = str.charCodeAt(i);
	        tempLen += (s >= 0 && s <= 128) ? 1 : 2;

	        if (tempLen >= limit) {
	            res = str.slice(0, i) + "...";
	            break;
	        }

	    }
	    return res !== null ? res : str;
	}

	lazyLoad (img) {
		return new Promise((resolve, reject) => {
			let timer = setInterval(() => {
				if (img.width) {
					clearInterval(timer)
					timer = null
					resolve(true)
				}
			}, 0)
		})
	}
}

export const { promiseSetState, limitLength, lazyLoad } = new Tools()
