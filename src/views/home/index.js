import React, { Component } from 'react'
import scss from './index.scss'
import ajax from '@/axios'
import { promiseSetState, lazyLoad } from '@/tools'
import { message, Spin } from 'antd'
import Jroll from 'jroll'
import { Link } from 'react-router-dom'
import Swiper from 'swiper/dist/js/swiper.min.js'
import 'swiper/dist/css/swiper.min.css'

// store
import { connect } from 'react-redux'
import { setHome } from '@/store/actions'

import img404 from '@/assets/404.jpg'

const mapStateToProps = state => {
	return {
		data: state.data
	}
}
const mapDispatchToProps = dispatch => {
	return {
		setHome(data) {
			return dispatch(setHome(data))
		}
	}
}

class Home extends Component {
	constructor() {
		super()
		this.state = {
			viewData: [],
			myScroll: null
		}
		this.canJump = true
		this.prevPoint = 0
	}

	jumpList(e) {
		if (!this.canJump) {
			e.preventDefault()
		}
	}

	async componentDidMount() {
		try {
			let data
			if (this.props.data.home.length === 0) {
				const res = await ajax({
					method: 'get',
					url: '/api/menu/GetAll'
				})
				data = res.data
				this.props.setHome(data.Data)

				if (data.Code !== 1) {
					message.warning('请求失败，请重试')
					return
				}
			} else {
				data = this.props.data
			}
			window.jsObj && window.jsObj.closeLoading()

			const tempData = data.Data || data.home

			await promiseSetState.call(this, 'viewData', tempData)

			const imgs = document.querySelectorAll('img')
			if (imgs.length) {
				// promise结果
				const promises = [].slice.call(imgs).map(el => lazyLoad(el))

				// 图片加载结果，这里等待promise结果
				const loadRes = await Promise.all(promises)
				if (loadRes.every(item => item)) {
					document.querySelector('.swiper-container').style.height =
						imgs[0].height + 'px'

					new Swiper('.swiper-container', {
						autoplay: true,
						autoHeight: true
					})
				} else {
					message.error('图片加载失败，请重试')
				}
			}
			promiseSetState.call(this, 'myScroll', new Jroll(`.${scss.wrap}`))

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
			message.error(error)
		}
	}

	componentWillUnmount() {
		this.destroyScroll()
	}

	// 关闭的时候在开启
	destroyScroll() {
		this.state.myScroll !== null && this.state.myScroll.destroy()
		promiseSetState.call(this, 'myScroll', null)
	}

	// 使用Jroll，只对第一个子元素起作用，其他的被忽略，第一个啊，记住是第一个
	// 还需要css的配合
	// 注意钩子函数的问题
	render() {
		let bannerIndex = this.state.viewData.findIndex(item => {
			return item.MenuValue === 'banner'
		})
		const banner = this.state.viewData.slice(bannerIndex, bannerIndex + 1)

		const renderPlay = () => {
			let res
			if (banner[0]) {
				res = banner[0].Children.map(item => {
					return (
						<div className="swiper-slide" key={item.MenuCode}>
							<img src={item.ImageUrl} alt="" />
						</div>
					)
				})
			} else {
				res = ''
			}
			return res
		}

		const renderImgs = () => {
			return this.state.viewData
				.filter(item => item.MenuValue !== 'banner')
				.map(item => {
					return (
						<div
							className="content"
							style={{
								height:
									typeof this.contents !== 'undefined'
										? this.contents.offsetWidth / 2 * 3 / 4
										: 0 + 'px'
							}}
							key={item.MenuCode}
						>
							<Link
								to={{
									pathname: '/list',
									search: `id=${
										item.MenuValue.split(':')[1]
									}&name=${item.MenuName}&img=${
										item.ImageUrl
									}`
								}}
								onClick={this.jumpList.bind(this)}
							>
								<div
									className="spacing"
									style={{
										backgroundImage: `url(
										${item.ImageUrl || img404}
									)`
									}}
								>
									<p>{item.MenuName}</p>
								</div>
							</Link>
						</div>
					)
				})
		}
		return (
			<div className={scss.wrap}>
				<div className="innerWrap">
					<div className="swiper-container">
						<div className="swiper-wrapper">{renderPlay()}</div>
					</div>
					<div>
						<div
							className="contents"
							ref={el => (this.contents = el)}
						>
							{renderImgs()}
						</div>
					</div>
				</div>

				<div
					className="spinWrap"
					style={{
						display: this.state.myScroll === null ? 'flex' : 'none',
						zIndex: this.state.myScroll === null ? 10 : -1
					}}
				>
					<Spin size="large" />
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
