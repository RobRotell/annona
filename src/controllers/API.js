import { Creds } from './Creds.js'


export class API {


	static apiUrl = 'https://api.annona.robr.app'


	/**
	 * Generic method to create request
	 *
	 * @param {string} endpointSlug (e.g. "items/get" )
	 * @param {boolean} includeAuth
	 * @param {string} method
	 * @param {object|null} payload
	 *
	 * @return {Promise<object>} fetch object
	 */
	static async sendRequest( endpointSlug, method = 'GET', includeAuth = false, payload = null ) {
		const endpoint = `${API.apiUrl}/${endpointSlug}`
		const headers = new Headers
		const reqData = {}

		if( payload ) {
			reqData.body = JSON.stringify( payload )
			headers.set( 'content-type', 'application/json' )
		}

		if( includeAuth ) {
			headers.set( 'authorization', await API.#getAuthorizationHeader() )
		}

		reqData.method = method
		reqData.headers = headers

		return new Promise( ( resolve, reject ) => {
			fetch( endpoint, reqData )
				.then( res => res.json() )
				.then( res => resolve( res ) )
				.catch( err => reject( err ) )
		})
	}


	/**
	 * Get authorization header value
	 *
	 * @return {Promise<string>}
	 */
	static async #getAuthorizationHeader() {
		let username = ''
		let password = ''

		const creds = await Creds.getCreds()

		if( creds ) {
			if( 'string' === typeof creds.username && creds.username.length ) {
				username = creds.username
			}

			if( 'string' === typeof creds.password && creds.password.length ) {
				password = creds.password
			}
		}

		const joined = `${username}:${password}`

		return `Basic ${window.btoa( joined )}`
	}

}
