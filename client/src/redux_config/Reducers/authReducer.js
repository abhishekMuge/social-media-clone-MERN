import { SET_CURRUNT_USER } from '../Actions/Types';
import isEmpty from '../../utils/is-Empty';
const initialState = {
	isAuthenticated: false,
	user: {},
};

export default function (state = initialState, action) {
	switch (action.type) {
		case SET_CURRUNT_USER:
			return {
				...state,
				isAuthenticated: !isEmpty(action.payload),
				user: action.payload,
			};
		default:
			return state;
	}
}
