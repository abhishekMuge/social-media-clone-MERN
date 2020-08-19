import React from 'react';
import './App.css';
import setAuthToken from './utils/setAuthToken';
import {
	setCurruntUser,
	logoutCurruntUser,
} from './redux_config/Actions/authAction';
//loaded dependencies
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux_config';
import jwtDecode from 'jwt-decode';
//loaded components
import Navbar from './Components/Layout/Navbar';
import Footer from './Components/Layout/Footer';
import Landing from './Components/Layout/Landing';
import Register from './Components/Auth/Register';
import Login from './Components/Auth/Login';

//check if user auth token is avalible
if (localStorage.jwtToken) {
	setAuthToken(localStorage.jwtToken);
	const decoded = jwtDecode(localStorage.jwtToken);
	store.dispatch(setCurruntUser(decoded));

	const curruntTime = Date.now() / 1000;
	if (decoded.exp < curruntTime) {
		store.dispatch(logoutCurruntUser());
		window.location.href = '/login';
	}
}

function App() {
	return (
		<Provider store={store}>
			<div className='App'>
				<Router>
					<Navbar />
					<Route path='/' exact component={Landing} />
					<div className='container'>
						<Route path='/register' exact component={Register} />
						<Route path='/login' exact component={Login} />
					</div>
					<Footer />
				</Router>
			</div>
		</Provider>
	);
}

export default App;
