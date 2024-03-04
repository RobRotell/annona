import styled from '@emotion/styled'


const ListItem = styled.div`
	position: relative;
	display: display;
	height: 56px; // match color line background
	padding: 12px 20px 12px 100px;
	font-family: var( --fontGloria );
	font-size: 28px;
	letter-spacing: 0.05rem;
	overflow: hidden;
	white-space: nowrap;
	width: 100vw;
	text-overflow: ellipsis;
`


export const GroceryListItem = props => {

	return (
		<ListItem contentEditable>
		{props.name}
		</ListItem>
	)

}
