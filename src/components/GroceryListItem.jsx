import styled from '@emotion/styled'
import { Icon } from './Icon.jsx'


const Row = styled.div`
	display: flex;
`


const Checkbox = styled.button`
	display: flex;
	place-content: center;
	place-items: center;
	width: 65px;
	height: 100%;
	cursor: pointer;
	opacity: 0;
	transition: var( --transitionSpeed ) linear;
	background: transparent;
	border: none;
	-webkit-appearance: none;

	&:hover {
		opacity: 1;
	}
`


const ListItem = styled.div`
	position: relative;
	flex: 1;
	width: calc( 100vw - 95px );
	height: 56px; // match color line background
	margin-left: 30px;
	padding: 12px 20px 12px 0;
	font-family: var( --fontGloria );
	font-size: 28px;
	letter-spacing: 0.05rem;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`


export const GroceryListItem = props => {

	return (
		<Row>
			<Checkbox>
				<Icon
					name="checkmark"
					color="var( --colorBlack )"
				/>
			</Checkbox>
			<ListItem contentEditable>
				{props.name}
			</ListItem>
		</Row>
	)

}
