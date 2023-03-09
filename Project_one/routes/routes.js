const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer')

var storage = multer.diskStorage({
    destination: function(req, res, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);

    },
})


var upload = multer({
    storage:storage,
}).single('image');

router.get('/', (req, res) => {
    // res.send("all users")
    res.render('index', {title: "Homepage"})
})


router.get("/add", (req, res) => {
    res.render('add_user', {title: "add User"})
})

router.get("/all", (req, res) => {

    // res.render('all_user', {title: "Users"})
    User.find().then(users => {
    res.render('all_user', {title: "Users", users: users})
}).catch(err => {
    res.json({msg: err.message})
})

})

router.post('/add', upload, (req, res) => {
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        image:req.file.filename,


    })
    user.save()
  .then(() => {
    req.session.message = {
      type: 'success',
      msg: 'User added successfully'
    };
    res.redirect('/');
  })
  .catch((error) => {
    res.json({ message: error.message, type: 'danger' });
  });
})


router.get('/edit/:id', (req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.json({ msg: 'User not found' });
      } else {
        res.render('edit_user', { title: 'Edit User', user });
      }
    })
    .catch((err) => {
      res.json({ msg: err.message });
    });
});




router.post("/update/:id", upload, (req, res) => {
  User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: req.file ? req.file.filename : ''
  }, { new: true })
  .then(user => {
    if (user) {
       
      req.session.message = {
        type: 'success',
        msg: 'User updated successfully'
      };
      res.redirect('/all');
    } else {
      res.json({ msg: 'User not found' });
    }
  })
  .catch(err => {
    res.json({ msg: err.message });
  });
});


router.post('/delete/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(user => {
      if (user) {
        req.session.message = {
          type: 'success',
          msg: 'User deleted successfully'
        };
        res.redirect('/all');
      } else {
        res.json({ msg: 'User not found' });
      }
    })
    .catch(err => {
      res.json({ msg: err.message });
    });
});



module.exports = router