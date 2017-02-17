var mysql = require('mysql');
var inquirer = require('inquirer')


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dada3232',
  database: 'bamazon_db'


});

connection.connect(function (err){
  if (err) {
    throw err;
  }
  begin();
});


function begin() {
  inquirer.prompt(
        {
            name: "Name",
            type: "input",
            message: "Welcome to Bamazon! Please Enter Your First Name:"
        }

    ).then(function(res) {
        console.log('Welcome '+res.Name + "!" + " " + "Please look through our products.")
        console.log('=============================================================='); 
        list();
    })
}

function list() {
    connection.query("SELECT products.id, products.product_name, departments.department_name, products.price, products.stock_quantity FROM products Left Join departments on departments.id = products.department_id", function(err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            console.log("#"+results[i].id + "\nProduct: " + results[i].product_name  + "\nDepartment: " + results[i].department_name+ "\nPrice: $" + results[i].price + "\nQuantity in stock: "+ results[i].stock_quantity);
            console.log("=================================================");
        }
        purchase();
    })
}
function purchase() {
    inquirer.prompt([
        {
            type: "input",
            name: "item",
            message: "If you would like to buy a product, then please enter its id listed above.",
        },
        {
            type: "input",
            name: "quantity",
            message: "Please enter the quantity",
        }
    ]).then(function(res) {
        connection.query("SELECT * FROM products WHERE id = ?", [res.item], function(err, result) {
            total = (result[0].price * res.quantity).toFixed();
            if (res.quantity > result[0].stock_quantity) {
                console.log("Insufficient quantity");
                disconnect();
            } else {
                connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?", [res.quantity, res.item], function(err, result) {

                        console.log("Your total for today is $" + total);

                        console.log("Thank you for shopping at Bamazon! Please visit us again soon.")

                        disconnect();
                    });


            }
        })
    })
}

function disconnect() {
    connection.end(function(err) {
        if (err) throw err;
    })
}