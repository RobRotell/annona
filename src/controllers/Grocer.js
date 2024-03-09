import { del, get, set } from 'idb-keyval'
import { API } from './API.js'
import { Creds } from './Creds.js'


export class Grocer {


	static #idbKeyAPIItems = 'annona_api_grocery_items'
	static #idbKeyLocalItems = 'annona_local_grocery_items'


	/**
	 * Fetch grocery items
	 *
	 * @todo currently fetching creds twice (once in this method and once in API); see if there's a way to optimize
	 *
	 * @return {Promise<array>}
	 */
	static async getItems() {
		const items = new Map
		const creds = await Creds.getCreds()

		// fetch items that have been saved locally but not yet to the API
		let localItems = await get( Grocer.#idbKeyLocalItems ) // this will return just an array of item names

		if( Array.isArray( localItems ) && localItems.length ) {

			// if we have network access and user has an account, let's add these to API to sync everything
			if( window.navigator.onLine && creds ) {
				const addItemPromises = []

				localItems.forEach( name => {
					addItemPromises.push( new Promise( ( resolve, reject ) => {
						API.sendRequest( 'items/add', 'POST', true, {
							name,
						}).then( res => {
							if( res && res.status && 'success' === res.status ) {
								resolve({
									id: res.items[0].id,
									name
								})
							} else {
								reject()
							}
						})
					}) )
				})

				const results = await Promise.allSettled( addItemPromises )

				// only worry about the added ones
				results.forEach( result => {
					if( 'fulfilled' === result.status ) {
						localItems = localItems.filter( item => item !== result.value.name )
					}
				})
			}

			// todo -- do we need to await?
			if( !localItems.length ) {
				await del( Grocer.#idbKeyLocalItems )
			} else {
				await set( Grocer.#idbKeyLocalItems, localItems )

				localItems.forEach( name => {
					items.set( Symbol( name ), name )
				})
			}
		}

		// if user is logged in and has network access, fetch items from API
		if( !window.navigator.onLine ) {
			const apiItems = await get( Grocer.#idbKeyAPIItems )

			if( Array.isArray( apiItems ) ) {
				apiItems.forEach( item => {
					items.set( item.id, item.name )
				})
			}

		} else {
			if( creds ) {
				const apiRes = await API.sendRequest( 'items/get', 'GET', true )
				const apiItems = apiRes?.items ?? []
	
				apiItems.forEach( item => {
					items.set( item.id, item.name )
				})
	
				// todo -- do we need to await
				await set( Grocer.#idbKeyAPIItems, apiItems )
			}
		}

		const listItems = Array.from( items, ( [ id, name ] ) => ({ id, name }) )

		return listItems
	}


	/**
	 * Add grocery item
	 *
	 * @param {string} name
	 * @return {Promise<Symbol|number>} Symbol for item (if offline or local), ID if saving to API
	 */
	static async addItem( name ) {

		const creds = await Creds.getCreds()

		// if not logged in (or if no network), save locally
		if( !creds || !window.navigator.onLine ) {
			let localItems = await get( Grocer.#idbKeyLocalItems )

			if( !Array.isArray( localItems ) ) {
				localItems = []
			}

			localItems.push( name )

			await set( Grocer.#idbKeyLocalItems, localItems )

			return Symbol( name )

		// otherwise, save to API
		} else {
			const apiRes = await API.sendRequest( 'items/add', 'POST', true, {
				name,
			})

			if( !apiRes || !apiRes.status || 'success' !== apiRes.status ) {
				throw new Error( 'Failed to save item. Please try again.' )
			}

			const newItemId = apiRes.items[0].id

			let items = await get( Grocer.#idbKeyAPIItems )

			if( !Array.isArray( items ) ) {
				items = []
			}

			items.push({
				id: newItemId,
				name
			})

			await set( Grocer.#idbKeyAPIItems, items )

			return apiRes.items[0].id
		}
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
