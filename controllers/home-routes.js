const router = require('express').Router();
const { Post, User, Comment } = require('../models');

router.get('/', async (req, res) => {
    try {
        const newPost = await Post.findAll({
            attributes: [
                'id',
                'title',
                'content',
                'created_at'
            ],
            include: [{
                model: Comment,
                attributes: ['id', 'comments', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }

            ]
        })

        const posts = newPost.map((post) => post.get({ plain: true }));

        res.render('home', {
            posts,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/post/:id', async (req, res) => {
    try {
        const onePost = await Post.findOne({
            where: {
                id: req.params.id
            },

            attributes: [
                'id',
                'content',
                'title',
                'created_at'
            ],

            include: [{
                model: Comment,
                attributes: ['id', 'comments', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }]
        })

        if (!onePost) {
            res.status(404).json({ message: 'A post with this id does not exist' });
            return;
        }

        const post = onePost.get({ plain: true });
        res.render('single-post', { post, logged_in: true });

    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/posts-comments', async (req, res) => {
    try {
        const postComments = await Post.findOne({
            where: {
                id: req.params.id
            },

            attributes: [
                'id',
                'content',
                'title',
                'created_at'
            ],

            include: [{
                model: Comment,
                attributes: ['id', 'comments', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }]
        })
        if (!postComments) {
            res.status(404).json({ message: 'A post with this id does not exist' });
            return;
        }

        const post = postComments.get({ plain: true });
        res.render('post-comments', { post, logged_in: req.session.logged_in });

    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;