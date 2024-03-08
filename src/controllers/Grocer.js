import { get, set } from 'idb-keyval'
import { API } from './API.js'
import { Creds } from './Creds.js'


export class Grocer {


	static #idbKey = 'annona_api_grocery_items'


	/**
	 * Fetch grocery items
	 *
	 * @todo currently fetching creds twice (once in this method and once in API); see if there's a way to optimize
	 *
	 * @return {Promise<array>}
	 */
	static async getItems() {

		// start with items from storage
		let items = await get( Grocer.#idbKey )

		// if we never saved items before, this will be undefined (so let's make it an array)
		if( !Array.isArray( items ) ) {
			items = []
		}

		// if no Internet connection, then this is as far as we go
		if( !window.navigator.onLine ) {
			return items
		}

		// otherwise, check for creds from API
		const creds = await Creds.getCreds()

		// if not logged in, stop here
		if( !creds ) {
			return items
		}

		// otherwise, let's fetch items from API
		const apiRes = await API.sendRequest( 'items/get', 'GET', true )
		const apiItems = apiRes?.items ?? []

		// combine local items and API items, but always favor API items (e.g. names)
		const itemMap = new Map

		items.forEach( item => itemMap.set( item.id, item.name ) )
		apiItems.forEach( item => itemMap.set( item.id, item.name ) )

		const listItems = Array.from( itemMap, ( [ id, name ] ) => ({ id, name }) )

		// todo -- compare arrays to avoid unneeded saving
		// make sure storage has the latest information
		await set( Grocer.#idbKey, listItems )

		return listItems
	}


	/**
	 * Add grocery item
	 *
	 * @param {string} name
	 * @return {Promise<number>} New item ID, if successful
	 */
	static async addItem( name ) {
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
							name,
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
	 * @return {Promise<boolean>} True, if successful
	 */
	static updateItem( id, name ) {
		return new Promise( ( resolve, reject ) => {
			Creds
				.getCreds()
				.then( creds => {

					// don't save if user isn't logged in
					if( !creds ) {
						return reject( 'You must be logged in to update items.' )
					}

					API
						.sendRequest( 'items/update', 'PATCH', true, {
							id,
							name,
						}).then( res => {

							// if no status prop, something went wrong with API
							if( !res.status ) {
								return reject( 'Failed to save item. Please try again.' )
							} else {
								if( 'success' === res.status ) {
									return resolve( true )
								} else {
									return reject( res.message )
								}
							}
						})
				})
		})
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
