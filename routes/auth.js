const express =require('express');
const router = express.Router()
const { body, validationResult } = require('express-validator');
const User = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const fetchuser = require('../middleware/fetchuser');
const { findById } = require('../models/User');

router.post('/createuser', [
    body('name', "Enter valid password").isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const {name , password , email} = req.body;
        let user  = await User.findOne({email: email})
if(user){
   return res.status(401).send("User already exsists")

}
const salt = bcrypt.genSaltSync(10);
     user = await User.create({
        name : name,
        email: email,
        password: bcrypt.hashSync(password , salt)
    })
    res.send(user)
         
} catch (error) {
        res.status(500).send(error.message);
        console.log(error)
}
})


router.post('/login', [
    body('name', "Enter valid password").isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
], async (req, res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
   
    const {password,  email} = req.body

    let user = await User.findOne({email: email})
    if(!user){
        res.status(400).json({error: "Please try to login with correct credenttials"})
    }
    const passwordCompare = await bcrypt.compare(password, user.password);

    if(!passwordCompare){
        res.status(400).json({error: "Please try to login with correct credentials"})
    }

    const data = {
        id: user.id
    }

    const authtoken = jwt.sign(data , JWT_SECRET);

    res.json({authtoken});
     
} catch (error) {
    res.status(500).send(error.message);
    console.log(error)
}
})


router.post("/getuser", fetchuser, async(req, res)=>{
    try {
        
   let  userId = req.user.id
   console.log(userId)
    let user = await User.findById(userId).select("-password");
    res.json({user});
} catch (error) {
    res.status(500).send(error.message);
    console.log(error)
}
})


module.exports = router;
