class HomeController {
  constructor() {}
  index(req, res) {
    res.json({
      message: 'Scoreboard Application is Running!',
      user: req.user
    });
  }
}

module.exports = HomeController;
