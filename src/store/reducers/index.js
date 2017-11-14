// reducers

import { combineReducers } from 'redux'
import {
	Data
} from '@/store/states'

import {
	SET_HOME
} from '@/store/types'

const data = (state = Data, action) => {
	switch (action.type) {
		case SET_HOME:
		return {
			...state,
			home: [...action.data]
		}
		default:
		return state;
	}
}

// 多个reducers 共同使用demo
const redux = combineReducers({
	data
})

export default redux