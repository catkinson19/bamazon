let bamDB = require('./bamazonDB');
let inquirer = require("inquirer");

promptConsumer();

function promptConsumer() {
    bamDB.readProduct(false);
    inquirer
        .prompt([
            {
                name: "item_id",
                type: "input",
                message: "Please input the ID of the item you would like to purchase:"
            },
            {
                name: "quantity",
                type: "input",
                message: "How man units would you like to purchase?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            checkorder(answer);
        })
};

function checkorder(answer) {
    bamDB.readProduct(false, answer.item_id, function (err, res) {
        if (err) {
            throw err
        } else {
            if (answer.quantity <= res[0].stock_quantity) {
                bamDB.updateProduct(answer.item_id, 'subtract', answer.quantity)
                console.log(`
            You successfully purchased ${res[0].product_name} for $${res[0].price * answer.quantity}!
            `);
            } else {
                console.log(`Sorry, it appears there is not sufficient quantity of ${res[0].product_name}`);
                bamDB.closeConnection();
            }

        }
    })
}