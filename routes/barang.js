var express = require('express');
var router = express.Router();
var connection = require('../config/database.js');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const Model_Barang = require('../model/Model_Barang.js');
const Model_Kategori = require('../model/Model_Kategori.js');
const Model_Users = require('../model/Model_Users.js')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/upload')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

router.get('/', async function (req, res, next) {
try{
    let id = req.session.userId;
    let Data = await Model_Users.getId(id);
    let rows = await Model_Barang.getAll();
    if (Data.length > 0) {
    res.render('barang/index', {
        data: rows
    });
    }
    } catch {
        req.flash('invalid', 'Anda harus login');
        res.redirect('/login')
    }
});

router.get('/create', async function (req, res, next) {
try{
    let id = req.session.userId;
    let Data = await Model_Users.getId(id);
    let rows = await Model_Kategori.getAll();
    if(Data[0].level_users == "2") {
        res.render('barang/create', {
            data: rows
        })
    }
    else if (Data[0].level_users == "1"){
        req.flash('failure', 'Anda bukan admin');
        res.redirect('/barang')
    }
} catch {
    req.flash('invalid', 'Anda harus login');
    res.redirect('/login')
}
})

router.post('/store', upload.single("gambar_barang"), async function (req, res, next) {
    try {
        let { nama_barang, merk_barang, id_kategori, tahun_perolehan, expired, jumlah_barang, harga_barang } = req.body;
        let Data = {
            nama_barang,
            merk_barang,
            id_kategori,
            tahun_perolehan,
            expired,
            jumlah_barang,
            harga_barang,
            gambar_barang: req.file.filename
        }
        await Model_Barang.Store(Data);
        req.flash('success', 'Berhasil menyimpan data');
        res.redirect('/barang');
    } catch {
        req.flash('error', 'Terjadi kesalahan pada fungsi')
        res.redirect('/barang')
    }
})

router.get('/edit/(:id)', async function (req, res, next) {
try{
    let id = req.params.id;
    let id_users = req.session.userId;
    let rows = await Model_Barang.getId(id);
    let Data = await Model_Users.getId(id_users);
    let rows_kategori = await Model_Kategori.getAll();
    if(Data[0].level_users == "2") {
    res.render('barang/edit', {
        data: rows[0],
        data_kategori: rows_kategori
    })
    }
    else if (Data[0].level_users == "1"){
        req.flash('failure', 'Anda bukan admin');
        res.redirect('/barang')
    }
} catch {
    req.flash('invalid', 'Anda harus login');
    res.redirect('/login')
}
})



router.post('/update/(:id)', upload.single("gambar_barang"), async function (req, res, next) {
    try {
        let id = req.params.id;
        let filebaru = req.file ? req.file.filename : null;
        let rows = await Model_Barang.getId(id);
        const namaFileLama = rows[0].gambar_barang;

        if (filebaru && namaFileLama) {
            const pathFileLama = path.join(__dirname, '../public/images/upload', namaFileLama);
            fs.unlinkSync(pathFileLama);
        }

        let { nama_barang, merk_barang, id_kategori, tahun_perolehan, expired, jumlah_barang, harga_barang } = req.body;
        let gambar_barang = filebaru || namaFileLama
        let Data = {
            nama_barang: nama_barang,
            merk_barang,
            id_kategori,
            tahun_perolehan,
            expired,
            jumlah_barang,
            harga_barang,
            gambar_barang,
        }
        await Model_Barang.Update(id, Data);
        console.log(Data);
        req.flash('success', 'Berhasil mengubah data');
        res.redirect('/barang')
    } catch {
        req.flash('error', 'terjadi kesalahan pada fungsi');
        res.redirect('/barang');
    }
})

router.get('/delete/(:id)', async function (req, res) {
try{
    let id = req.params.id;
    let id_users = req.session.userId;
    let Data = await Model_Users.getId(id_users);
    let rows = await Model_Barang.getId(id);
    if(Data[0].level_users == 2){
    const namaFileLama = rows[0].gambar_barang;
    if (namaFileLama) {
        const pathFilelama = path.join(__dirname, '../public/images/upload', namaFileLama);
        fs.unlinkSync(pathFilelama);
    }
    await Model_Barang.Delete(id);
    req.flash('success', 'Berhasil menghapus data');
    res.redirect('/barang')
    
    }
    else if (Data[0].level_users == 1) {
        req.flash('failure', 'Anda bukan admin');
        res.redirect('/barang')
    }
} catch {
    req.flash('invalid', 'Anda harus login');
    res.redirect('/login')
}
})

module.exports = router;