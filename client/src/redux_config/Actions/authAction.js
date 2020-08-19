import axios from 'axios';
import { GET_ERRORS, SET_CURRUNT_USER } from './Types';
import jwtDecode from 'jwt-decode';
import setAuthToken from '../../utils/setAuthToken';
export const registerUser = (userData, history) => (dispatch) => {
	axios
		.post('/api/users/register', userData)
		.then((res) => history.push('/login'))
		.catch((err) => {
			if (err.response.data.errors != null) {
				dispatch({
					type: GET_ERRORS,
					payload: err.response.data.errors,
				});
			} else {
				dispatch({
					type: GET_ERRORS,
					payload: null,
				});
			}
		});
};

export const loginUser = (userData) => (dispatch) => {
	axios
		.post('/api/users/login', userData)
		.then((res) => {
			const { token } = res.data;
			//set to localstorage
			localStorage.setItem('jwtToken', token);
			//set auth token to header
			setAuthToken(token);
			const decode = jwtDecode(token);
			//set currunt user
			dispatch(setCurruntUser(decode));
		})
		.catch((err) => {
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data.errors,
			});
		});
};

export const setCurruntUser = (decode) => {
	return {
		type: SET_CURRUNT_USER,
		payload: decode,
	};
};

export const logoutCurruntUser = () => (dispatch) => {
	localStorage.removeItem('jwtToken');
	setAuthToken(false);
	dispatch(setCurruntUser({}));
};
