const User = require("../models/user");

module.exports.signupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signupdataSave = async(req, res) => {
    try {
    let {email, username, password} = req.body;
    let user1 = new User({
        email,
        username,
    });
    let registeredUser = await User.register(user1, password);
    req.login(registeredUser, (err) => {
        if(err) {
            next(err);
        }
        req.flash("signUp", "You are Signed-IN");
        res.redirect("/listings");
    });
    } catch (err) {
        req.flash("Error", "Username already registered");
        res.redirect("/signup");
    }
};