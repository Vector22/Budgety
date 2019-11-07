// The piece of code what control the budget

var budgetController = (function() {
    // The Expense object
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    // Add a function for calculate the percentage
    // represented by an expense in the income
    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    // Add a get percentage function to the expense object
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

    // The Income object
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Calculate the total incomes or expenses
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });
        data.totals[type] = sum;
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
        budget: 0,
        percentage: -1,
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
        deleteItem: function(type, id) {
            // As the items are not stored in the order of their index,
            // we need to know what is the index of the elt we want to delete
            // For do that, we use map to retrive the index of items table
            // indeed, we check if this index is in the returned array by map.
            var ids, index;

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calaculateBudget: function() {
            // Calculate total incomes and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget (incomes - expenses)
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of incomes that have been spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPercentages;
            allPercentages = data.allItems.exp.map(function(current) {
                return current.getPercentage();
            });

            return allPercentages;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalExp: data.totals.exp,
                totalInc: data.totals.inc,
                percentage: data.percentage,
            };
        },
        testData: function() {
            console.log(data);
        },
    };

})();

// Testing
// budgetController.testData();


// The piece of code what control the UI

var UIController = (function() {

    var elements = {
        // Allow us to store the frequently used DOM nodes
        // to follow DRY concept...
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        container: '.container',
        incomesPanel: '.income__list',
        expensesPanel: '.expenses__list',
        budgetLabel: '.budget__value',
        incomesLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        expensesPercLabel: '.item__percentage',
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

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                element = elements.expensesPanel;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            // Replace the placeholder text by the actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML element in the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        deleteListItem: function(selectorID) {
            // This is how we can properly remove
            // a javaScript element
            var elt = document.getElementById(selectorID);
            elt.parentNode.removeChild(elt);
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
        displayBudget: function(obj) {
            document.querySelector(elements.budgetLabel).textContent = obj.budget;
            document.querySelector(elements.incomesLabel).textContent = obj.totalInc;
            document.querySelector(elements.expensesLabel).textContent = obj.totalExp;

            if(obj.percentage > 0) {
                document.querySelector(elements.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(elements.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function(percentages) {
            var expLabels;
            expLabels = document.querySelectorAll(elements.expensesPercLabel);

            // Custom function like forEach but for DOM nodes list
            var nodeListForEach = function(list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };

            nodeListForEach(expLabels, function(current, index) {
                if(percentages[index] > 0 ) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }

            });
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

        // Allow user to delete an item from the income/Expense list
        document.querySelector(dom.container).addEventListener('click',
            ctrlDeleteItem);
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

            // 5. Calculate and update the budget
            updateBudget();

            // 6. Calculate and update percentages
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function(event) {
        var itemId, splitID;

        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemId) {
            splitID = itemId.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);


            // 2. delete the item from the UI
            UICtrl.deleteListItem(itemId);

            // 3. update and show the new budget
            updateBudget();

            // 4. Calculate and update percentages
            updatePercentages();
        }
    };

    var updateBudget = function() {
        var budget;
        // 1. Calculate the budget
        budgetCtrl.calaculateBudget();

        // 2. Return the budget
        budget = budgetCtrl.getBudget();

        // 3. Display the budget in the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {
        var percentages;

        // 1. Calculate the percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the news percentages
        UICtrl.displayPercentages(percentages);
    };

    return {
        init: function() {
            console.log('Application started...');
            // Initialize the budget elements
            UICtrl.displayBudget(
                {
                    budget: 0,
                    totalExp: 0,
                    totalInc: 0,
                    percentage: -1,
                });
            setupEventListeners();
        },
    };

})(budgetController, UIController);


// init the app and start it

controller.init();
