import React, { Component } from 'react'
import scss from './index.scss'
import IScroll from 'iscroll'
import { lazyLoad } from '@/tools'
import {
	message, Button
} from 'antd'

class Article extends Component {
	constructor () {
		super()
		this.state = {

		}
		this.myScroll = null
	}

	componentWillUnmount () {
		if (this.myScroll !== null) {
			this.myScroll.destroy()
			this.myScroll = null
		}
	}

	async componentDidMount () {
		try {
			const imgs = document.querySelectorAll(`.${ scss.wrap } img`)

			const promises = [].slice.call(imgs).map(el => lazyLoad(el))

			const loadRes = await Promise.all(promises)

			// 手势滑动部分
			if (loadRes.every(item => item)) {
				this.myScroll = new IScroll(`.${ scss.wrap } .contentBox`)
			} else {
				message.error('图片加载失败，请重试')
			}
		} catch (error) {
			message.error(error)
		}
	}

	render () {
		// innerHTML
		const createMarkup =  () => {
			return {__html: data.content}
		}

		const { data } = this.props
		return (<div className={scss.wrap}>
			<div className="contentBox">
				<div className="tempBox">
					<Button shape="circle" icon="close" onClick={this.props.close}/>
					<div className="articleTitle">{data.title}</div>
					<div className="author">作者：{data.author}</div>
					<div className="imgBox">
					</div>
					<div className="content" dangerouslySetInnerHTML={createMarkup()}></div>
				</div>
			</div>
		</div>)
	}
}

export default Article
