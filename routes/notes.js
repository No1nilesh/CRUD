const express =require('express');
const router = express.Router()
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const User =require('../models/User')
const Note = require('../models/Note')

//ROUTE 1 "/api/notes/createnote" Authenntication required //login required
router.post("/createnote",fetchuser, [ 
body('title', "Enter valid password").isLength({ min: 3 }),
body('description').isLength({ min: 3 }),
body('tags')], async (req, res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

try {
    

    const {title, description, tags} = req.body;

    const notes = new Note({

        title : title,
        description : description,
        tags : tags,
        user : req.user.id
    })

    notes.save();
    res.json({notes})
} catch (error) {
    res.status(500).send(error.message)
}
})

//ROUTE 2 "/api/notes/getnote" 

router.get("/getnote", fetchuser, async(req, res)=>{
  
try {
    
    let notes = await Note.find({user: req.user.id})
    res.json(notes)
} catch (error) {
    res.status(500).send(error.message)
}
})


router.put("/update/:id", fetchuser,fetchuser, [ 
    body('title', "Enter valid password").isLength({ min: 3 }),
    body('description').isLength({ min: 3 }),
    body('tags')], async(req, res)=>{
    
        let newnote = {};

        const {description , title, tags} = req.body;
     
        if(title){ newnote.title = title }   
        if(description){ newnote.description = description}   
         if(tags){ newnote.tags = tags}   
      
         try {
         

    let note = await Note.findById(req.params.id);

    if(!note){
        return res.status(404).json({error: "Not Found"})
    }

    if(note.user.toString() !== req.user.id){
        return res.status(401).json({error: "Not Allowed"})
    }

    note = await Note.findByIdAndUpdate(req.params.id , {$set: newnote} ,{new: true})

    res.json({note})
} catch (error) {
    res.status(500).send(error.message)
}

})

router.delete("/delete/:id", fetchuser, async(req, res)=>{
    
    try {
   
    let note = await Note.findById(req.params.id);

    if(!note){
        return res.status(404).json({error : "Not found"})
    }

    if(note.user.toString() !== req.user.id){
        return res.status(401).json({error : "Not Authorised"})
    }

    note = await Note.findByIdAndDelete(req.params.id)
    res.json({sucess : "Note deleteded succsessfully"})
} catch (error) {
    res.status(500).send(error.message)
}
})

module.exports = router;