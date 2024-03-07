import { API } from './API.js'
import { Creds } from './Creds.js'


export class Grocer {


	/**
	 * Fetch grocery items
	 *
	 * @todo currently fetching creds twice (once in this method and once in API); see if there's a way to optimize
	 *
	 * @return {Promise<array>}
	 */
	static getItems() {
		return new Promise( resolve => {
			Creds
				.getCreds()
				.then( creds => {

					// if user isn't logged in, return empty list
					if( !creds ) {
						return resolve( [] )
					}

					API
						.sendRequest( 'items/get', 'GET', true )
						.then( res => resolve( res?.items ?? [] ) )
				})
		})
	}


	/**
	 * Add grocery item
	 *
	 * @param {string} name
	 * @return {Promise<number>} New item ID, if successful
	 */
	static addItem( name ) {
		return new Promise( ( resolve, reject ) => {
			Creds
				.getCreds()
				.then( creds => {

					// don't save if user isn't logged in
					if( !creds ) {
						return reject( 'You must be logged in to save items.' )
					}

					API
						.sendRequest( 'items/add', 'POST', true, {
							name
						}).then( res => {

							// if no status prop, something went wrong with API
							if( !res.status ) {
								return reject( 'Failed to save item. Please try again.' )
							} else {
								if( 'success' === res.status ) {
									return resolve( res.items[0].id )
								} else {
									return reject( res.message )
								}
							}
						})
				})
		})
	}


	/**
	 * Update grocery item
	 *
	 * @param {number} id
	 * @param {string} name
	 *
	 * @return {boolean} True, if successful
	 */
	static updateItem( id, name ) {

	}


	/**
	 * Delete grocery item
	 *
	 * @todo currently fetching creds twice (once in this method and once in API); see if there's a way to optimize
	 *
	 * @param {number} id
	 * @return {Promise<boolean>} True, if successful
	 */
	static deleteItem( id ) {
		return new Promise( ( resolve, reject ) => {
			Creds
				.getCreds()
				.then( creds => {

					// if user isn't signed in, just delete locally
					if( !creds ) {
						return resolve( true )
					}

					API
						.sendRequest( 'items/delete', 'DELETE', true, {
							id
						}).then( res => {
							if( res.status && 'success' === res.status ) {
								return resolve( true )
							} else {
								return reject( false )
							}
						})
				})
		})
	}

}
