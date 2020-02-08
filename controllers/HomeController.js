class HomeController {
  constructor() {}
  index(req, res) {
    res.json(req.user);
    // console.log(req.user);
    console.log(req);
  }
}

module.exports = HomeController;
