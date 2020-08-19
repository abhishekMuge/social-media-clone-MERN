import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { registerUser } from '../../redux_config/Actions/authAction';
import propTypes from 'prop-types';
import classname from 'classnames';
class Register extends Component {
	constructor() {
		super();
		this.state = {
			name: '',
			email: '',
			password: '',
			password2: '',
			errors: {},
		};
	}
	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.props.history.push('/dashboard');
		}
	}
	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.errors) {
			this.setState({ errors: nextProps.errors });
		}
	}

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};
	handleSubmit = (event) => {
		event.preventDefault();
		const { name, email, password, password2 } = this.state;
		const newUser = {
			Name: name,
			Email: email,
			Password: password,
			Password2: password2,
		};
		this.props.registerUser(newUser, this.props.history);
	};
	render() {
		const { errors } = this.state;
		return (
			<div>
				<div className='register'>
					<div className='container'>
						<div className='row'>
							<div className='col-md-8 m-auto'>
								<h1 className='display-4 text-center'>Sign Up</h1>
								<p className='lead text-center'>
									Create your DevConnector account
								</p>
								<form
									onSubmit={this.handleSubmit}
									className='needs-validation'
									noValidate>
									<div className='form-group mt-2'>
										<input
											type='text'
											className={classname('form-control form-control-lg', {
												'is-invalid': errors.Name,
											})}
											placeholder='Name'
											name='name'
											value={this.state.name}
											onChange={this.handleChange}
										/>
										{errors.Name && (
											<div className='invalid-feedback'>{errors.Name}</div>
										)}
									</div>
									<div className='form-group mt-2'>
										<input
											type='email'
											className={classname('form-control form-control-lg', {
												'is-invalid': errors.Email,
											})}
											placeholder='Email Address'
											name='email'
											value={this.state.email}
											onChange={this.handleChange}
										/>
										{errors.Email && (
											<div className='invalid-feedback'>{errors.Email}</div>
										)}
										<small className='form-text text-muted'>
											This site uses Gravatar so if you want a profile image,
											use a Gravatar email
										</small>
									</div>
									<div className='form-group mt-2'>
										<input
											type='password'
											className={classname('form-control form-control-lg', {
												'is-invalid': errors.Password,
											})}
											placeholder='Password'
											name='password'
											value={this.state.password}
											onChange={this.handleChange}
										/>
										{errors.Password && (
											<div className='invalid-feedback'>{errors.Password}</div>
										)}
									</div>
									<div className='form-group mt-2'>
										<input
											type='password'
											className={classname('form-control form-control-lg', {
												'is-invalid': errors.Password2,
											})}
											placeholder='Confirm Password'
											name='password2'
											value={this.state.password2}
											onChange={this.handleChange}
										/>
										{errors.Password2 && (
											<div className='invalid-feedback'>{errors.Password2}</div>
										)}
									</div>
									<input
										type='submit'
										className='btn btn-info btn-block mt-4'
									/>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProsp = (state) => ({
	auth: state.auth,
	errors: state.errors,
});

Register.propTypes = {
	registerUser: propTypes.func.isRequired,
	auth: propTypes.object.isRequired,
	errors: propTypes.object.isRequired,
};

export default connect(mapStateToProsp, { registerUser })(withRouter(Register));
