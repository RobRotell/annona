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


	const populateListItems = () => {
		Grocer
		.getItems()
		.then( items => {
			items = items.map( item => {
				item.isChecked = false
				return item
			})
			setListItems( items )
		}).catch( err => {
			console.log( err )
		})
	}


	useEffect( () => populateListItems(), [] )


	// populate list items when user is auto-signed (on page load) or signs in manually
	useEffect( () => {
		if( hasSignedIn ) {
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
