import { useContext, useEffect, useState } from 'preact/hooks'
import { AppContext } from './App.jsx'
import styled from '@emotion/styled'


// todo -- combine with MsgSuccess into one component
const Banner = styled.div( props => ({
	position: 'fixed',
	inset: 'auto 0 86px 0',
	display: 'block',
	padding: '16px 32px',
	fontWeight: '700',
	fontSize: '24px',
	textAlign: 'center',
	letterSpacing: '0.1rem',
	color: props.isError ? 'var( --colorWhite )' : 'var( --colorBlack )',
	textTransform: 'uppercase',
	backgroundColor: props.isError ? 'var( --colorRed )' : 'var( --colorGreen )',
	transition: 'transform var( --transitionSpeed ) linear',
	transform: props.isVisible ? 'translateY( 0 )' : 'translateY( 100% )',
	zIndex: '8000',
}) )


export const MessageBanner = props => {
	const { messageData: data, setMessageData } = useContext( AppContext )
	const [ isVisible, setIsVisible ] = useState( false )

	useEffect( () => {
		if( '' === data.message ) {
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
						isError: false,
					})
				}, 1000 )
			}, 2000 )
		}
	}, [ data.message ] )

	return (
		<Banner isVisible={isVisible} isError={data.isError}>
			{data.message}
		</Banner>
	)
}
