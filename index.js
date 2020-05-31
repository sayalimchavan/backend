const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 4000;

const mongoose = require("mongoose");
const bodyParser = require('body-parser');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
app.use(cors());
let userdetails = require("./model");
let menus = require("./menu-model");
let orders = require("./order-model");
let tokens = require("./token-model")
const router = express.Router();


mongoose.connect('mongodb://localhost:27017/restaurant', {
  useNewUrlParser: true
});

app.use(bodyParser.json());

const connection = mongoose.connection;

connection.once("open", function() {
  console.log("Connection with MongoDB was successful");
});


// userdetails
router.route("/getuser").get(function(req, res) {
  userdetails.find(function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.route('/:id').get(function(req, res) {
  let id = req.params.id;
  userdetails.findById(id, function(err, result) {
      res.json(result);
  });
});

router.route('/login/:id/:pass').get(function(req, res) {
  let id = req.params.id;
  let pass = req.params.pass;
  userdetails.find({'e_mail':id, 'password': pass, isVerified:true}, function(err, result) {
      res.json(result);
  });
});

// router.route('/adduser').post(function(req, res) {
//   let user = new userdetails(req.body);
//   user.save()
//       .then(user => {
//           res.status(200).json({'user': 'user added successfully', success: true});
//       })
//       .catch(err => {
//           res.status(400).send('adding new user failed');
//       });
// });

router.route('/adduser').post(function(req, res) {
  let user = new userdetails(req.body);
  user.save()
      .then(user => {

        let token = new tokens({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
        token.save(function (err) {
          if (err) { return res.status(500).send({ msg: err.message }); }

          // Send the email
          var transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: 'sayali.chavan.rebase@gmail.com', pass: 'harrypotter1234' } });
          var mailOptions = { from: 'sayali.chavan.rebase@gmail.com', to: user.e_mail, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
          transporter.sendMail(mailOptions, function (err) {
              if (err) { return res.status(500).send({ msg: err.message }); }
              res.status(200).send('A verification email has been sent to ' + user.e_mail + '.');
          });
      });
  
          res.status(200).json({'user': 'user added successfully', success: true});
      })
      .catch(err => {
          res.status(400).send('adding new user failed');
      });
});


router.route('/update/:id').post(function(req, res) {
  userdetails.findById(req.params.id, function(err, result) {
      if (!result)
          res.status(404).send("data is not found");
      else
      result.first_Name = req.body.first_Name;
      result.last_Name = req.body.last_Name;
      result.e_mail = req.body.e_mail;
      result.address = req.body.address;
      result.phone = req.body.phone;
      result.password = req.body.password;
      result.save().then(result => {
              res.json('user updated!');
          })
          .catch(err => {
              res.status(400).send("Update not possible");
          });
  });
});


//menu
router.route("/menu/getmenu").get(function(req, res) {
  menus.find(function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  });
});

router.route('/menu/:id').get(function(req, res) {
  let id = req.params.id;
  menus.findById(id, function(err, result) {
      res.json(result);
  });
});

router.route('/menu/update/:id').post(function(req, res) {
  menus.findByIdAndUpdate(req.params.id, req.body,{new: true}, function(err, result) {
    if (err)
     return res.status(500).send(err);
     else
    return res.json(result);
  });
});

//orders
router.route('/order/addorder').post(function(req, res) {
  let order = new orders(req.body);
  order.save()
      .then(order => {
          res.status(200).json({'order': 'order added successfully', success: true});
      })
      .catch(err => {
          res.status(400).send('adding new order failed');
      });
});

router.route("/order/getorders").get(function(req, res) {
  orders.find(function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

//tokens
router.route('/confirmation/:id').get(function(req, res) {
  let id = req.params.id;
  tokens.findOne({ token: id }, function (err, token) {
    if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token.' });

    // If we found a token, find a matching user
    userdetails.findOne({ _id: token._userId}, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'Not able to find a user for this token.' });
        if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

        // Verify and save the user
        user.isVerified = true;
        user.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            res.status(200).send("The account has been verified. Please log in.");
        });
    });
});
});

app.use("/", router);

app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});

