import axios from 'axios'
import cookie from 'js-cookie'

const cookies = cookie.get()
const canCarry = process.env.NODE_ENV !== 'production'

const authentication = {
	// params: {
	// 	apptoken:
	// 		cookies.apptoken ||
	// 		'4zRGHCGB/Z3Z8AZairIJRRoC7BeHuJ+d+NGImapXst/LSnppiZYj9kIQIq5ZqrCJ99W57Oh4lOHB5kTVtbCJ5QE7BndGpw2ZSUkLJnMBr6XKcQuWcN7F189IfMsAZbBG',
	// 	ticket:
	// 		cookies.ticket ||
	// 		'jMc2tAoTJpdfu1iWvJNXOCPl9S4R7u5ye-dPRWIXdmW4e7011YkbDJ3_9qARrCvTSG_yNsKG_eflGR6H3jpb6A=='
	// }
	params: {
		apptoken:
			cookies.apptoken ||
			'ADpGgejglo+aLmiDc9DIWB+irudkCORgy+KTxyK6IlKFPugDgqNfvxtm+gyVFNKtxrcJM4aH7XY+v2K3heQI3SPw3jUX+CBzNIjRLWxeZE4m69c9BYj1MnOhwLqiySiu',
		ticket:
			cookies.ticket ||
			'J7OENnmCpwGKFyBhUjyD5LXw-w3cFIZbir7AT8qzfuZ540RlKBw9mY8wAt32XF-BLXPCf5cTuUwjvQJFQ19yxg=='
	}
}

const ajax = axios.create(canCarry ? authentication : {})

export default ajax
