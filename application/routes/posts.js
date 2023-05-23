const { magenta } = require('colors');
var express = require('express');
var router = express.Router();
var multer = require('multer');
var db = require('../conf/database');
const { isLoggedIn, isMyProfile } = require("../middleware/auth");
const { makeThumbnail, getCommetsForPostById, getCommentsForPostById } = require('../middleware/posts');
const { getPostById } = require('../middleware/posts');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/videos/uploads");
    },
    filename: function (req, file, cb) {
        var fileExt = file.mimetype.split("/")[1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`);
    },
});

const upload = multer({ storage: storage });

router.post(
    "/create",
    isLoggedIn,
    upload.single("uploadVideo"),
    makeThumbnail,

    async function (req, res, next) {
      

        var { title, description } = req.body;
        var { path, thumbnail } = req.file;
        var { userID } = req.session.user;

       
        try {
            var [insertResult, _] = await db.execute(
                `INSERT INTO posts (title, description, video, thumbnail,fk_userID)
                value (?,?,?,?,?);`, [title, description, path, thumbnail, userID]
            );
            if (insertResult && insertResult.affectedRows) {
                req.flash("success", "Your post was created!");
                // window.location.reload();
                return req.session.save(function (error) {
                    if (error) next(error);
                    return res.redirect(`/`);
                })

            } else {
                next(new Error('Post could not be created'));
            }

        } catch (error) {
            next(error);
        }


    });

router.get('/:id(\\d+)', getPostById, getCommentsForPostById, function (req, res) {
    res.render('viewpost', { title: `ViewPost ${req.params.id}`, css: ["style.css"] });
},);

router.get('/delete/:id(\\d+)', isLoggedIn, async function (req, res, next) {
    // var result = confirm('Do you want to delete?');

    // if (!result) return;
    var userID = req.session.user.userID;

    var itemId = req.params.id;
    try {
        var [insertResult, _] = await db.execute(
            `DELETE FROM comments WHERE fk_postId=?`, [itemId]
        );

        var [insertResult, _] = await db.execute(
            `DELETE FROM posts WHERE id=?`, [itemId],
        );

        if (insertResult && insertResult.affectedRows) {
            req.flash("success", "Your post was deleted!");
            // window.location.reload();
            return req.session.save(function (error) {
                if (error) next(error);
                return res.redirect(`/users/profile/${userID}`);
            })

        } else {
            next(new Error('Post could not be deleted'));
        }

    } catch (error) {
        next(error);
    }
},);

router.get("/search", async function (req, res, next) {
    var { searchValue } = req.query;
    try {
        var [rows, _] = await db.execute(
            `SELECT id,title, thumbnail, concat_ws(' ', title, description) as haystack
            from posts
            having haystack like ?;`,
            [`%${searchValue}%`]
        );

        if (rows && rows.length == 0) {
            res.redirect('/');

        } else {
            res.locals.posts = rows;
            res.render('index');
        }
    } catch (error) {
        next(error);
    }
});


module.exports = router;