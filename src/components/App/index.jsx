import style from './style.module.css'

import { createContext } from 'preact'
import { useState } from 'preact/hooks'

import { ActionsBar } from '../ActionsBar'
import { GroceryList } from '../GroceryList'
import { MessageBanner } from '../MessageBanner'
import { MyAccountPanel } from '../MyAccountPanel'


export const AppContext = createContext( null )


export const App = () => {

	// used for message banner at bottom of screen
	const [ messageData, setMessageData ] = useState({
		message: '',
		isError: false,
		delay: 3000,
	})

	// used for expanding/collapsing "My Account" flyout panel
	const [ myAccountIsVisible, setMyAccountIsVisible ] = useState( false )

	// used for detecting when a user has signed in
	const [ hasSignedIn, setHasSignedIn ] = useState( false )

	// used for organizing grocery items
	const [ listItems, setListItems ] = useState( [] )

	const providerData = {
		messageData,
		setMessageData,
		myAccountIsVisible,
		setMyAccountIsVisible,
		hasSignedIn,
		setHasSignedIn,
		listItems,
		setListItems,
	}

	return (
		<AppContext.Provider value={providerData}>
			<main class={style.container}>
				<GroceryList />
			</main>

			<MessageBanner />
			<ActionsBar />
			<MyAccountPanel />
		</AppContext.Provider>
	)
}
