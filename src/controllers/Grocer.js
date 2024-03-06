import { API } from './API.js'
import { Creds } from './Creds.js'


export class Grocer {


	/**
	 * Fetch grocery items
	 *
	 * @return {Promise<array>}
	 */
	static async getItems() {
		const creds = await Creds.getCreds()

		// if user isn't logged in, return empty list
		if( !creds ) {
			return []
		}

		const req = await API.sendRequest(
			'items/get',
			'GET',
			true,
		)

		return req?.items ?? []
	}


	/**
	 * Add grocery item
	 *
	 * @param {string} name
	 * @return {bool} True, if successful
	 */
	static addItem( name ) {

	}


	/**
	 * Update grocery item
	 *
	 * @param {number} id
	 * @param {string} name
	 *
	 * @return {bool} True, if successful
	 */
	static updateItem( id, name ) {

	}


	/**
	 * Delete grocery item
	 *
	 * @param {number} id
	 * @return {bool} True, if successful
	 */
	static deleteItem( id ) {

	}

}
