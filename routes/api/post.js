const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//load post model
const Post = require('../../models/Post');
//load profile model
const Profile = require('../../models/Profile');
//load validation
const validatePostInput = require('../../Validator/post');

//@route get /api/post/test
//@access public
//@desc test route
router.get('/test', (req, res) => {
	res.send('test');
});

//@route get /api/post/
//@access public
//@desc get all post
router.get('/', (req, res) => {
	Post.find()
		.sort({ date: -1 })
		.then((post) => res.json(post))
		.catch((err) => res.status(400).json({ noPosts: ' No posts found' }));
});

//@route get /api/post/:id
//@access public
//@desc get  post by id
router.get('/:id', (req, res) => {
	Post.findById(req.params.id)
		.sort({ date: -1 })
		.then((post) => res.json(post))
		.catch((err) =>
			res.status(400).json({ noPost: ' No post found by this ID' })
		);
});

//@route Post /api/post
//@access private
//@desc post the user post
router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const { errors, isValid } = validatePostInput(req.body);
		if (!isValid) {
			return res.status(400).json({ errors });
		}
		const newPost = new Post({
			user: req.user.id,
			text: req.body.text,
			name: req.body.name,
			avatar: req.body.avatar,
		});

		newPost.save().then((post) => res.json(post));
	}
);

//@route Post /api/post/comment/:id
//@access private
//@desc add comment to  the user post
router.post(
	'/comment/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const { errors, isValid } = validatePostInput(req.body);
		if (!isValid) {
			return res.status(400).json({ errors });
		}
		Post.findById(req.params.id)
			.then((post) => {
				const newComment = {
					user: req.user.id,
					text: req.body.text,
					name: req.body.name,
					avatar: req.body.avatar,
				};

				post.comments.unshift(newComment);
				post.save().then((post) => res.json(post));
			})
			.catch((err) => {
				errors.notExists = 'Post not existed, something goes wrong';
			});
	}
);

//@route Post /api/post/comment/:id/:comment_id
//@access private
//@desc remove comment to  the user post
router.delete(
	'/comment/:id/:comment_id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Post.findById(req.params.id)
			.then((post) => {
				//check if comment exists
				if (
					post.comments.filter(
						(comment) => comment.id === req.params.comment_id
					).length === 0
				) {
					return res.status(404).json({
						commentNotExists: 'your comment not exists, something went wrong!',
					});
				}
				const removeIndex = post.comments
					.map((comment) => comment.id.toString())
					.indexOf(req.params.comment_id);
				// splice the comment
				post.comments.splice(removeIndex, 1);

				//save post
				post.save().then((post) => res.json(post));
			})
			.catch((err) => res.status(404).json({ postNotound: 'post not found' }));
	}
);

//@route delete /api/post/:id
//@access private
//@desc delete the user post
router.delete(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id })
			.then((profile) => {
				Post.findById(req.params.id)
					.then((post) => {
						if (post.user.toString() !== req.user.id) {
							return res.status(401).json({
								notAuthorized: 'user is not authorized to delete this post',
							});
						}
						post.remove().then(() => res.json({ success: true }));
					})
					.catch((err) =>
						res.status(404).json({ postNotound: 'post not found' })
					);
			})
			.catch((err) => res.sendStatus(402));
	}
);

//@route delete /api/post/like/:id
//@access private
//@desc like the user post
router.post(
	'/like/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id })
			.then((profile) => {
				Post.findById(req.params.id)
					.then((post) => {
						if (
							post.likes.filter((like) => like.user.toString() === req.user.id)
								.length > 0
						) {
							return res
								.status(400)
								.json({ alreadYExists: 'user like already exists' });
						}
						post.likes.unshift({ user: req.user.id });

						post.save().then((post) => res.json(post));
					})
					.catch((err) => {
						console.log(err);
						res.status(404).json({ postNotound: 'post not found' });
					});
			})
			.catch((err) => res.sendStatus(402));
	}
);

//@route delete /api/post/unlike/:id
//@access private
//@desc unlike the user post
router.post(
	'/unlike/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id })
			.then((profile) => {
				Post.findById(req.params.id)
					.then((post) => {
						if (
							post.likes.filter((like) => like.user.toString() === req.user.id)
								.length === 0
						) {
							return res
								.status(400)
								.json({ notExists: 'user like not exists' });
						}
						//get index
						const removeIndex = post.likes
							.map((like) => like.user.toString())
							.indexOf(req.user.id);

						//splice from array
						post.likes.splice(removeIndex, 1);

						post.save().then((post) => res.json(post));
					})
					.catch((err) => {
						console.log(err);
						res.status(404).json({ postNotound: 'post not found' });
					});
			})
			.catch((err) => res.sendStatus(402));
	}
);

module.exports = router;
