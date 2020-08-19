import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginUser } from './../../redux_config/Actions/authAction';
import propTypes from 'prop-types';
import classname from 'classnames';
class Login extends Component {
	constructor() {
		super();
		this.state = {
			Email: '',
			Password: '',
			errors: {},
		};
	}

	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.props.history.push('/dashboard');
		}
	}

	UNSAFE_componentWillReceiveProps(nextProp) {
		if (nextProp.auth.isAuthenticated) {
			this.props.history.push('/dashboard');
		}
		if (nextProp.errors) {
			this.setState({ errors: nextProp.errors });
		}
	}
	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	handleSubmit = (event) => {
		event.preventDefault();
		const { Email, Password } = this.state;
		const userData = {
			Email,
			Password,
		};
		this.props.loginUser(userData);
	};

	render() {
		const { errors } = this.state;
		return (
			<div className='login'>
				<div className='container'>
					<div className='row'>
						<div className='col-md-8 m-auto'>
							<h1 className='display-4 text-center'>Log In</h1>
							<p className='lead text-center'>
								Sign in to your DevConnector account
							</p>
							<form onSubmit={this.handleSubmit}>
								<div className='form-group mt-2'>
									<input
										type='email'
										className={classname('form-control form-control-lg', {
											'is-invalid': errors.Email,
										})}
										placeholder='Email Address'
										name='Email'
										value={this.state.Email}
										onChange={this.handleChange}
									/>
									{errors.Email && (
										<div className='invalid-feedback'>{errors.Email}</div>
									)}
								</div>
								<div className='form-group mt-2'>
									<input
										type='password'
										className={classname('form-control form-control-lg', {
											'is-invalid': errors.Password,
										})}
										placeholder='Password'
										name='Password'
										value={this.state.Password}
										onChange={this.handleChange}
									/>
									{errors.Password && (
										<div className='invalid-feedback'>{errors.Password}</div>
									)}
								</div>
								<input type='submit' className='btn btn-info btn-block mt-4' />
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Login.propTypes = {
	loginUser: propTypes.func.isRequired,
	auth: propTypes.object.isRequired,
	errors: propTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors,
});

export default connect(mapStateToProps, { loginUser })(Login);
