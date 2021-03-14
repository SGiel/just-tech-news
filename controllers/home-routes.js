const router = require('express').Router();

const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// Because we've hooked up a template engine, we can now use res.render() and specify which template we want to use. 
// In this case, we want to render the homepage.handlebars template (the .handlebars extension is implied). 

router.get('/', (req, res) => {
    console.log("I am here!", req.session);
    Post.findAll({
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      include: [
        {
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
    .then(dbPostData => {
        // You did not need to serialize data before when you built API routes, because the res.json() method 
        // automatically does that for you.
        const posts = dbPostData.map(post => post.get({ plain: true }));
        
        // This will loop over and map each Sequelize object into a serialized version of itself, saving the 
        // results in a new posts array.
        res.render('homepage', { posts });

        // pass a single post object into the homepage template (old line below)
        // res.render('homepage', dbPostData[0].get({ plain: true }));

        // non serialized object did not work (below)
        //res.render('homepage', dbPostData[0]);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
      }
    
      res.render('login');  });

module.exports = router;