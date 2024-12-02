const logError = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("logErr", "You must be logged-IN !");
        res.redirect("/login");
    }
    next();
}

module.exports = logError;

// const saveredirectUrl = (req, res, next) => {
//     if(req.session.redirectUrl) {
//         res.locals.redirectUrl = req.session.redirectUrl;
//     }
//     next();
// }

// module.exports = saveredirectUrl;