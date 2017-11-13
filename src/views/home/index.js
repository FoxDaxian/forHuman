import React, { Component } from 'react'
import scss from './index.scss'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
import ajax from '@/axios'
import { message } from 'antd'

class Home extends Component {
	constructor () {
		super()
		this.state = {
			swiper: null,
			viewData: []
		}
	}

	componentWillMount () {
		ajax({
			method: 'get',
			url: '/api/menu/GetAll'
		}).then(({ data }) => {
			if (data.Code !== 1) {
				message.warning('请求失败，请重试')
			}
			this.setState({
				viewData: data.Data
			})
		}).catch((error) => {
			message.warning(error)
		})
	}

	componentDidMount () {
		if (this.state.swiper === null) {
			const swiper = new Swiper('.swiper-container', {
				direction: 'vertical',
				height: 'auto',
				freeMode: true
			})
			this.setState({
				swiper
			})
		}
	}

	render () {
		const fn = () => {
			return this.state.viewData.map((el) => {
				return (
				// list 自己写，通过MenuValue获取该list的数据
				<a href={el.MenuValue} key={el.MenuCode}>
					<div>
						<img src={el.ImageUrL || 'http://img4.imgtn.bdimg.com/it/u=2823434616,1362037498&fm=200&gp=0.jpg'} alt=""/>
						<p>{el.MenuName}</p>
					</div>
				</a>)
			})
		}
		return (
		<div className={scss.wrap}>
			<div className="swiper-container">
			    <div className="swiper-wrapper">
				    <div className="swiper-slide">
				    	<div className="swiper-slide">
				    		<img src="https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1236117006,3892149680&fm=173&s=0551396CC44EA75556E840920300909B&w=640&h=384&img.JPEG" alt=""/>
				    	</div>
			    	    <div className="swiper-slide">
			    	    	<img src="https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1236117006,3892149680&fm=173&s=0551396CC44EA75556E840920300909B&w=640&h=384&img.JPEG" alt=""/>
			    	    </div>
			    	    <div className="swiper-slide">
			    	    	{fn()}
			    	    </div>
				    </div>
			    </div>
			</div>
		</div>)
	}
}

export default Home
