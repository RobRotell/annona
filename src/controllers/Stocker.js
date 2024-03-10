import { del, get, set } from 'idb-keyval'


export class Stocker {


	static #idbKeyLocalItems = 'annona_local_grocery_items'
	static #idbKeyAPIItems = 'annona_api_grocery_items'


	/**
	 * Get items (that haven't yet been synced with API) saved to storage
	 *
	 * @return {Promise<array>} array of item names
	 */
	static async getSavedLocalItems() {
		const items = await get( Stocker.#idbKeyLocalItems )

		if( Array.isArray( items ) ) {
			return items
		}

		return []
	}


	/**
	 * Save single local item to storage
	 *
	 * @todo error handling if item wasn't saved
	 *
	 * @param {string} name
	 * @return {Promise<boolean>} always true
	 */
	static async saveSingleLocalItem( name ) {
		const items = await Stocker.getSavedLocalItems()

		if( !items.includes( name ) ) {
			items.push( name )

			await Stocker.saveLocalItems( items )
		}

		return true
	}


	/**
	 * Save local items to storage
	 *
	 * @todo error handling if item wasn't saved
	 *
	 * @param {array} items item names
	 * @return {Promise<boolean>} true, if successfully saved
	 */
	static async saveLocalItems( items ) {
		await set( Stocker.#idbKeyLocalItems, items )

		return true
	}


	/**
	 * Delete local items from storage
	 *
	 * Note that we're not using idb-keyval del() here. We want to keep the value, but just empty it
	 *
	 * @return {Promise<boolean>} always true
	 */
	static async deleteSavedLocalItems() {
		await set( Stocker.#idbKeyLocalItems, [] )

		return true
	}


	/**
	 * Get items fetched from API and then saved to storage
	 *
	 * @return {Promise<array>} array of objects, containing item ids and names
	 */
	static async getSavedAPIItems() {
		const items = await get( Stocker.#idbKeyAPIItems )

		if( Array.isArray( items ) ) {
			return items
		}

		return []
	}


	/**
	 * Save single API item to storage
	 *
	 * @todo error handling if item wasn't saved
	 *
	 * @param {object} newItem item id and name
	 * @return {Promise<boolean>} always true
	 */
	static async saveSingleAPIItem( newItem ) {
		const items = await Stocker.getSavedAPIItems()

		const alreadySaved = items.some( item => item.id === newItem.id )

		if( !alreadySaved ) {
			items.push( newItem )

			await Stocker.saveAPIItems( items )
		}

		return true
	}


	/**
	 * Save API items to storage
	 *
	 * @todo error handling if item wasn't saved
	 *
	 * @param {array} items array of objects, containing item IDs and item names
	 * @return {Promise<boolean>} true, if successfully saved
	 */
	static async saveAPIItems( items ) {
		await set( Stocker.#idbKeyAPIItems, items )

		return true
	}


	/**
	 * Delete API items from storage
	 *
	 * Note that we're not using idb-keyval del() here. We want to keep the value, but just empty it
	 *
	 * @return {Promise<boolean>} always true
	 */
	static async deleteSavedAPIItems() {
		await set( Stocker.#idbKeyAPIItems, [] )

		return true
	}

}
