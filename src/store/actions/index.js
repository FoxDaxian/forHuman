// actions

import {
	SET_HOME, CATCH_ARTICLE
} from '@/store/types'

// TODO 要传入的参数放进payload(载荷，携带)字段里，设置为对象

export const setHome = data => {
	return {
		type: SET_HOME,
		data
	}	
}

export const catchArticle = data => {
	return {
		type: CATCH_ARTICLE,
		data
	}	
}
