import React, { Component } from 'react'
import scss from './index.scss'
import ajax from '@/axios'
import IScroll from 'iscroll'
import { promiseSetState, limitLength, lazyLoad } from '@/tools'
import {
	message, Row, Col 
} from 'antd'

class List extends Component {
	constructor () {
		super()
		this.state = {
			pageTitle: '',
			canJump: true,
			myScroll: null,
			data: []
		}
	}
	async componentDidMount () {
		try {
			const pageTitle = unescape([].slice.call(this.props.location.search, 1).join('').split('&')[1].split('=')[1])
			const search = [].slice.call(this.props.location.search, 1).join('').split('&')[0].split('=')[1]
			promiseSetState.call(this, 'pageTitle', pageTitle)
			const res = await ajax({
				method: 'get',
				url: '/api/compilation/article/catalog',
				params: {
					categorycode: unescape(search),
					pagesize: 1,
					pageindex: 1,
					itemcount: 100
				}
			})
			const { data } = res
			if (data.Code !== 1) {
				message.error('请求失败，请重试')
				return
			}
			await promiseSetState.call(this, 'data', data.Data)

			const imgs = document.querySelectorAll(`.${ scss.wrap } img`)

			const promises = [].slice.call(imgs).map(el => lazyLoad(el))

			const loadRes = await Promise.all(promises)

			// 手势滑动部分
			if (loadRes.every(item => item)) {
				await promiseSetState.call(this, 'myScroll', new IScroll(`.${ scss.wrap }`, {
					scrollbars: true
				}))

				this.state.myScroll.on('scrollStart', () => {
					promiseSetState.call(this, 'canJump', false)
				})
				this.state.myScroll.on('scrollEnd', () => {
					setTimeout(() => {
						promiseSetState.call(this, 'canJump', true)
					}, 0)
				})
			} else {
				message.error('图片加载失败，请重试')
			}
		} catch (error) {
			console.log(error)
		}

	}

	render () {
		const renderLists = () => {
			try {
				return this.state.data.map((item) => {
					return (<Row key={item.ArticleID}>
						<Col className="gutter-row" span={10}>
							<img src={item.BigImgName} alt=""/>
						</Col>
						<Col className="gutter-row" span={14}>
							<p className="name">{item.Title}</p>
							<p className="summary">{limitLength(item.Summary, 486)}</p>
						</Col>
					</Row>)
				})
			} catch (error) {
				return <h1>暂无数据</h1>
			}
		}
		
		return (<div className={scss.wrap}>
			{renderLists()}
		</div>)
	}
}

export default List