import React, { Component } from 'react'
import scss from './index.scss'
import ajax from '@/axios'
import { promiseSetState, lazyLoad } from '@/tools'
import { message, Spin } from 'antd'
import IScroll from 'iscroll'
import { Link } from 'react-router-dom'

// store
import { connect } from 'react-redux'
import { setHome } from '@/store/actions'
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

			const tempData = data.Data || data.home
			await promiseSetState.call(this, 'viewData', tempData)

			const imgs = document.querySelectorAll('img')
			// promise结果
			const promises = [].slice.call(imgs).map(el => lazyLoad(el))

			// 图片加载结果，这里等待promise结果
			const loadRes = await Promise.all(promises)
			if (loadRes.every(item => item)) {
				promiseSetState.call(
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

	// 关闭的时候在开启
	destroyScroll() {
		this.state.myScroll !== null && this.state.myScroll.destroy()
		promiseSetState.call(this, 'myScroll', null)
	}

	// 使用iScroll，只对第一个子元素起作用，其他的被忽略，第一个啊，记住是第一个
	// 还需要css的配合
	// 注意钩子函数的问题
	render() {
		const renderImgs = () => {
			return this.state.viewData.map(item => {
				return (
					<div
						className="content"
						style={{
							height:
								typeof this.contents !== 'undefined'
									? this.contents.offsetWidth / 2
									: 0 + 'px'
						}}
						key={item.MenuCode}
					>
						<div className="spacing">
							<Link
								to={{
									pathname: '/list',
									search: `id=${
										item.MenuValue.split(':')[1]
									}&name=${item.MenuName}`
								}}
								onClick={this.jumpList.bind(this)}
							>
								<img
									src={
										item.ImageUrL ||
										'http://img4.imgtn.bdimg.com/it/u=2823434616,1362037498&fm=200&gp=0.jpg'
									}
									alt=""
								/>
							</Link>
							<p>{item.MenuName}</p>
						</div>
					</div>
				)
			})
		}
		return (
			<div className={scss.wrap + ' swiper-container'}>
				<div className="swiper-wrapper">
					<div className="swiper-slide">
						<img
							src="https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1236117006,3892149680&fm=173&s=0551396CC44EA75556E840920300909B&w=640&h=384&img.JPEG"
							alt=""
						/>
					</div>
					<div className="swiper-slide">
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
