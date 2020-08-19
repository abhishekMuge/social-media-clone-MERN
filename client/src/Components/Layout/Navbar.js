import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutCurruntUser } from './../../redux_config/Actions/authAction';
class Navbar extends Component {
	logoutUser = (e) => {
		e.preventDefault();
		this.props.logoutCurruntUser();
	};

	render() {
		const { isAuthenticated, user } = this.props.auth;

		const authLinks = (
			<ul className='navbar-nav ml-auto'>
				<li className='nav-item'>
					<a
						className='nav-link'
						onClick={this.logoutUser}
						style={{ cursor: 'pointer' }}
						href='/#'>
						<img
							src={user.Avatar}
							alt={user.Email}
							style={{ width: '25px', marginRight: '5px' }}
							className='rounded-circle'
						/>
						Logout
					</a>
				</li>
			</ul>
		);
		const guestLinks = (
			<ul className='navbar-nav ml-auto'>
				<li className='nav-item'>
					<Link className='nav-link' to='/register'>
						Sign Up
					</Link>
				</li>
				<li className='nav-item'>
					<Link className='nav-link' to='/login'>
						Login
					</Link>
				</li>
			</ul>
		);
		return (
			<nav className='navbar navbar-expand-sm navbar-dark bg-dark mb-4'>
				<div className='container'>
					<Link className='navbar-brand' to='/'>
						DevConnector
					</Link>
					<button
						className='navbar-toggler'
						type='button'
						data-toggle='collapse'
						data-target='#mobile-nav'>
						<span className='navbar-toggler-icon' />
					</button>
					<div className='collapse navbar-collapse' id='mobile-nav'>
						<ul className='navbar-nav'>
							<li className='nav-item'>
								<Link className='nav-link' to='/profiles'>
									{' '}
									Devlopers
								</Link>
							</li>
						</ul>
						{isAuthenticated ? authLinks : guestLinks}
					</div>
				</div>
			</nav>
		);
	}
}

Navbar.propTypes = {
	logoutCurruntUser: propTypes.func.isRequired,
	auth: propTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { logoutCurruntUser })(Navbar);
