// todo -- delete when building
import 'preact/debug'

import './styles/index.css'

import { render } from 'preact'
import { App } from './components/App.jsx'

render( <App />, document.getElementById( 'app' ) )
