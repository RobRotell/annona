import styled from '@emotion/styled'
import { GroceryListItem } from './GroceryListItem.jsx'
import { createContext } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { Grocer } from '../controllers/Grocer.js'


const List = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="56"><rect width="100%" height="2" fill="%231E8FA2"/></svg>');
	background-repeat: repeat-y;
`


export const ListContext = createContext( null )


export const GroceryList = () => {

	const [ listItems, setListItems ] = useState( [] )

	useEffect( () => {
		Grocer
			.getItems()
			.then( items => {
				setListItems( items )
			}).catch( err => {
				console.log( err )
			})
	}, [] )

	const providerData = {
		listItems,
		setListItems,
	}


	return (
		<ListContext.Provider value={providerData}>
			<List>
				{listItems.map( item => (
					<GroceryListItem
						key={item.id}
						name={item.name}
					/>
				) )}
			</List>
		</ListContext.Provider>
	)
}
