const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

//  @route  POST api/users
// @desc  Register new user
// @access public
router.post('/', (req, res) => {
    const { name, email, password } = req.body;

    // Simple validation
    if (!name || !email || !password) {
        res.status(400).json({ msg: "Please Enter all field" });
    }
    // Check for user
    User.findOne({ email })
        .then(user => {
            if (user) {
                return res.status(400).json({ msg: "User already Exist" });
            }
            const newUser = new User({
                name,
                email,
                password
            });

            // Create salt hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            res.json({
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email
                                }
                            })
                        })
                })
            })
        })
});

module.exports = router;