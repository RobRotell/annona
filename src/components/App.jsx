import styled from '@emotion/styled'
import { ActionPanel } from './ActionPanel.jsx'
import { GroceryList } from './GroceryList.jsx'
import { AuthScreen } from './AuthScreen.jsx'
import { createContext } from 'preact'
import { useState } from 'preact/hooks'
import { MessageBanner } from './MessageBanner.jsx'


const GroceryListContainer = styled.div`
	position: relative;
	display: flex;
	flex: 1;
	padding-top: 125px;
	z-index: 1000;

	&:before,
	&:after {
		content: '';
		position: absolute;
		top: 0;
		width: 3px;
		height: 100%;
		background-color: var( --colorRed );
		z-index: -1000;
	}

	&:before {
		left: calc( var( --gutterOffset ) * 1px );
	}

	&:after {
		left: calc( calc( var( --gutterOffset ) + 5 ) * 1px );
	}
`


export const AppContext = createContext( null )


export const App = () => {

	const [ messageData, setMessageData ] = useState({
		message: '',
		isError: false,
	})

	const [ authIsVisible, setAuthIsVisible ] = useState( false )


	const providerData = {
		messageData,
		setMessageData,
		authIsVisible,
		setAuthIsVisible,
	}

	return (
		<AppContext.Provider value={providerData}>
			<GroceryListContainer>
				<GroceryList />
			</GroceryListContainer>
			<>
				<ActionPanel />
				<AuthScreen />
				<MessageBanner />
			</>
		</AppContext.Provider>
	)
}
