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
		authIsVisible,
		setAuthIsVisible,
		setMessageData
	} = useContext( AppContext )

	const [ usernameInput, setUsernameInput ] = useState( '' )
	const [ passwordInput, setPasswordInput ] = useState( '' )

	useEffect( () => {
		Creds.getCreds()
			.then( creds => {
				if( creds ) {
					const { username, password } = creds

					if( username ) {
						setUsernameInput( username )
					}

					if( password ) {
						setPasswordInput( password )
					}
				}
			})
	}, [] )


	const refUsername = createRef()
	const refPassword = createRef()

	const handleFormSubmit = e => {
		e.preventDefault()

		const username = refUsername.current.value
		const password = refPassword.current.value

		Creds.setCreds( username, password)
			.then( () => {
				setMessageData({
					message: 'Success!',
					isError: false,
				})

				// hide auth screen once done
				setAuthIsVisible( false )

			}).catch( err => {
				setMessageData({
					message: err,
					isError: true,
				})
			})
	}

	return (
		<Container isExpanded={authIsVisible}>
			<Panel>
				<Headline>
					Enter your credentials below:
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
