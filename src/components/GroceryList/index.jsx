import style from './style.module.css'

import { createContext } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

import { Grocer } from '../../controllers/Grocer.js'

import { AppContext } from '../App'
import { GroceryListItem } from '../GroceryListItem'


export const GroceryList = () => {
	const {
		hasSignedIn,
		listItems,
		setListItems
	} = useContext( AppContext )

	// avoid fetching twice (once when My Account automatically tries to sign in and once on initial fetch)
	const [ completedInitialFetch, setCompletedInitialFetch ] = useState( false )

	const populateListItems = () => {
		Grocer.getItems()
			.then( items => {
				items = items.map( item => {
					item.isChecked = false
					return item
				})
				setListItems( items )
			}).catch( err => {
				console.log( err )
			}).finally( () => {
				setCompletedInitialFetch( true )
			})
	}

	useEffect( () => populateListItems(), [] )

	// populate user if they manually sign in AFTER automatic sign-in on page load
	useEffect( () => {
		if( completedInitialFetch && hasSignedIn ) {
			populateListItems()
		}
	}, [ hasSignedIn ] )


	return (
		<div class={style.list}>
			{listItems.map( ( item, i ) => (
				<GroceryListItem
					key={item.id}
					id={item.id}
					index={i}
					value={item.name}
					isChecked={item.isChecked}
				/>
			) )}
			<GroceryListItem
				isBlank={true}
			/>
		</div>
	)
}
