const withAuth = (req, res, next) => {
    console.log("Logged In", req.session.loggedIn)
    if (!req.session.logged_in) {
        res.redirect('/login');
    } else {
        next();
    }
};

module.exports = withAuth;