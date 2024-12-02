module.exports.logout = (req, res) => {
    req.logout(() => {
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
};