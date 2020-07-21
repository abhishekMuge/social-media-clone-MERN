const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');

//load profile and user models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//get validation
const validateProfileField = require('../../Validator/profile');
const validateExprienceField = require('../../Validator/exprience');
const validateEducationField = require('../../Validator/education');
const profile = require('../../Validator/profile');

//@route /api/profile
//@access prvate
//@desc get the currunt user
router.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const errors = {};

		Profile.findOne({ id: req.user.id })
			.then((profile) => {
				if (!profile) {
					errors.noProfile = 'profile is not avaliable for this user';
					return res.status(404).json(errors);
				}
				res.json(profile);
			})
			.catch((err) => res.json(err));
	}
);

//@route GET /api/profile/handle/:handle
//@access public
//@desc get user by handle
router.get('/handle/:handle', (req, res) => {
	Profile.findOne({ handle: req.params.handle })
		.populate('user', ['Name', 'Avatar'])
		.then((profile) => {
			var errors = {};
			if (!profile) {
				errors.noProfile = 'Profile not exists with that handle';
				return res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch((err) => res.status(404).json(err));
});

//@route GET /api/profile/all
//@access public
//@desc get all profile
router.get('/all', (req, res) => {
	Profile.findOne()
		.populate('user', ['Name', 'Avatar'])
		.then((profile) => {
			var errors = {};
			if (!profile) {
				errors.noProfile = 'Profile not exists with that handle';
				return res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch((err) => res.status(404).json({ profile: 'there is o profiles' }));
});

//@route GET /api/profile/user/:user_id
//@access public
//@desc get user by handle
router.get('/user/:user_id', (req, res) => {
	Profile.findOne({ user: req.params.user_id })
		.populate('user', ['Name', 'Avatar'])
		.then((profile) => {
			var errors = {};
			if (!profile) {
				errors.noProfile = 'Profile not exists with that handle';
				return res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch((err) => res.status(404).json(err));
});

//@route POST /api/profile
//@access prvate
//@desc create the currunt user
router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const { isValid, errors } = validateProfileField(req.body);
		if (!isValid) {
			//send errors
			return res.status(400).json(errors);
		}
		//create profileField
		const profileField = {};
		profileField.user = req.user.id;
		if (req.body.handle) profileField.handle = req.body.handle;
		if (req.body.company) profileField.company = req.body.company;
		if (req.body.website) profileField.website = req.body.website;
		if (req.body.location) profileField.location = req.body.location;
		if (req.body.status) profileField.status = req.body.status;
		//set skills into array form;
		if (typeof req.body.skills !== 'undedined') {
			profileField.skills = req.body.skills.split(',');
		}
		if (req.body.githubUserName)
			profileField.githubUserName = req.body.githubUserName;
		if (req.body.bio) profileField.bio = req.body.bio;
		//put socialmedia handle
		profileField.social = {};
		if (req.body.youtube) profileField.social.youtube = req.body.youtube;
		if (req.body.twitter) profileField.social.twitter = req.body.twitter;
		if (req.body.facebook) profileField.social.facebook = req.body.facebook;
		if (req.body.linkedin) profileField.social.linkedin = req.body.linkedin;
		if (req.body.instagram) profileField.social.instagram = req.body.instagram;

		//check profile exists or not
		Profile.findOne({ user: req.user.id })
			.populate('user', ['Name', 'Avatar'])
			.then((profile) => {
				if (profile) {
					//update
					Profile.findOneAndUpdate(
						{ user: req.user.id },
						{ $set: profileField },
						{ new: true }
					).then((profile) => {
						return res.json({
							profile,
							owner: { Name: req.user.Name, Avatar: req.user.Avatar },
						});
					});
				} else {
					//create
					//check if handle exists or not
					Profile.findOne({ handle: profileField.handle }).then((profile) => {
						if (profile) {
							errors.handle = 'handle is already exists';
							return res.status(400).json(errors);
						} else {
							//else save profileField as new profile
							new Profile(profileField).save().then((profile) =>
								res.json({
									profile,
									owner: { Name: req.user.Name, Avatar: req.user.Avatar },
								})
							);
						}
					});
				}
			});
	}
);
//@route POST /api/profile/experience
//@access private
//@desc add exprience to currunt user
router.post(
	'/experience',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const { isValid, errors } = validateExprienceField(req.body);
		if (!isValid) {
			//send errors
			return res.status(400).json(errors);
		}

		Profile.findOne({ user: req.user.id }).then((profile) => {
			const newExp = {
				title: req.body.title,
				company: req.body.company,
				location: req.body.location,
				from: req.body.from,
				to: req.body.to,
				currunt: req.body.currunt,
				description: req.body.description,
			};
			profile.exprience.unshift(newExp);
			profile.save().then((profile) =>
				res.json({
					profile,
					owner: { Name: req.user.Name, Avatar: req.user.Avatar },
				})
			);
		});
	}
);

//@route POST /api/profile/education
//@access private
//@desc add education to currunt user
router.post(
	'/education',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const { isValid, errors } = validateEducationField(req.body);
		if (!isValid) {
			//send errors
			return res.status(400).json(errors);
		}

		Profile.findOne({ user: req.user.id }).then((profile) => {
			const newExp = {
				school: req.body.school,
				degree: req.body.degree,
				fieldOfStudy: req.body.fieldOfStudy,
				from: req.body.from,
				to: req.body.to,
				currunt: req.body.currunt,
				description: req.body.description,
			};
			profile.education.unshift(newExp);
			profile.save().then((profile) =>
				res.json({
					profile,
					owner: { Name: req.user.Name, Avatar: req.user.Avatar },
				})
			);
		});
	}
);

//@route DELETE /api/profile/experience/:exp_id
//@access private
//@desc delete exprience from currunt user
router.delete(
	'/experience/:exp_id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then((profile) => {
			//get remove index
			const removeIndex = profile.exprience
				.map((item) => item.id)
				.indexOf(req.params.exp_id);
			//splice from array
			profile.exprience.splice(removeIndex, 1);
			//save updated profile
			profile
				.save()
				.then((profile) =>
					res.json({
						profile,
						owner: { Name: req.user.Name, Avatar: req.user.Avatar },
					})
				)
				.catch((err) => res.status(404).json(err));
		});
	}
);

//@route DELETE /api/profile/education/:exp_id
//@access private
//@desc delete education from currunt user
router.delete(
	'/education/:exp_id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then((profile) => {
			//get remove index
			const removeIndex = profile.education
				.map((item) => item.id)
				.indexOf(req.params.exp_id);
			//splice from array
			profile.education.splice(removeIndex, 1);
			//save updated profile
			profile
				.save()
				.then((profile) =>
					res.json({
						profile,
						owner: { Name: req.user.Name, Avatar: req.user.Avatar },
					})
				)
				.catch((err) => res.status(404).json(err));
		});
	}
);

//@route DELETE /api/profile
//@access private
//@desc delete currunt user and profile
router.delete(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Profile.findOneAndRemove({ user: req.user.id }).then(() => {
			User.findOneAndRemove({ _id: req.user.id }).then(() =>
				res.json({ success: true })
			);
		});
	}
);
module.exports = router;
