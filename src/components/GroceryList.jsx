import styled from '@emotion/styled'
import { GroceryListItem } from './GroceryListItem.jsx'


const List = styled.div`
	display: flex;
	flex-direction: column;
	background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="56"><rect width="100%" height="2" fill="%231E8FA2"/></svg>');
	background-repeat: repeat-y;
`


export const GroceryList = () => {

	const items = [
		{
			id: 1,
			name: 'Apples',
		},
		{
			id: 2,
			name: 'Bananas',
		},
		{
			id: 3,
			name: 'Oranges Oranges Oranges Oranges Oranges Oranges Oranges',
		},
		{
			id: 4,
			name: 'Carrots',
		},
	]


	return (
		<List>
			{items.map( item => (
				<GroceryListItem
					key={item.id}
					name={item.name}
				/>
			) )}
		</List>
	)
}
