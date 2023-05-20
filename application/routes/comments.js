var express = require('express');
const { isLoggedIn } = require('../middleware/auth');
var db = require('../conf/database');
var router = express.Router();

router.post('/create', isLoggedIn, async function (req, res, next) {
    // console.log(req.body);
    var { userID, username } = req.session.user;
    var { postId, comment } = req.body;

    try {
        var [insertResult, _] = await db.execute(
            `INSERT INTO comments (comment, fk_postId,
            fk_authorId) VALUE (?,?,?)`, [comment, postId, userID]
        );

        if (insertResult && insertResult.affectedRows == 1) {
            return res.status(201).json({
                commentId: insertResult.insertId,
                username: username,
                commentText: comment,
            });
        } else {

        }
    } catch (error) {
        next(error);
    }

})



module.exports = router;