import axios from 'axios'
import cookie from 'js-cookie'

const cookies = cookie.get()
const canCarry = process.env.NODE_ENV !== 'production'

const authentication = {
	params: {
		apptoken:
			cookies.apptoken ||
			'4zRGHCGB/Z3Z8AZairIJRRoC7BeHuJ+d+NGImapXst/LSnppiZYj9kIQIq5ZqrCJ99W57Oh4lOHB5kTVtbCJ5QE7BndGpw2ZSUkLJnMBr6XKcQuWcN7F189IfMsAZbBG',
		ticket:
			cookies.ticket ||
			'jMc2tAoTJpdfu1iWvJNXOCPl9S4R7u5ye-dPRWIXdmW4e7011YkbDJ3_9qARrCvTSG_yNsKG_eflGR6H3jpb6A=='
	}
}

const ajax = axios.create(canCarry ? authentication : {})

export default ajax
