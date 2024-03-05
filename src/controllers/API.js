import { Creds } from './Creds.js'


export class API {


	static apiUrl = 'https://api.annona.robr.app'


	/**
	 * Generic method to create request
	 *
	 * @param {string} endpointSlug (e.g. "items/get" )
	 * @param {boolean} includeAuth
	 * @param {string} method
	 *
	 * @return {Promise<object>} fetch object
	 */
	static async sendRequest( endpointSlug, includeAuth = false, method = 'GET' ) {
		const endpoint = `${API.apiUrl}/${endpointSlug}`
		const headers = new Headers

		headers.set( 'content-type', 'application/json' )

		if( includeAuth ) {
			headers.set( 'authorization', await API.#getAuthorizationHeader() )
		}

		return new Promise( ( resolve, reject ) => {
			fetch( endpoint, {
				method,
				headers
			})
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
