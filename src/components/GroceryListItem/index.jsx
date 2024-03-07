import { createRef } from 'preact'
import { AppContext } from '../App/index.jsx'
import style from './style.module.css'

import { useContext, useEffect, useState } from 'preact/hooks'
import { Grocer } from '../../controllers/Grocer.js'


export const GroceryListItem = props => {
	const { value, isBlank = false } = props

	const {
		listItems,
		setListItems,
		messageData,
		setMessageData,
	} = useContext( AppContext )

	const [ isChecked, setIsChecked ] = useState( false )

	const inputNode = createRef()

	// update visual state of item as it's checked/unchecked
	const handleCheckedClick = () => {
		setIsChecked( !isChecked )

		// todo -- best way to do this?
		listItems.forEach( item => {
			if( item.id === props.id ) {
				item.isChecked = !isChecked
			}
		})
	}

	// add or update item when user leaves input field
	const handleOnBlur = () => {
		const itemValue = inputNode.current.value

		// adding new item
		if( isBlank ) {
			if( itemValue.length ) {

				// todo -- what if new item was already added?
				Grocer
					.addItem( itemValue )
					.then( id => {
						setMessageData({
							message: `"${itemValue}" added!`
						})

						listItems.push({
							id,
							name: itemValue,
							isChecked: false,
						})

						// reset blank value for blank item
						inputNode.current.value = ''

						setListItems( listItems )

					}).catch( err => {
						setMessageData({
							message: err,
							isError: true,
							delay: 5000,
						})
					})
			}

		// updating preexisting item
		} else {
			if( value !== inputNode.current.value ) {
				console.log( 'update item' )
			}
		}
	}


	return (
		<div class={` ${style.row} ${isChecked ? style.isChecked : ''}`}>

			{ !isBlank ? (
				<button
					class={`${style.checkbox} ${isChecked ? style.checkboxChecked : ''} `}
					onClick={handleCheckedClick}
				>
					<span className={style.checkboxOutline}>
						<span className={style.checkboxFill}></span>
					</span>
				</button>
			) : ( <></> ) }

			<div className={`${style.listItem} ${isBlank ? style.listItemBlank : ''} `}>

				{ !isBlank ? (
					<div className={style.strikethrough}>
						{0 === props.index % 2 ? (
							<svg className={style.strikethroughSvg} width="235" height="6" viewBox="0 0 235 6" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path className={style.strikethroughSvgLine} d="M0 1L235 1.94118L9.03846 2.88235L225.459 3.35294L4.01709 5L158.173 5" stroke="black"/>
							</svg>
						) : (
							<svg className={style.strikethroughSvg} width="235" height="6" viewBox="0 0 235 6" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path className={style.strikethroughSvgLine} d="M235 5.00001L-6.83186e-06 4.05881L225.962 3.11765L9.54059 2.64705L230.983 1.00001L76.8269 0.999994" stroke="black"/>
							</svg>
						)}
					</div>
				) : ( <></> ) }

				<input
					ref={inputNode}
					class={style.itemInput}
					value={value}
					onBlur={handleOnBlur}
				/>
			</div>
		</div>
	)

}
