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
		setMessageData,
	} = useContext( AppContext )

	// toggle display of My Account panel
	const handleShowAccountClick = () => setMyAccountIsVisible( !myAccountIsVisible )

	// delete currently checked list items
	// todo -- move to separate file for clarity?
	const handleTrashClick = async () => {
		const actuallyDeletedItemIds = []
		const failedToDeleteItemNames = []

		for( const item of listItems ) {
			const { id, name, isChecked } = item

			if( isChecked ) {
				const deleted = await Grocer.deleteItem( id )

				if( !deleted ) {
					failedToDeleteItemNames.push( name )
				} else {
					actuallyDeletedItemIds.push( id )
				}
			}
		}

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
