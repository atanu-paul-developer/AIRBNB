module.exports.loginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.matchLogindetail = async(req, res) => {
    try {
        req.flash("logIN", "You are logged-IN");
        res.redirect("/listings");
    } catch (err) {
        req.flash("error", "password or username incorrect !!");
    }
};