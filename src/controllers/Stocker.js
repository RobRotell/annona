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
	 * Save local items to storage
	 *
	 * @param {array} items item names
	 * @return {Promise<boolean>} true, if successfully saved
	 */
	static async saveLocalItems( items ) {
		try {
			await set( Stocker.#idbKeyLocalItems, items )

			return true

		} catch ( err ) {
			return false
		}
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
	 * Save API items to storage
	 *
	 * @param {array} items array of objects, containing item IDs and item names
	 * @return {Promise<boolean>} true, if successfully saved
	 */
	static async saveAPIItems( items ) {
		try {
			await set( Stocker.#idbKeyAPIItems, items )

			return true

		} catch ( err ) {
			return false
		}
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
