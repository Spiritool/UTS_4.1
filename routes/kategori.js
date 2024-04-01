var express = require('express');
var router = express.Router();
var connection = require('../config/database.js');
const Model_Kategori = require('../model/Model_Kategori.js');
const Model_Users = require('../model/Model_Users.js')

// router.get('/test', async function (req, res, next) {
//     try {
//         let id = req.session.userId;
//         let Data = await Model_Users.getId(id);
//         if (Data.length > 0) {
//             let rows = await Model_Produk.getAll();
//             res.render('produk/index', {
//                 data: rows
//             })
//         } else {
//             res.redirect('/login')
//             req.flash('error', 'Terjadi kesalahan pada fungsi')
//         }
//     } catch (err) {
//         res.redirect('/login')
//         console.log(err);
//     }
// });

router.get('/', async function (req, res, next) {
try {
    let id = req.session.userId;
    let Data = await Model_Users.getId(id);
    let rows = await Model_Kategori.getAll();
    if (Data.length > 0) {
    res.render('kategori/index', {
        data: rows
    });
    }
} catch (err) {
    req.flash('invalid', 'Anda harus login');
    res.redirect('/login')
    console.log(err)
}
});

router.get('/create', async function (req, res, next) {
try {
    let id = req.session.userId;
    let Data = await Model_Users.getId(id);
    if(Data[0].level_users == "2") {
    res.render('kategori/create', {
        nama_kategori: ''
    })
    }
    else if (Data[0].level_users == "1"){
        req.flash('failure', 'Anda bukan admin');
        res.redirect('/kategori')
    }
} catch (Data) {
    req.flash('invalid', 'Anda harus login');
    res.redirect('/login')
}
})

router.post('/store', async function (req, res, next) {
    try {
        let { nama_kategori } = req.body;
        let Data = {
            nama_kategori
        }
        await Model_Kategori.Store(Data);
        req.flash('success', 'Berhasil menyimpan data');
        res.redirect('/kategori');
    } catch {
        req.flash('error', 'Terjadi kesalahan pada fungsi')
        res.redirect('/kategori')
    }
})

router.get('/edit/(:id)', async function (req, res, next) {
try{
    let id_users = req.session.userId;
    let id = req.params.id;
    let rows = await Model_Kategori.getId(id);
    let Data = await Model_Users.getId(id_users);
    if(Data[0].level_users == "2") {
    res.render('kategori/edit', {
        id: rows[0].id_kategori,
        nama_kategori: rows[0].nama_kategori
    })
    }
    else if (Data[0].level_users == "1"){
        req.flash('failure', 'Anda bukan admin');
        res.redirect('/kategori')
    }
} catch(Data) {
    req.flash('invalid', 'Anda harus login');
    res.redirect('/login')
}
})



router.post('/update/(:id)', async function (req, res, next) {
    try {
        let id = req.params.id;
        let { nama_kategori } = req.body;
        let Data = {
            nama_kategori: nama_kategori
        }
        await Model_Kategori.Update(id, Data);
        console.log(Data);
        req.flash('success', 'Berhasil mengubah data');
        res.redirect('/kategori')
    } catch {
        req.flash('error', 'terjadi kesalahan pada fungsi');
        res.render('/kategori');
    }
})

router.get('/delete/(:id)', async function (req, res) {
try{
    let id = req.params.id;
    let id_users = req.session.userId;
    let Data = await Model_Users.getId(id_users);
    if(Data[0].level_users == 2){
        await Model_Kategori.Delete(id);
        req.flash('success', 'Berhasil menghapus data');
        res.redirect('/kategori')
    }
    else if (Data[0].level_users == 1) {
        req.flash('failure', 'Anda bukan admin');
        res.redirect('/kategori')
    }
}catch{
    req.flash('invalid', 'Anda harus login');
    res.redirect('/login')
}
})


module.exports = router;