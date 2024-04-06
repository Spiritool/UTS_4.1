var express = require('express');
var router = express.Router();
var connection = require('../config/database.js');
const Model_Ruangan = require('../model/Model_Ruangan.js');
const Model_Users = require('../model/Model_Users.js')

router.get('/', async function (req, res, next) {
try{
    let level_users = req.session.level;
    let id = req.session.userId;
    let Data = await Model_Users.getId(id);
    let rows = await Model_Ruangan.getAll();
    if(Data.length > 0) {
    res.render('ruangan/index', {
        data: rows,
        level: level_users,
        session_nama: req.session.nama,
        session_foto: req.session.foto,
    });
    }
} catch {
    req.flash('invalid', 'Anda harus login');
    res.redirect('/login')
}
});

router.get('/create', async function (req, res, next) {
try {
    let level_users = req.session.level;
    let id = req.session.userId;
    let Data = await Model_Users.getId(id);
    if(Data[0].level_users == 2){
    res.render('ruangan/create', {
        nama_ruangan: '',
        level: level_users,
        session_nama: req.session.nama,
        session_foto: req.session.foto,
    })
    }
    else if (Data[0].level_users == 1) {
        req.flash('failure', 'Anda bukan admin');
        res.redirect('/ruangan')
    }
}catch{
    req.flash('invalid', 'Anda harus login');
    res.redirect('/login')
}
})

router.post('/store', async function (req, res, next) {
    try {
        let { nama_ruangan, kode_ruangan } = req.body;
        let Data = {
            nama_ruangan,
            kode_ruangan,
        }
        await Model_Ruangan.Store(Data);
        req.flash('success', 'Berhasil menyimpan data');
        res.redirect('/ruangan');
    } catch {
        req.flash('error', 'Terjadi kesalahan pada fungsi')
        res.redirect('/ruangan')
    }
})

router.get('/edit/(:id)', async function (req, res, next) {
try{
    let level_users = req.session.level;
    let id_users = req.session.userId;
    let id = req.params.id;
    let rows = await Model_Ruangan.getId(id);
    let Data = await Model_Users.getId(id_users);
    if(Data[0].level_users == "2") {
    res.render('ruangan/edit', {
        id: rows[0].id_ruangan,
        nama_ruangan: rows[0].nama_ruangan,
        kode_ruangan: rows[0].kode_ruangan,
        level: level_users,
        session_nama: req.session.nama,
        session_foto: req.session.foto,
    })
    }
    else if (Data[0].level_users == "1"){
        req.flash('failure', 'Anda bukan admin');
        res.redirect('/ruangan')
    }
} catch {
    req.flash('invalid', 'Anda harus login');
    res.redirect('/login')
}
})



router.post('/update/(:id)', async function (req, res, next) {
    try {
        let id = req.params.id;
        let { nama_ruangan, kode_ruangan } = req.body;
        let Data = {
            nama_ruangan: nama_ruangan,
            kode_ruangan: kode_ruangan
        }
        await Model_Ruangan.Update(id, Data);
        console.log(Data);
        req.flash('success', 'Berhasil mengubah data');
        res.redirect('/ruangan')
    } catch {
        req.flash('error', 'terjadi kesalahan pada fungsi');
        res.render('/ruangan');
    }
})

router.get('/delete/(:id)', async function (req, res) {
try{
    let id = req.params.id;
    let id_users = req.session.userId;
    let Data = await Model_Users.getId(id_users);
    if(Data[0].level_users == 2){
        await Model_Ruangan.Delete(id);
        req.flash('success', 'Berhasil menghapus data');
        res.redirect('/ruangan')
    }
    else if(Data[0].level_users == 1){
        req.flash('failure', 'Anda bukan admin');
        res.redirect('/ruangan')
    }
    } catch {
        req.flash('error', 'terjadi kesalahan pada fungsi');
        res.render('/kategori');
    }
})

module.exports = router;