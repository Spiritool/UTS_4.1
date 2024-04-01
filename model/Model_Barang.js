const connection = require('../config/database');

class Model_Kategori {

    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query(`select *, b.nama_kategori from barang as a
            join kategori as b on b.id_kategori=a.id_kategori
            order by a.id_barang desc`, (err, rows) => {
                if(err){
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async Store(Data){
        return new Promise((resolve, reject) => {
            connection.query('insert into barang set ?', Data, function(err, result){
                if(err){
                    reject(err);
                    console.log(err);
                } else {
                    resolve(result);
                }
            })
        });
    }

    static async getId(id){
        return new Promise((resolve, reject) => {
            connection.query(`select *, b.nama_kategori from barang as a
            join kategori as b on b.id_kategori=a.id_kategori
            where a.id_barang = ` + id, (err,rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    }

    static async Update(id, Data) {
        return new Promise((resolve, reject) => {
            connection.query('update barang set ? where id_barang =' + id, Data, function(err, result){
                if(err){
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }

    static async Delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('delete from barang where id_barang =' + id, function(err,result){
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }

}


module.exports = Model_Kategori;