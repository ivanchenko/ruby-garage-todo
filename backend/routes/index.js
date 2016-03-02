var checkAuth = require('../middleware/checkAuth');

module.exports = function (app) {
  app.get('/login', require('./login').get);
  app.post('/login', require('./login').post);
  app.get('/main', checkAuth, require('./main'));

  app.get('/', function (req, res) {
    res.redirect('/login');
  });

  // actions
  app.post('/actions/addProject', checkAuth, require('./actions/addProject'));
  app.post('/actions/editProject', checkAuth, require('./actions/editProject'));

  app.post('/actions/addTask', checkAuth, require('./actions/addTask'));
  app.post('/actions/editTask', checkAuth, require('./actions/editTask'));

  app.post('/actions/getAllProjects', checkAuth, require('./actions/getAllProjects'));
};
