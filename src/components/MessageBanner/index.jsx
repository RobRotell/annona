import style from './style.module.css'

import { useContext, useEffect, useState } from 'preact/hooks'

import { AppContext } from '../App'


export const MessageBanner = props => {
	const { messageData, setMessageData } = useContext( AppContext )
	const [ isVisible, setIsVisible ] = useState( false )

	let { message = '' } = messageData
	const { delay = 5000, isError = false } = messageData

	// support for actual error objects
	if( 'string' !== typeof message && message.message ) {
		message = message.message
	}

	useEffect( () => {
		if( '' === message ) {
			setIsVisible( false )
		} else {
			setIsVisible( true )

			// show message for three seconds
			setTimeout( () => {
				setIsVisible( false )

				// setting delay prevents janky transition
				setTimeout( () => {
					setMessageData({
						message: '',
					})
				}, 1000 )
			}, delay )
		}
	}, [ message ] )

	return (
		<div class={ `${style.banner} ${isVisible ? style.isVisible : ''} ${isError ? style.isError : '' }` }>
			{message}
		</div>
	)
}
