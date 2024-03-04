import styled from '@emotion/styled'
import { Icon } from './Icon.jsx'


const Panel = styled.div`
	position: sticky;
	bottom: 0;
	display: flex;
	place-items: center;
	place-content: space-between;
	width: 100%;
	background-color: var( --colorBlack );
	padding: 20px 30px;
	z-index: 2000;
`

const ActionBtn = styled.button`
	display: flex;
	place-items: center;
	place-content: center;
	width: 46px;
	height: 46px;
	color: var( --colorWhite );
	background: transparent;
	border: none;
	cursor: pointer;
	-webkit-appearance: none;

	& path {
		fill: var( --colorWhite );
		transition: fill var( --transitionSpeed ) linear;
	}

	&:hover path {
		fill: var( --colorGreen );
	}
`


export const ActionPanel = () => {
	return (
		<Panel>
			<ActionBtn>
				<Icon name="account" />
			</ActionBtn>
			<ActionBtn>
				<Icon name="trash" />
			</ActionBtn>
		</Panel>
	)
}
