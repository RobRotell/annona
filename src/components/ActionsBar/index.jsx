import style from './style.module.css'

import { useContext } from 'preact/hooks'

import { AppContext } from '../App'
import { Icon } from '../Icon'


export const ActionsBar = () => {
	const { myAccountIsVisible, setMyAccountIsVisible } = useContext( AppContext )

	const handleShowAccount = () => setMyAccountIsVisible( !myAccountIsVisible )

	return (
		<div class={style.bar}>
			<button
				class={`${style.button} ${style.buttonGreen}`}
				onClick={handleShowAccount}
			>
				<Icon
					name="account"
					color="var( --colorWhite )"
				/>
			</button>
			<button
				class={`${style.button} ${style.buttonRed}`}
			>
				<Icon
					name="trash"
					color="var( --colorWhite )"
				/>
			</button>
		</div>
	)
}
