import { API } from './API.js'
import { Creds } from './Creds.js'
import { Stocker } from './Stocker.js'


export class Grocer {


	/**
	 * Turn map of items into an array of item objects
	 *
	 * @param {Map} map
	 * @return {array}
	 */
	static #arrayifyItemMap( map ) {
		return Array.from( map, ( [ id, name ] ) => ({ id, name }) )
	}


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
		const localItems = await Stocker.getSavedLocalItems()

		// if user isn't logged in, then this is as far as we go
		if( !creds ) {
			localItems.forEach( name => items.set( name, name ) )

			return Grocer.#arrayifyItemMap( items )
		}

		// at this point, assume we have items saved locally that were fetched from API
		const savedApiItems = await Stocker.getSavedAPIItems()

		// weed out local items that are also in API items to avoid duplicates
		const localItemsNoDuplicates = localItems.filter( localItemName => {
			return savedApiItems.some( apiItem => localItemName === apiItem.name )
		})

		// if we don't have network access, then combine local with API items and return that
		if( !window.navigator.onLine ) {

			// use opportunity to remove duplicate local items
			if( localItems.length !== localItemsNoDuplicates.length ) {
				Stocker.saveLocalItems( localItemsNoDuplicates ) // we DON'T need to wait for this is done
			}

			localItemsNoDuplicates.forEach( name => items.set( name, name ) )
			savedApiItems.forEach( item => items.set( item.id, item.name ) )

			return Grocer.#arrayifyItemMap( items )
		}

		/**
		 * At this point, we can safely assume:
		 * 	- user is logged in
		 * 	- user has network access
		 *
		 */

		// go through local items and save to API
		const addLocalItemPromises = []

		localItems.forEach( name => {
			addLocalItemPromises.push( new Promise( ( resolve, reject ) => {
				API.sendRequest( 'items/add', 'POST', true, {
					name
				}).then( res => {
					if( res && res.status && 'success' === res.status ) {
						resolve({
							id: res.items[0].id,
							name
						})

					// todo -- add logging to see if any items failed to save
					} else {
						reject()
					}
				})
			}) )
		})

		// todo -- add error logging to see if any items failed to save
		const addedLocalItemResults = await Promise.allSettled( addLocalItemPromises )

		// filter out items that were saved in API
		let notAddedLocalItems = []
		addedLocalItemResults.forEach( result => {
			if( 'fulfilled' === result.status ) {
				notAddedLocalItems = localItems.filter( name => name !== result.value.name )
			}
		})

		// delete/resave local items based on above (we DON'T need to wait on this)
		if( !notAddedLocalItems.length ) {
			Stocker.deleteSavedLocalItems()
		} else {
			Stocker.saveLocalItems( notAddedLocalItems )
		}

		// time to fetch items remotely from API
		const apiRes = await API.sendRequest( 'items/get', 'GET', true )
		const remoteAPIItems = apiRes?.items ?? []

		// let's save these (we DON'T need to wait)
		Stocker.saveAPIItems( remoteAPIItems )

		// all together now
		notAddedLocalItems.forEach( name => items.set( name, name ) )
		remoteAPIItems.forEach( item => items.set( item.id, item.name ) )

		return Grocer.#arrayifyItemMap( items )
	}


	/**
	 * Add grocery item
	 *
	 * @todo handle preexisting items being saved
	 *
	 * @param {string} name
	 * @return {Promise<string|number>} name for item (if offline or local), ID if saving to API
	 */
	static async addItem( name ) {
		const creds = await Creds.getCreds()

		// if user isn't logged in (or no network connection), then this is as far as we go
		if( !creds || !window.navigator.onLine ) {
			await Stocker.saveSingleLocalItem( name )

			return name
		}

		/**
		 * At this point, we can safely assume:
		 * 	- user is logged in
		 * 	- user has network access
		 *
		 */
		const apiRes = await API.sendRequest( 'items/add', 'POST', true, {
			name
		})

		// did saving to API fail? If so, stop here
		if( !apiRes || !apiRes.status || 'success' !== apiRes.status ) {
			throw new Error( 'Failed to save item. Please try again.' )
		}

		const newItemId = apiRes.items[0].id

		// save API item to storage (we DON'T need to wait on this)
		Stocker.saveSingleAPIItem({
			id: newItemId,
			name,
		})

		return newItemId
	}


	/**
	 * Update grocery item
	 *
	 * @param {string|number} id string if local item, otherwise, number
	 * @param {string} name
	 *
	 * @return {Promise<boolean>} True, if successful
	 */
	static async updateItem( id, name ) {
		const creds = await Creds.getCreds()

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
