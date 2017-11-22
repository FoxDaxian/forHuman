import React, { Component } from 'react'
import scss from './index.scss'
import ajax from '@/axios'
import Jroll from 'jroll'
import { connect } from 'react-redux'
import { catchArticle } from '@/store/actions'
import { promiseSetState } from '@/tools'
import { message, Row, Col, Spin, Button } from 'antd'
import queryString from 'query-string'

// views
import Article from '@/components/article'

import img404 from '@/assets/404.jpg'

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
		this.prevPoint = 0
	}

	async componentWillMount() {
		try {
			const pageTitle = queryString.parse(this.props.location.search).name
			const search = queryString.parse(this.props.location.search).id
			this.pageTitle = pageTitle
			await promiseSetState.call(this, 'toggleSpin', true)
			const res = await ajax({
				method: 'get',
				url: '/api/compilation/article/catalog',
				params: {
					categorycode: search,
					pagesize: 20,
					pageindex: 1,
					itemcount: 0
				}
			})
			window.jsObj && window.jsObj.closeLoading()
			const { data } = res
			if (data.Code !== 1) {
				message.error('请求失败，请重试')
				return
			}
			await promiseSetState.call(this, 'data', data.Data)
			promiseSetState.call(this, 'toggleSpin', false)
			await promiseSetState.call(
				this,
				'myScroll',
				new Jroll(`.${scss.wrap}`)
			)

			const self = this
			this.state.myScroll.on('scrollStart', function() {
				self.prevPoint = this.y
			})

			this.state.myScroll.on('scroll', function() {
				if (this.y !== self.prevPoint) {
					if (self.canJump) {
						self.canJump = false
					}
				}
			})

			this.state.myScroll.on('scrollEnd', () => {
				setTimeout(() => {
					this.canJump = true
				}, 0)
			})
		} catch (error) {
			console.log(error)
		}
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
							style={{
								height:
									typeof this.contents !== 'undefined'
										? this.contents.offsetWidth / 6 * 3 / 4
										: 0 + 'px'
							}}
						>
							<Col
								className="gutter-row"
								span={4}
								style={{
									backgroundImage: `url(${item.SmallImgName ||
										img404})`
								}}
							/>
							<Col className="gutter-row" span={20}>
								<p className="name">{item.Title}</p>
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
				<div className="content" ref={el => (this.contents = el)}>
					<p className="title">
						<span>{this.pageTitle}</span>
						<Button type="dashed" onClick={this.goBack.bind(this)}>返回</Button>
					</p>
					<div className="titleImg">
						<div
							className="glass"
							style={{
								backgroundImage: `url(${
									queryString.parse(
										this.props.location.search
									).img
								})`
							}}
						/>
					</div>
					{renderLists()}
				</div>
				<div
					className="spinWrap"
					style={{
						display: this.state.toggleSpin ? 'flex' : 'none'
					}}
				>
					<Spin size="large" />
				</div>
				{renderArticle()}
			</div>
		)
	}

	async closeArticle() {
		const self = this
		promiseSetState.call(this, 'articleData', {})
		await promiseSetState.call(this, 'myScroll', new Jroll(`.${scss.wrap}`))

		this.state.myScroll.on('scrollStart', function() {
			self.prevPoint = this.y
		})

		this.state.myScroll.on('scroll', function() {
			if (this.y !== self.prevPoint) {
				if (self.canJump) {
					self.canJump = false
				}
			}
		})

		this.state.myScroll.on('scrollEnd', () => {
			setTimeout(() => {
				this.canJump = true
			}, 0)
		})
	}

	goBack () {
		this.props.history.goBack()
	}

	async jumpArticle(articleid) {
		if (!this.canJump) {
			return
		}
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
			window.jsObj && window.jsObj.closeLoading()
			promiseSetState.call(this, 'toggleSpin', false)
			const propsToArticle = {
				id: data.Data.ArticleID,
				title: data.Data.Title,
				author: data.Data.Author || '未知',
				img: data.Data.BigImgName || img404,
				content: data.Data.Content
			}
			promiseSetState.call(this, 'articleData', propsToArticle)
			this.props.catchArticle(propsToArticle)
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(List)
