const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Gets all comments
router.get('/', withAuth, (req, res) => {
    Comment.findAll({})
        .then(comments => res.json(comments))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

// Gets one comment by id
router.get('/:id', (req, res) => {
    Comment.findAll({
        where: {
            id: req.params.id
        }
    })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

// Creates a new comment
router.post('/', withAuth, async (req, res) => {
    console.log("We made it!", req.body)
    try {
        const newComment = await Comment.create({
            comments: req.body.commentText,
            post_id: req.body.postId,
            user_id: req.session.user_id
        });
        // console.log(newComment, "INSERT DATA");
        // res.status(200).json(newComment)
    } catch (err) {
        res.status(500).json(err);
    }
});

// Updates an existing comment
router.put('/:id', withAuth, (req, res) => {
    Comment.update({
        comments: req.body.comments
    },
        {
            where: {
                id: req.params.id
            }
        })
        .then(dbCommentData => {
            if (!dbCommentData) {
                res.status(404).json({ message: 'A comment with this id does not exist' });
                return
            }
            res.json(dbCommentData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Deletes a comment
router.delete('/id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.destroy({
            where: {
                id: req.params.id,
            },
        });

        if (!commentData) {
            res.status(404).json({ message: 'A comment with this id does not exist' });
            return;
        }

        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;