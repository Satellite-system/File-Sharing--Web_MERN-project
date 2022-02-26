const router = require('express').Router();
const File = require('../models/fileModel');
require('dotenv').config();


router.get('/:uuid',async (req, res)=>{
    try{
        const file = await File.findOne({ uuid: req.params.uuid });
        if(!file){
            return res.render('downloadPage',{error:'Link has been Expired.'})
        }
        return res.render('downloadPage',{
            uuid: file.uuid,
            fileName: file.fileName,
            fileSize: file.size,
            downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
            // http://localhost:3000/files/download/uivjjfkd82ckd-jskdm3ckd-dkkdl3mld
        })
    }catch(err){
        return res.render('downloadPage',{error:'Something Went wrong.'})
    }
});

// Download btn Event Call
router.get('/download/:uuid', async (req,res)=>{
    const file = await File.findOne({ uuid: req.params.uuid});

    if(!file){
        return res.render('downloadPage',{error:'Link has been Expired'});
    }

    const filePath = `${__dirname}/../${file.path}`
    res.download(filePath);
})

module.exports = router;