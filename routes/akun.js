var express = require('express');
var router = express.Router();
var connection = require('../config/database.js');
const Model_Users = require('../model/Model_Users.js');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/users')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

router.get('/', async function (req, res, next) {
try {
    let id = req.session.userId;
    let Data = await Model_Users.getId(id);
    let rows = await Model_Users.getAll();
    let level_users = req.session.level;
    if(Data[0].level_users == "2") {
    res.render('akun/index', {
        data: rows,
        level: level_users,
        session_foto: req.session.foto,
        session_nama: req.session.nama,
    });
    }
    else if (Data[0].level_users == "1"){
        req.flash('failure', 'Anda bukan admin');
        res.redirect('/users')
    }
} catch (err) {
    req.flash('invalid', 'Anda harus login');
    res.redirect('/login')
    console.log(err)
}
});

router.get('/create', async function (req, res, next) {
try {
    let level_users = req.session.level;
    let id = req.session.userId;
    let Data = await Model_Users.getId(id);
    if(Data[0].level_users == "2") {
    res.render('akun/create', { 
        level: level_users,
        session_foto: req.session.foto,
        session_nama: req.session.nama,
    })
    }
    else if (Data[0].level_users == "1"){
        req.flash('failure', 'Anda bukan admin');
        res.redirect('/users')
    }
} catch (Data) {
    req.flash('invalid', 'Anda harus login');
    res.redirect('/login')
}
})

router.post('/store', upload.single("foto"), async function (req, res, next) {
    try {
        let { nama, alamat, no_telp, email, password, level_users } = req.body;
        let Data = {
            nama,
            alamat,
            no_telp,
            email,
            password,
            level_users,
            foto: req.file.filename
        }
        await Model_Users.Store(Data);
        req.flash('success', 'Berhasil menyimpan data');
        res.redirect('/akun');
    } catch {
        req.flash('error', 'Terjadi kesalahan pada fungsi')
        res.redirect('/akun')
    }
})

router.get('/edit/(:id)', async function (req, res, next) {
    try{
        let level_users = req.session.level;
        let id = req.params.id;
        let id_users = req.session.userId;
        let rows = await Model_Users.getId(id);
        let Data = await Model_Users.getId(id_users);
        if(Data[0].level_users == "2") {
        res.render('akun/edit', {
            data: rows[0],
            level: level_users,
            session_nama: req.session.nama,
            session_foto: req.session.foto,
        })
        }
        else if (Data[0].level_users == "1"){
            req.flash('failure', 'Anda bukan admin');
            res.redirect('/akun')
        }
    } catch {
        req.flash('invalid', 'Anda harus login');
        res.redirect('/login')
    }
    })
    
    
    
    router.post('/update/(:id)', upload.single("foto"), async function (req, res, next) {
        try {
            let id = req.params.id;
            let filebaru = req.file ? req.file.filename : null;
            let rows = await Model_Users.getId(id);
            const namaFileLama = rows[0].foto;
    
            if (filebaru && namaFileLama) {
                const pathFileLama = path.join(__dirname, '../public/images/users', namaFileLama);
                fs.unlinkSync(pathFileLama);
            }
    
            let { nama, alamat, no_telp, email, password } = req.body;
            let enkripsi = await bcrypt.hash(password, 10);
            let foto = filebaru || namaFileLama
            let Data = {
                nama,
                alamat,
                no_telp,
                email,
                password: enkripsi,
                foto,
            }
            await Model_Users.Update(id, Data);
            console.log(Data);
            req.flash('success', 'Berhasil mengubah data');
            res.redirect('/akun')
        } catch {
            req.flash('error', 'terjadi kesalahan pada fungsi');
            res.redirect('/akun');
        }
    })

router.get('/delete/(:id)', async function (req, res) {
    try{
        let id = req.params.id;
        let id_users = req.session.userId;
        let Data = await Model_Users.getId(id_users);
        let rows = await Model_Users.getId(id);
        if(id == id_users){
            req.flash('failure','Anda sedang login dengan akun ini');
            res.redirect('/akun')
        }
        else if(Data[0].level_users == 2){
        const namaFileLama = rows[0].foto;
        if (namaFileLama) {
            const pathFilelama = path.join(__dirname, '../public/images/users', namaFileLama);
            fs.unlinkSync(pathFilelama);
        }
        await Model_Users.Delete(id);
        req.flash('success', 'Berhasil menghapus data');
        res.redirect('/akun')
        
        }
        else if (Data[0].level_users == 1) {
            req.flash('failure', 'Anda bukan admin');
            res.redirect('/akun')
        }
    } catch {
        req.flash('invalid', 'Anda harus login');
        res.redirect('/login')
    }
    })


module.exports = router;