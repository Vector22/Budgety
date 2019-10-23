// The piece of code what control the budget

var budgetController = (function() {
    // The Expense object
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // The Income object
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // The object that hold all the budget datas
    var data = {
        allItems : {
            inc: [], // Table of incomes
            exp: [], // Table of expenses
        },
        totals : {
            inc: 0, // The total amount of incomes
            exp: 0, // The total amount of expenses
        },
    };

    // Expose the public elements
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            // As the id will be unique, we take the previous object ID
            // and we add +1 on it...
            if(data.allItems[type].length > 0) {
                ID  = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                // It's the first element of the array
                ID = 0;
            }

            // Create new item based on 'inc' ore 'exp' type
            if(type === 'inc') {
                newItem = new Income(ID, des, val);
            } else if(type === 'exp') {
                newItem = new Expense(ID, des, val);
            }

            // Push it into the data structure
            data.allItems[type].push(newItem);

            // Return the created element
            return newItem;
        },
        testData: function() {
            console.log(data);
        },
    };

})();

// Testing
budgetController.testData();


// The piece of code what control the UI

var UIController = (function() {

    var elements = {
        // Allow us to store the frequently used DOM nodes
        // to follow DRY concept...
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomesPanel: '.income__list',
        expensesPanel: '.expenses__list',
    };

    return {
        getinput: function() {
            // This public funtion return an object
            // instead of return 3 different values
            return {
                type : document.querySelector(elements.inputType).value,
                description : document.querySelector(elements.inputDescription).value,
                value : parseFloat(document.querySelector(elements.inputValue).value),
            };
        },
        addListItem: function(obj, type) {
            // Add a new element to the dom
            var html, newHtml, element;

            // Create html string with placeholder text
            if(type === 'inc') {
                element = elements.incomesPanel;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                element = elements.expensesPanel;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            // Replace the placeholder text by the actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML element in the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        clearFields: function() {
            var fields, fieldsArray;

            // Select the fields
            fields = document.querySelectorAll(elements.inputDescription + ', ' +
                elements.inputValue);

            // Trick to convert a liste returned by the querySeletorAll method
            // into an array for use the array method...
            fieldsArray = Array.prototype.slice.call(fields);

            // Loop over each array element
            fieldsArray.forEach(function(current, index, array) {
                // Clear the field
                current.value = "";
            });

            // Set the focus on the first array element
            fieldsArray[0].focus();
        },
        getElements: function() {
            return elements;
        }
    };

})();


// The piece of code connect the UI and budget controlers
// IT's act like the global app controller

var controller = (function(budgetCtrl, UICtrl) {

    // A function that setting up the app eventlisteners
    var setupEventListeners = function() {
        var dom = UICtrl.getElements();
        document.querySelector(dom.inputButton).addEventListener('click', ctrlAddItem);

        // We want the same behaviour happend when the user press
        // on the Enter key
        document.addEventListener('keypress', function(event) {
            // If the keyCode is the Enter button keyCode
            if (event.keyCode === 13 || event.which === 13) {
                // Same actions that the event above...
                ctrlAddItem();
            }
        });
    };

    var ctrlAddItem = function() {
        var input, newItem;
        // 1. Get the field input data
        input = UICtrl.getinput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item in the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // Calculate and update the budget
            updateBudget();
        }
    };

    var updateBudget = function() {
        // 1. Calculate the budget

        // 2. Return the budget

        // 2. Display the budget in the UI
    };

    return {
        init: function() {
            console.log('Application started...');
            setupEventListeners();
        },
    };

})(budgetController, UIController);


// init the app and start it

controller.init();
