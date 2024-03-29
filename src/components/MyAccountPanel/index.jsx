import style from './style.module.css'

import { createRef } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

import { Creds } from '../../controllers/Creds.js'

import { AppContext } from '../App'


export const MyAccountPanel = props => {
	const {
		myAccountIsVisible,
		setMyAccountIsVisible,
		setMessageData,
		hasSignedIn,
		setHasSignedIn,
	} = useContext( AppContext )

	const [ usernameInput, setUsernameInput ] = useState( '' )
	const [ passwordInput, setPasswordInput ] = useState( '' )

	// pull creds from IndexedDB (if they exist)
	useEffect( () => {
		const maybeSetCreds = async () => {
			const creds = await Creds.getCreds()

			if( !creds ) {
				return
			}

			const { username = '', password = '' } = creds

			const validated = await Creds.validateCreds( username, password )

			if( validated ) {
				setUsernameInput( username )
				setPasswordInput( password )

				setHasSignedIn( true )
			}
		}

		maybeSetCreds()

	}, [] )

	const refUsername = createRef()
	const refPassword = createRef()

	const handleFormSubmit = async e => {
		e.preventDefault()

		const username = refUsername.current.value
		const password = refPassword.current.value

		const validated = await Creds.validateCreds( username, password )

		if( !validated ) {
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
		<div class={ `${style.container} ${myAccountIsVisible ? style.isExpanded : ''}` }>
			<div class={style.panel}>
				<h2 class={style.headline}>
					My Account
				</h2>

				<form class={style.form} onSubmit={handleFormSubmit}>
					<label className={style.labelGroup} for="auth_username">
						<span class={style.realLabel}>Username</span>
						<input
							id="auth_username"
							type="text"
							class={style.input}
							value={usernameInput}
							ref={refUsername}
						/>
					</label>

					<label className={style.labelGroup} for="auth_password">
						<span class={style.realLabel}>Password</span>
						<input
							id="auth_password"
							type="password"
							class={style.input}
							value={passwordInput}
							ref={refPassword}
						/>
					</label>

					<button
						class={style.btnSubmit}
						type="submit"
					>Save</button>
				</form>
			</div>
		</div>
	)
}
