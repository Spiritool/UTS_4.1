var express = require('express');
var router = express.Router();
var connection = require('../config/database.js');
const Model_Ruangan = require('../model/Model_Ruangan.js');
const Model_Barang = require('../model/Model_Barang.js');
const Model_Inventory = require('../model/Model_Inventory.js');
const Model_Users = require('../model/Model_Users.js')


router.get('/', async function (req, res, next) {
try{
    let level_users = req.session.level;
    let id = req.session.userId;
    let Data = await Model_Users.getId(id);
    let rows = await Model_Inventory.getAll();
    if (Data.length > 0) {
    res.render('inventory/index', {
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
        let rows = await Model_Inventory.getAll();
        let rows_barang = await Model_Barang.getAll();
        let rows_ruangan = await Model_Ruangan.getAll();

        if (Data[0].level_users == "2") {
            // Memeriksa duplikasi id_barang
            const existingIds = rows.map(item => item.id_barang);
            const uniqueRowsBarang = rows_barang.filter(item => !existingIds.includes(item.id_barang));

            if (uniqueRowsBarang.length === 0) {
                req.flash('success', 'Semua barang telah diinput');
                res.redirect('/inventory');
                return;
            }

            res.render('inventory/create', {
                data: rows,
                data_barang: uniqueRowsBarang,
                data_ruangan: rows_ruangan,
                level: level_users,
                session_nama: req.session.nama,
                session_foto: req.session.foto,
            });
        } else if (Data[0].level_users == "1") {
            req.flash('failure', 'Anda bukan admin');
            res.redirect('/inventory');
        }
    } catch {
        req.flash('invalid', 'Anda harus login');
        res.redirect('/login');
    }
});

router.post('/store', async function (req, res, next) {
    try {
        let { id_barang, id_ruangan } = req.body;
        let Data = {
            id_barang: id_barang,
            id_ruangan: id_ruangan
        }
        console.log(req.body);
        await Model_Inventory.Store(Data);
        req.flash('success', 'Berhasil menyimpan data');
        res.redirect('/inventory');
    } catch {
        req.flash('error', 'Terjadi kesalahan pada fungsi')
        res.redirect('/inventory')
    }
})

router.get('/edit/(:id)', async function (req, res, next) {
try{
    let level_users = req.session.level;
    let id = req.params.id;
    let id_users = req.session.userId;
    let Data = await Model_Users.getId(id_users);
    let rows_barang = await Model_Barang.getAll();
    let rows_ruangan = await Model_Ruangan.getAll();
    let rows = await Model_Inventory.getId(id);
    if(Data[0].level_users == "2") {
    res.render('inventory/edit', {
        id: rows[0].id_inventory,
        data: rows,
        id_barang: rows[0].id_barang,
        nama_barang: rows[0].nama_barang,
        id_ruangan: rows[0].id_ruangan,
        nama_ruangan: rows[0].nama_ruangan,
        data_barang: rows_barang,
        data_ruangan: rows_ruangan,
        level: level_users,
        session_nama: req.session.nama,
        session_foto: req.session.foto,
    })
    }
    else if (Data[0].level_users == "1"){
        req.flash('failure', 'Anda bukan admin');
        res.redirect('/inventory')
    }
} catch {
    req.flash('invalid', 'Anda harus login');
    res.redirect('/login')
}
})



router.post('/update/(:id)', async function (req, res, next) {
    try {
        let id = req.params.id;
        let {id_barang, id_ruangan } = req.body;
        let Data = {
            id_barang,
            id_ruangan
        }
        await Model_Inventory.Update(id, Data);
        console.log(Data);
        req.flash('success', 'Berhasil mengubah data');
        res.redirect('/inventory')
    } catch {
        req.flash('error', 'terjadi kesalahan pada fungsi');
        res.render('/inventory');
    }
})

router.get('/delete/(:id)', async function (req, res) {
try{
    let id = req.params.id;
    let id_users = req.session.userId;
    let Data = await Model_Users.getId(id_users);
    if(Data[0].level_users == 2){
        await Model_Inventory.Delete(id);
        req.flash('success', 'Berhasil menghapus data');
        res.redirect('/inventory')
    }
    else if (Data[0].level_users == 1) {
        req.flash('failure', 'Anda bukan admin');
        res.redirect('/inventory')
    }
}catch{
    req.flash('invalid', 'Anda harus login');
    res.redirect('/login')
}
})

module.exports = router;