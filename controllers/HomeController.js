class HomeController {
  constructor() {}
  index(req, res) {
    res.json({
      message: 'Scoreboard Application is Running!'
    });
  }
}

module.exports = HomeController;
