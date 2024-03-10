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
	 * @throws {Error} failed to save item to API
	 *
	 * @param {string} name
	 * @return {Promise<string|number>} name for item (if offline or local), ID if saving to API
	 */
	static async addItem( name ) {
		const creds = await Creds.getCreds()

		// if user isn't logged in (or no network connection), then add local item
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

		// save API item to storage
		await Stocker.saveSingleAPIItem({
			id: newItemId,
			name,
		})

		return newItemId
	}


	/**
	 * Update grocery item
	 *
	 * @todo split this into updating local item versus updating API item
	 * @todo rework to delete local item and save as API item if Internet connection
	 *
	 * @throws {Error} updating API item without network connection
	 * @throws {Error} failed to update item in API
	 *
	 * @param {string|number} id string if local item, otherwise, number
	 * @param {string} name
	 *
	 * @return {Promise<boolean>} True, if successful
	 */
	static async updateItem( id, name ) {
		const creds = await Creds.getCreds()
		const isLocalItem = 'number' !== typeof id

		// if user isn't logged in (or we're updating a local item), then update local item
		if( !creds || isLocalItem ) {
			await Stocker.updateLocalItem( id, name )

			return true
		}

		// if user has no network connection, stop here (admittedly, not best UX)
		if( !window.navigator.onLine ) {
			throw new Error( 'Cannot update item without an Internet connection.' )
		}

		/**
		 * At this point, we can safely assume:
		 * 	- user is logged in
		 * 	- user has network access
		 *
		 */
		const apiRes = await API.sendRequest( 'items/update', 'PATCH', true, {
			id,
			name,
		})

		if( !apiRes || !apiRes.status || 'success' !== apiRes.status ) {
			throw new Error( 'Failed to update item. Please try again.' )
		}

		// update storage
		await Stocker.updateAPIItem( id, name )

		return true
	}


	/**
	 * Delete grocery item
	 *
	 * @todo split this into updating local item versus updating API item
	 *
	 * @throws {Error} deleting API item without Internet connection
	 *
	 * @param {string|number} id
	 * @return {Promise<boolean>} True, if successful
	 */
	static async deleteItem( id ) {
		const creds = await Creds.getCreds()
		const isLocalItem = 'number' !== typeof id

		// if user isn't logged in (or if it's a local item), then delete local item
		if( !creds || isLocalItem ) {
			await Stocker.deleteLocalItem( id )

			return true
		}

		// if user has no network conneciton, stop here (admittedly, not best UX)
		if( !window.navigator.onLine ) {
			throw new Error( 'Cannot delete item without an Internet connection.' )
		}

		/**
		 * At this point, we can safely assume:
		 * 	- user is logged in
		 * 	- user has network access
		 *
		 */
		const apiRes = await API.sendRequest( 'items/delete', 'DELETE', true, {
			id
		})

		if( !apiRes || !apiRes.status || 'success' !== apiRes.status ) {
			throw new Error( 'Failed to delete item. Please try again.' )
		}

		// update storage
		await Stocker.deleteAPIItem( id )

		return true
	}

}
