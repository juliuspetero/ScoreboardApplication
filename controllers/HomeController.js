class HomeController {
  constructor() {}
  index(req, res) {
    res.json({ message: 'Employee Portal Application is Up Running' });
  }
}

module.exports = HomeController;
