module.exports = function (req, res) {
    req.session.destroy();
    console.log('log out');
    res.status(200).send();
};