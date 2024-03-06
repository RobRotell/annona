import styled from '@emotion/styled'
import { ActionsBar } from './ActionsBar.jsx'
import { GroceryList } from './GroceryList.jsx'
import { MyAccountPanel } from './MyAccountPanel.jsx'
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

	// used for message banner at bottom of screen
	const [ messageData, setMessageData ] = useState({
		message: '',
		isError: false,
		delay: 3000,
	})

	// used for "My Account" flyout panel
	const [ authIsVisible, setAuthIsVisible ] = useState( false )

	// used for detecting when a user has signed in
	const [ hasSignedIn, setHasSignedIn ] = useState( 0 )


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
				<ActionsBar />
				<MyAccountPanel />
				<MessageBanner />
			</>
		</AppContext.Provider>
	)
}
