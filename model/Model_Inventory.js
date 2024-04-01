const connection = require('../config/database');

class Model_Inventory {

    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query(`select *, b.nama_barang, b.jumlah_barang, c.nama_ruangan from inventory as a
            join barang as b on b.id_barang=a.id_barang
            join ruangan as c on c.id_ruangan=a.id_ruangan
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
            connection.query('insert into inventory set ?', Data, function(err, result){
                if(err){
                    reject(err);
                    console.log(err);
                } else {
                    resolve(result);
                    console.log(result);
                }
            })
        });
    }

    static async getId(id){
        return new Promise((resolve, reject) => {
            connection.query(`select *, b.nama_barang, b.jumlah_barang, c.nama_ruangan from inventory as a
            join barang as b on b.id_barang=a.id_barang
            join ruangan as c on c.id_ruangan=a.id_ruangan
            where a.id_inventory = ` + id, (err,rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            })
        })
    }

    static async Update(id, Data) {
        return new Promise((resolve, reject) => {
            connection.query('update inventory set ? where id_inventory =' + id, Data, function(err, result){
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
            connection.query('delete from inventory where id_inventory =' + id, function(err,result){
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }

}


module.exports = Model_Inventory;