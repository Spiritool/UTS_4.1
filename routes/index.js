var express = require('express');
var router = express.Router();
var connection = require('../config/database.js');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');

var Model_Users = require('../model/Model_Users');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/images/users')
  },
  filename: (req, file, cb) => {
      console.log(file)
      cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', function(req, res, next) {
  res.render('auth/register');
})

router.get('/login', function(req, res, next) {
  res.render('auth/login');
})

router.post('/saveusers', upload.single("foto"), async (req, res) => {
  let { nama, alamat, no_telp, email, password } = req.body;
  let enkripsi = await bcrypt.hash(password, 10);
  let Data = {
    nama,
    alamat,
    no_telp,
    email,
    password: enkripsi,
    level_users: 1,
    foto: req.file.filename
  };
  await Model_Users.Store(Data);
  req.flash('success', 'Berhasil Register');
  res.redirect('/login')
});

router.post('/log', async (req,res) => {
  let {email, password } = req.body;
  try {
    let Data = await Model_Users.Login(email);
    if(Data.length > 0) {
      let enkripsi = Data[0].password;
      let cek = await bcrypt.compare(password, enkripsi);
      if(cek) {
        req.session.userId = Data[0].id_users;
        //tambahkan kondisi pengecekan level pada user yang login
        if(Data[0].level_users == 1){
          req.flash('success','Berhasil login');
          res.redirect('/users');
          //console.log(Data[0]);
        }else if(Data[0].level_users == 2){
          req.flash('success', 'Berhasil login');
          res.redirect('/superusers');
        }else{
          res.redirect('/login');
          console.log(Data[0]);
        }
      } else {
        req.flash('error', 'Email atau password salah');
        res.redirect('/login');
      }
    } else {
      req.flash('error', 'Akun tidak ditemukan');
      res.redirect('/login');
    }
  } catch (err) {
    res.redirect('/login');
    req.flash('error', 'Error pada fungsi');
    console.log(err);
  }
})

router.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if(err) {
      console.error(err);
    } else {
      res.redirect('/login');
    }
  });
});


module.exports = router;
