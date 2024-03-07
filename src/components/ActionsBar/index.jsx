import style from './style.module.css'

import { useContext } from 'preact/hooks'

import { AppContext } from '../App'
import { Icon } from '../Icon'
import { Grocer } from '../../controllers/Grocer.js'


export const ActionsBar = () => {
	const {
		myAccountIsVisible,
		setMyAccountIsVisible,
		listItems,
		setListItems,
		messageData,
		setMessageData,
	} = useContext( AppContext )

	// toggle display of My Account panel
	const handleShowAccountClick = () => setMyAccountIsVisible( !myAccountIsVisible )

	// delete currently checked list items
	// todo -- move to separate file for clarity?
	const handleTrashClick = () => {
		const deleteItemPromises = []

		// loop through each item and individually send request to delete item (in future, we'll update API to support
		// deleting multiple items in one request)
		listItems.forEach( item => {
			const { id, name, isChecked } = item

			if( isChecked ) {
				deleteItemPromises.push(
					new Promise( ( resolve, reject ) => {
						Grocer.deleteItem( id )
							.then( () => resolve( id ) )
							.catch( () => reject({ id, name }) )
					})
				)
			}
		})

		// once requests are done, update view and show error message if any items failed to delete
		Promise.allSettled( deleteItemPromises ).then( results => {
			const actuallyDeletedItemIds = []
			const failedToDeleteItemNames = []

			results.forEach( result => {
				if( 'fulfilled' === result.status ) {
					actuallyDeletedItemIds.push( result.value )
				} else {
					failedToDeleteItemNames.push( result.reason.name )
				}
			})

			// if items weren't deleted, show error message
			if( failedToDeleteItemNames.length ) {
				setMessageData({
					message: `Failed to delete the following items: ${failedToDeleteItemNames.join( ', ' )}`,
					isError: true,
					delay: 5000,
				})
			}

			// refresh view regardless of fail/success actions
			const refreshedListItems = listItems.filter( item => !actuallyDeletedItemIds.includes( item.id ) )

			setListItems( refreshedListItems )
		})
	}

	return (
		<div class={style.bar}>
			<button
				class={`${style.button} ${style.buttonGreen}`}
				onClick={handleShowAccountClick}
			>
				<Icon
					name="account"
					color="var( --colorWhite )"
				/>
			</button>
			<button
				class={`${style.button} ${style.buttonRed}`}
				onClick={handleTrashClick}
			>
				<Icon
					name="trash"
					color="var( --colorWhite )"
				/>
			</button>
		</div>
	)
}
