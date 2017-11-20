import React, { Component } from 'react'
import scss from './index.scss'
import ajax from '@/axios'
import IScroll from 'iscroll'
import { connect } from 'react-redux'
import { catchArticle } from '@/store/actions'
import { promiseSetState, limitLength, lazyLoad } from '@/tools'
import { message, Row, Col, Spin } from 'antd'

// views
import Article from '@/components/article'

const mapStateToProps = state => {
	return {
		data: state.data
	}
}

const mapDispatchToProps = dispatch => {
	return {
		catchArticle(data) {
			return dispatch(catchArticle(data))
		}
	}
}

class List extends Component {
	constructor() {
		// render 用不到的state，不要用setState更改，不然会触发render重新执行
		super()
		this.state = {
			data: [],
			articleData: {},
			myScroll: null,
			toggleSpin: false
		}
		this.canJump = true
		this.pageTitle = ''
	}

	async componentWillMount() {
		promiseSetState.call(this, 'toggleSpin', true)
	}

	async componentDidMount() {
		try {
			const pageTitle = decodeURI(
				[].slice
					.call(this.props.location.search, 1)
					.join('')
					.split('&')[1]
					.split('=')[1]
			)
			const search = [].slice
				.call(this.props.location.search, 1)
				.join('')
				.split('&')[0]
				.split('=')[1]
			this.pageTitle = pageTitle
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

			const imgs = document.querySelectorAll(`.${scss.wrap} .img`)

			const promises = [].slice.call(imgs).map(el => lazyLoad(el))

			const loadRes = await Promise.all(promises)

			// 手势滑动部分
			if (loadRes.every(item => item)) {
				promiseSetState.call(
					this,
					'myScroll',
					new IScroll(`.${scss.wrap}`, {
						scrollbars: true
					})
				)

				promiseSetState.call(this, 'toggleSpin', false)

				this.state.myScroll.on('scrollStart', () => {
					this.canJump = false
				})

				this.state.myScroll.on('scrollEnd', () => {
					setTimeout(() => {
						this.canJump = true
					}, 0)
				})
			} else {
				message.error('图片加载失败，请重试')
			}
		} catch (error) {
			message.error(error)
		}
	}

	componentWillUnmount() {
		this.destroyScroll()
	}

	render() {
		const renderLists = () => {
			try {
				return this.state.data.map(item => {
					return (
						<Row
							key={item.ArticleID}
							onClick={this.jumpArticle.bind(
								this,
								item.ArticleID
							)}
						>
							<Col className="gutter-row" span={6}>
								<img
									className="img"
									src={
										item.BigImgName ||
										'http://img4.imgtn.bdimg.com/it/u=2823434616,1362037498&fm=200&gp=0.jpg'
									}
									alt=""
								/>
							</Col>
							<Col className="gutter-row" span={18}>
								<p className="name">{item.Title}</p>
								<p className="summary">
									{limitLength(item.Summary, 486)}
								</p>
							</Col>
						</Row>
					)
				})
			} catch (error) {
				return <h1>暂无数据</h1>
			}
		}

		const renderArticle = () => {
			if (Object.keys(this.state.articleData).length) {
				return (
					<Article
						data={this.state.articleData}
						close={this.closeArticle.bind(this)}
					/>
				)
			}
		}

		return (
			<div className={scss.wrap}>
				<div className="content">
					<p className="title">{this.pageTitle}</p>
					{renderLists()}
				</div>
				<div
					className="spinWrap"
					style={{
						display: this.state.toggleSpin ? 'flex' : 'none',
						zIndex: this.state.myScroll === null ? 10 : -1
					}}
				>
					<Spin size="large" />
				</div>
				{renderArticle()}
			</div>
		)
	}

	async closeArticle() {
		promiseSetState.call(this, 'articleData', {})
		await promiseSetState.call(
			this,
			'myScroll',
			new IScroll(`.${scss.wrap}`, {
				scrollbars: true
			})
		)
		this.state.myScroll.on('scrollStart', () => {
			this.canJump = false
		})

		this.state.myScroll.on('scrollEnd', () => {
			setTimeout(() => {
				this.canJump = true
			}, 0)
		})
	}

	// 关闭的时候在开启
	destroyScroll() {
		this.state.myScroll !== null && this.state.myScroll.destroy()
		promiseSetState.call(this, 'myScroll', null)
	}

	async jumpArticle(articleid) {
		if (!this.canJump || this.state.myScroll === null) {
			return
		}
		this.destroyScroll()
		if (this.props.data.articles[articleid]) {
			promiseSetState.call(
				this,
				'articleData',
				this.props.data.articles[articleid]
			)
		} else {
			promiseSetState.call(this, 'toggleSpin', true)
			const res = await ajax({
				method: 'get',
				url: '/api/compilation/article/GetDetail',
				params: {
					articleid
				}
			})
			const { data } = res
			promiseSetState.call(this, 'toggleSpin', false)
			const propsToArticle = {
				id: data.Data.ArticleID,
				title: data.Data.Title,
				author: data.Data.Author || '未知',
				img:
					data.Data.BigImgName ||
					'http://img4.imgtn.bdimg.com/it/u=2823434616,1362037498&fm=200&gp=0.jpg',
				content: data.Data.Content
			}
			promiseSetState.call(this, 'articleData', propsToArticle)
			this.props.catchArticle(propsToArticle)
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(List)
