import style from './style.module.css'

import { Icon } from '../Icon'


export const GroceryListItem = props => {

	return (
		<div class={style.row}>
			<button class={style.checkbox}>
				<Icon
					name="checkmark"
					color="var( --colorBlack )"
				/>
			</button>
			<div
				class={style.listItem}
				contentEditable
			>
				{props.name}
			</div>
		</div>
	)

}
