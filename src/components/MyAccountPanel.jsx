import styled from '@emotion/styled'
import { createRef } from 'preact'
import { Creds } from '../controllers/Creds.js'
import { useContext, useEffect, useState } from 'preact/hooks'
import { AppContext } from './App.jsx'


const Container = styled.div( props => ({
	position: 'fixed',
	inset: '0',
	display: 'flex',
	width: '100%',
	height: '100%',
	placeContent: 'center',
	placeItems: 'center',
	padding: '36px 24px 86px',
	transform: props.isExpanded ? 'translateY( 0 )' : 'translateY( 100% )',
	transition: 'transform var( --transitionSpeed ) linear',
	backgroundColor: 'var( --colorWhite )',
	zIndex: 4000,
}) )

const Panel = styled.div`
	display: flex;
	flex-direction: column;
	place-content: center;
	place-items: center;
	text-align: center;
`

const Headline = styled.h2`
	margin-bottom: 48px;
	font-family: var( --fontSourceSans );
	font-weight: 700;
	font-size: 36px;
`

const Form = styled.form`
	display: flex;
	flex-direction: column;
	place-content: center;
	place-items: center;
	width: 100%;
`

const LabelGroup = styled.label`
	display: block;
	width: 100%;
	max-width: 300px;
	margin-bottom: 24px;
	text-align: left;
`

const RealLabel = styled.span`
	display: block;
	margin-bottom: 6px;
	font-weight: 700;
	font-size: 14px;
	text-transform: uppercase;
	letter-spacing: 0.1rem;
	color: var( --colorGrayLight );
`

const Input = styled.input`
	display: block;
	width: 100%;
	padding: 12px 18px;
	font-size: 20px;
	background-color: var( --colorGrayUltraLight );
	border: none;

	&:focus {
		outline: 1px solid var( --colorGrayLight );
	}
`

const BtnSubmit = styled.button`
	display: block;
	width: fit-content;
	margin-top: 20px;
	padding: 14px 30px;
	font-weight: 700;
	font-size: 20px;
	background-color: var( --colorGreen );
	border: none;
	cursor: pointer;
	-webkit-appearance: none;
	text-transform: uppercase;
	letter-spacing: 0.1rem;
	transition: background-color var( --transitionSpeed ) linear;

	&:hover {
		background-color: var( --colorGreenDark );
	}
`


export const MyAccountPanel = props => {
	const {
		myAccountIsVisible,
		setMyAccountIsVisible,
		setMessageData,
		setHasSignedIn,
	} = useContext( AppContext )

	const [ usernameInput, setUsernameInput ] = useState( '' )
	const [ passwordInput, setPasswordInput ] = useState( '' )

	// pull creds from IndexedDB (if they exist)
	useEffect( () => {
		Creds.getCreds()
			.then( creds => {
				// todo -- check if creds are valid?
				if( creds ) {
					const { username, password } = creds

					if( username && username.length && password && password.length ) {
						setUsernameInput( username )
						setPasswordInput( password )

						setHasSignedIn( true )
					}
				}
			})
	}, [] )

	const refUsername = createRef()
	const refPassword = createRef()

	const handleFormSubmit = async e => {
		e.preventDefault()

		const username = refUsername.current.value
		const password = refPassword.current.value

		const isValid = await Creds.validateCreds( username, password )

		if( !isValid ) {
			setMessageData({
				message: 'Login failed. Please try again!',
				isError: true,
				delay: 5000,
			})
		} else {
			// todo -- catch potential errors with IndexDB
			await Creds.setCreds( username, password )

			setMessageData({
				message: 'Success!'
			})

			// ensures persistent through re-rendering
			setUsernameInput( username )
			setPasswordInput( password )

			setMyAccountIsVisible( false )
			setHasSignedIn( true )
		}
	}

	return (
		<Container isExpanded={myAccountIsVisible}>
			<Panel>
				<Headline>
					My Account
				</Headline>

				<Form onSubmit={handleFormSubmit}>
					<LabelGroup for="auth_username">
						<RealLabel>Username</RealLabel>
						<Input
							id="auth_username"
							type="text"
							value={usernameInput}
							ref={refUsername}
						/>
					</LabelGroup>

					<LabelGroup for="auth_password">
						<RealLabel>Password</RealLabel>
						<Input
							id="auth_password"
							type="password"
							value={passwordInput}
							ref={refPassword}
						/>
					</LabelGroup>

					<BtnSubmit
						type="submit"
					>Save</BtnSubmit>
				</Form>
			</Panel>
		</Container>
	)
}
