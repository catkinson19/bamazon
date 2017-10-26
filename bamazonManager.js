let bamDB = require('./bamazonDB');
let inquirer = require("inquirer");

promptManager();

function promptManager() {
    inquirer.prompt([{
        name: 'chooseActivity',
        message: '| Bamazon Manager |',
        type: 'list',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
    }]).then((ans) => {
        switch (ans.chooseActivity) {
            case 'View Products for Sale':
                bamDB.readProduct();
                promptManager();
                break;
            case 'View Low Inventory':
                bamDB.readProduct(true);
                promptManager();
                break;
            case 'Add to Inventory':
                addInv();

                break;
            case 'Add New Product':
                newProduct();
                break;
        }
    })
};

function addInv() {
    inquirer
        .prompt([
            {
                name: "item_id",
                type: "input",
                message: "What is the ID of the item you would like to add inventory to?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many uits would you like to add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then((ans) => {
            bamDB.updateProduct(ans.item_id, 'add', ans.quantity);
            promptManager();
        })
};

function newProduct() {
    inquirer
        .prompt([
            {
                name: "productName",
                type: "input",
                message: "What is the name of your product?",
            },
            {
                name: "departmentName",
                type: "input",
                message: "What is this product's department",

            },
            {
                name: "price",
                type: "input",
                message: "How much does a unit cost?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                },

            },
            {
                name: "quantity",
                type: "input",
                message: "How many units are in inventory?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then((ans) => {
            return bamDB.createProduct(ans.productName, ans.departmentName, ans.price, ans.quantity);
        }).then(()=>{
            promptManager();
        })
};