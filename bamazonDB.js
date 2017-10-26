let mysql = require("mysql");
require('console.table');
var xss = require('xss');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",

    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});

function closeConnection() {
    connection.end();
}

//Format Tables
function logProducts(products) {
    console.table([], products);
};

//Create
function createProduct(productName, departmentName, price, stock) {
 connection.query(
    "INSERT INTO products SET ?",
    {
      product_name: productName,
      department_name: departmentName,
      price: price,
      stock_quantity: stock
    },
    function(err) {
      if (err) throw err;
      console.log("Item added successfully!");
    }
  )
};

//Read
function readProduct(less, item_id, callback) {
    if (less === true) {
        connection.query(`SELECT * FROM products WHERE stock_quantity <= 5;`, function (err, res) {
            if (err) {
                connection.end();
                throw err;
            } else {
                logProducts(res);
            }
        })
    }
    else if (!item_id) {
        connection.query(`SELECT * FROM products;`, function (err, res) {
            if (err) {
                connection.end();
                throw err;
            } else {
                logProducts(res);
            }
        })
    }
    else if (less === false && item_id && callback) {
        connection.query(`SELECT * FROM products WHERE item_id = ${item_id};`, function (err, res) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, res);
            }
        })
    }
};

//Update
function updateProduct(item_id, method, quantity) {
    quantity = parseInt(quantity);
    readProduct(false, item_id, function (err, res) {
        let delta;
        if (err) {
            throw err
        } else {
            switch (method) {
                case 'add':
                    delta = res[0].stock_quantity + quantity;
                    break;
                case 'subtract':
                    delta = res[0].stock_quantity - quantity;
                    break;
                case 'update':
                    delta = quantity;
                    break;
            }
            connection.query(`UPDATE products SET stock_quantity = ${delta} WHERE item_id = ${item_id};`, function (err, res) {
                if (err) {
                    throw err;
                } else {
                    console.log('Update successful');
                }
            })
        }
    })
};

createProduct('bojack', 'speership', 30, 1);
//readProduct();
//updateProduct(1, 'update', 10);

module.exports = {
    createProduct: createProduct,
    readProduct: readProduct,
    updateProduct: updateProduct,
    closeConnection: closeConnection,
}
