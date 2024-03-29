import { get, set } from 'idb-keyval'
import { API } from './API.js'


export class Creds {


	static #idbKey = 'annona_api_creds'


	/**
	 * Get creds
	 *
	 * @todo validate creds before returning
	 *
	 * @return {Promise<object>} { username, password }
	 */
	static async getCreds() {
		return new Promise( resolve => {
			get( Creds.#idbKey )
				.then( resolve )
		})
	}


	/**
	 * Set creds
	 *
	 * @param {string} username
	 * @param {string} password
	 *
	 * @return {Promise<boolean>} True, if successfully set
	 */
	static setCreds( username, password ) {
		return new Promise( ( resolve, reject ) => {
			if( 'string' !== typeof username || !username.length ) {
				return reject( 'You must provide a username!' )
			}

			if( 'string' !== typeof password ) {
				return reject( 'Password must provide a password!' )
			}

			set( Creds.#idbKey, {
				username,
				password
			})
				.then( () => resolve( true ) )
				.catch( err => {
					console.warn( err )
					return reject( 'Failed to save credentials!' )
				})
		})
	}


	/**
	 * Validate creds again endpoint
	 *
	 * @todo catch errors
	 *
	 * @param {string} username
	 * @param {string} password
	 *
	 * @return {Promise<boolean>} True, if valid
	 */
	static validateCreds( username, password ) {
		return new Promise( resolve => {
			API.sendRequest( 'user/verify', 'POST', false, {
				username,
				password
			}).then( res => {
				resolve( res.status && 'success' === res.status )
			})
			// todo -- catch
		})
	}

}
