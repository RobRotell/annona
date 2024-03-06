import styled from '@emotion/styled'
import { Icon } from './Icon.jsx'
import { css } from '@emotion/css'
import { useContext } from 'preact/hooks'
import { AppContext } from './App.jsx'


const Bar = styled.div`
	position: sticky;
	bottom: 0;
	display: flex;
	place-items: center;
	place-content: space-between;
	width: 100%;
	background-color: var( --colorBlack );
	padding: 20px 30px;
	z-index: 10000;
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
`


export const ActionsBar = () => {
	const { authIsVisible, setAuthIsVisible } = useContext( AppContext )


	const handleShowAccount = () => setAuthIsVisible( !authIsVisible )


	return (
		<Bar>
			<ActionBtn
				onClick={handleShowAccount}
				className={css`
					&:hover path {
						fill: var( --colorGreen );
					}
				`}
			>
				<Icon name="account" css />
			</ActionBtn>
			<ActionBtn
				className={css`
					&:hover path {
						fill: var( --colorRed );
					}
				`}
			>
				<Icon name="trash" />
			</ActionBtn>
		</Bar>
	)
}
