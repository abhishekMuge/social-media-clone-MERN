const express = require('express');
const router = express.Router();

const User = require('../../models/User');
const gravatar = require('gravatar');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//require validation
const validateRegisterInput = require('../../Validator/register');
const validateLoginInput = require('../../Validator/login');

router.get('/test', (req, res) => {
	res.send('test');
});

//@route /api/users/register
//@access public
//@desc register user

router.post('/register', (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);
	if (!isValid) {
		return res.status(400).json({ errors });
	}
	User.findOne({
		Email: req.body.Email,
	}).then((user) => {
		if (user) {
			return res.status(400).json({ Email: 'Email already exist' });
		} else {
			const Avatar = gravatar.url(req.body.Email, {
				s: '200',
				r: 'pg',
				d: 'mm',
			});

			const newUser = new User({
				Name: req.body.Name,
				Email: req.body.Email,
				Avatar,
				Password: req.body.Password,
			});
			bcryptjs.genSalt(10, (err, salt) => {
				bcryptjs.hash(newUser.Password, salt, (err, hash) => {
					if (err) throw err;
					newUser.Password = hash;
					newUser
						.save()
						.then((user) => res.json(user))
						.catch((err) => console.log(err));
				});
			});
		}
	});
});

//@route /api/users/login
//@access public
//@desc register user
router.post('/login', (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body);
	if (!isValid) {
		return res.status(400).json({ errors });
	} else {
		const { Email, Password } = req.body;
		User.findOne({ Email }).then((user) => {
			if (!user) {
				errors.Email = 'user not exist';
				return res.status(404).json({errors});
			}

			bcryptjs.compare(Password, user.Password).then((isMatch) => {
				if (isMatch) {
					//password matched
					const payload = {
						id: user._id,
						Name: user.Name,
						Email: user.Email,
						Avatar: user.Avatar,
					};

					//jwt access token
					jwt.sign(
						payload,
						keys.secretOrKey,
						{ expiresIn: 3600 },
						(err, token) => {
							res.json({
								success: true,
								token: 'Bearer ' + token,
							});
						}
					);
				} else {
					errors.Password = 'password is incorrect';
					return res.status(400).json({errors});
				}
			});
		});
	}
});

//@route /api/users/currunt
//@access private
//@desc get currunt user

router.get(
	'/currunt',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		res.json({
			id: req.user.id,
			Name: req.user.Name,
			Email: req.user.Email,
			Avatar: req.user.Avatar,
		});
	}
);

module.exports = router;
