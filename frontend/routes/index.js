const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('index');
});

router.get('/index', (req, res) => {
  res.clearCookie('token');
  res.render('index');
});

router.get('/dashboard', (req, res) => {
  if(req.cookies.token) {
    res.render('dashboard');
  } else {
    res.redirect('index')
  }
});

router.get('/settings', (req, res) => {
  if(req.cookies.token) {
    res.render('settings');
  } else {
    res.redirect('index')
  }
});


module.exports = router;
