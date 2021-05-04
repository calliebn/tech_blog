const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Gets all Posts and joins with the user's data
router.get('/', withAuth, async (req, res) => {
    try {
        const newPost = await Post.findAll({
            where: {
                user_id: req.session.user_id
            },
            attributes: [
                'id',
                'title',
                'content',
                'created_at'
            ],

            include: [{
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
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
        // Serializes the data so the template can read it
        const posts = newPost.map((post) => post.get({ plain: true }));

        //Passes serialized data and session flag into template
        req.render('dashboard', {
            posts,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/edit/:id', withAuth, async, (req, res) => {
    try {
        const postData = await Post.findOne({
            where: {
                id: req.params.id
            },

            attributes: [
                'id',
                'title',
                'content',
                'created_at'
            ],

            include: [{
                model: User,
                attributes: ['username']
            },

            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }

            ]
        })
        if (!postData) {
            res.status(404).json({ message: 'A post with this id does not exist' });
            return;
        }

        const post = postData.get({ plain: true });
        res.render('edit-post', { post, logged_in: true });

    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


// Gets new posts
router.get('/new', (req, res) => {
    res.render('new-post');
});

module.exports = router;