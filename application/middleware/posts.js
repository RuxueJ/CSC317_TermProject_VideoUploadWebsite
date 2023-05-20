var pathToFFMPEG = require('ffmpeg-static');
var exec = require('child_process').exec;
var db = require('../conf/database');

module.exports = {
    makeThumbnail: function (req, res, next) {
        if (!req.file) {
            next(new Error('File upload failed'));
        } else {
            try {
                var destinationOfThumbnail = `public/images/uploads/thumbnail-${req.file.filename.split(".")[0]}.png`;
                var thumbnailCommand = `${pathToFFMPEG} -ss 00:00:01 -i ${req.file.path} -y -s 200x200 -vframes 1 -f image2 ${destinationOfThumbnail} `;
                exec(thumbnailCommand);
                req.file.thumbnail = destinationOfThumbnail;
                next();
            } catch (error) {
                next(error);
            }

        }

    },

    // getPostsForUserBy: gets all post a user made for their profile
    getPostsForUserBy: async function (req, res, next) {
        var { userID } = req.session.user;
        try {
            var [rows, fields] = await db.execute(
                `SELECT * from  posts where fk_userID =(?);`, [userID]
            );
            // console.log(rows[2]);
            // rows.forEach((row) => {
            //     console.log(row.title);
            //     console.log(row.video);
            // })
            res.locals.videos = rows;
            next();
        } catch (error) {
            next(error);
        }

    },

    // getPostById:gets post information for a post given a postId(for viewpost)
    getPostById: async function (req, res, next) {
        // console.log(req.body);
        // console.log(req.session.user);
        // console.log(req.params.id);
        // console.log(req.session.currentPost);
        var { id } = req.params;
        try {
            var [rows, fields] = await db.execute(
                `SELECT u.username, p.video, p.title, p.description, p.id, p.createAt
                FROM posts p
                JOIN users u
                on p.fk_userID=u.id
                WHERE p.id=?;`, [id]
            );

            const post = rows[0];
            if (!post) {
                req.flash("error", "id is not existed");
                res.redirect('/');
            } else {
                res.locals.post = post;
                next();
            }
        } catch (error) {
            next(error);
        }
    },

    //getCommetsForPostById: gets all comments for a post given a postId(viewpost)
    getCommentsForPostById: async function (req, res, next) {
        var { id } = req.params;
        try {
            var [rows, fields] = await db.execute(
                `SELECT u.username, c.comment, c.createdAt
                FROM comments c
                JOIN users u
                on c.fk_authorId=u.id
                WHERE c.fk_postId = ?;`, [id]
            );
            res.locals.post.comments = rows;
            next();
        } catch (error) {
            next(error);
        }
    },

    getRecentPosts: async function (req, res, next) {
        try {
            var [rows, fields] = await db.execute(
                `select * from csc317db.posts ORDER BY createAt limit 20;`
            );
            res.locals.posts = rows;
            next();
        } catch (error) {
            next(error);
        }
    },
};