import style from './style.module.css'

import { createContext } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

import { Grocer } from '../../controllers/Grocer.js'

import { AppContext } from '../App'
import { GroceryListItem } from '../GroceryListItem'


export const ListContext = createContext( null )


export const GroceryList = () => {
	const { hasSignedIn, setHasSignedIn } = useContext( AppContext )

	const [ listItems, setListItems ] = useState( [] )

	// populate list items when user is auto-signed (on page load) or signs in manually
	useEffect( () => {
		if( hasSignedIn ) {
			Grocer
				.getItems()
				.then( items => {
					setListItems( items )
				}).catch( err => {
					console.log( err )
				})
		}
	}, [ hasSignedIn ] )

	const providerData = {
		listItems,
		setListItems,
	}


	return (
		<ListContext.Provider value={providerData}>
			<div class={style.list}>
				{listItems.map( item => (
					<GroceryListItem
						key={item.id}
						name={item.name}
					/>
				) )}
			</div>
		</ListContext.Provider>
	)
}
