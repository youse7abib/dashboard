let title = document.getElementById('title')
let price = document.getElementById('price')
let taxes = document.getElementById('taxes')
let ads = document.getElementById('ads')
let discount = document.getElementById('discount')
let total = document.getElementById('total')
let count = document.getElementById('count')
let category = document.getElementById('category')
let submit = document.getElementById('submit')



let mod = 'create';
let tmp;


// get total
function getTotal() {
    if (price.value != '') {
        let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
        total.innerHTML = result;
        total.style.backgroundColor = '#040'
    }
    else {
        total.innerHTML = '';
        total.style.backgroundColor = '#a00d02'
    }

}

// create product

let dataPro;
if (localStorage.product != null) {
    dataPro = JSON.parse(localStorage.product)
} else {
    dataPro = [];
}

submit.onclick = function () {
    let newPro = {
        title: title.value.toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value.toLowerCase(),
    }




    if (title.value != '' && price.value != '' && newPro.count <= 100) {
        if (mod === 'create') {
            // count
            if (newPro.count > 1) {
                for (let i = 0; i < newPro.count; i++) {
                    dataPro.push(newPro);
                }
            } else {
                dataPro.push(newPro);
            }
        } else {
            dataPro[tmp] = newPro;
            mod = 'create'
            submit.innerHTML = 'Create';
            count.style.display = 'block';

        }
        clearData()
    } else {
        alert('Please enter availd value |  count <= 100');
    }





    // save localstorage
    localStorage.setItem('product', JSON.stringify(dataPro))


    showData()
}


// clear inputs

function clearData() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = '';
    count.value = '';
    category.value = '';
}

// read

function showData() {

    getTotal();
    let table = '';
    for (let i = 0; i < dataPro.length; i++) {
        table +=
            `
            <tr>
                <td>${i + 1}</td>
                <td>${dataPro[i].title}</td>
                <td>${dataPro[i].price}</td>
                <td>${dataPro[i].taxes}</td>
                <td>${dataPro[i].ads}</td>
                <td>${dataPro[i].discount}</td>
                <td>${dataPro[i].total}</td>
                <td>${dataPro[i].category}</td>
                <td><button onclick ="updateData(${i})" id="update">Update</button></td>
                <td><button onclick="deleteData(${i})" id="delete">Delete</button></td>
            </tr>
            `
            ;
    }

    document.getElementById('tbody').innerHTML = table;

    let deleteAll = document.getElementById('deleteAll');
    if (dataPro.length > 0) {
        deleteAll.innerHTML = `
        <button onclick="deleteAll()">Delete All (${dataPro.length})</button>
        `
    } else {
        deleteAll.innerHTML = '';
    }

}
showData()

// delete

function deleteData(i) {
    dataPro.splice(i, 1);
    localStorage.product = JSON.stringify(dataPro);
    showData()
}
// deleteAll
function deleteAll() {
    localStorage.removeItem('product');
    dataPro.splice(0);
    showData()
}


// update

function updateData(i) {
    title.value = dataPro[i].title;
    price.value = dataPro[i].price;
    taxes.value = dataPro[i].taxes;
    ads.value = dataPro[i].ads;
    discount.value = dataPro[i].discount;
    category.value = dataPro[i].category;
    count.style.display = 'none';
    submit.innerHTML = 'Update';
    getTotal()
    mod = 'update'
    tmp = i;
    scroll({
        top: 0,
        behavior: 'smooth',
    })

}


// search

let searchMode = 'title';

function getSearchMode(id) {

    let search = document.getElementById('search')

    if (id == 'searchTitle') {
        searchMode = 'title';

    } else {
        searchMode = 'category';

    }
    search.placeholder = 'Search By ' + searchMode;
    search.focus()
    search.value = '';
    showData()
}




function searchData(value) {
    let table = '';


    for (let i = 0; i < dataPro.length; i++) {
        if (searchMode == 'title') {

            if (dataPro[i].title.includes(value.toLowerCase())) {

                table +=
                    `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${dataPro[i].title}</td>
                            <td>${dataPro[i].price}</td>
                            <td>${dataPro[i].taxes}</td>
                            <td>${dataPro[i].ads}</td>
                            <td>${dataPro[i].discount}</td>
                            <td>${dataPro[i].total}</td>
                            <td>${dataPro[i].category}</td>
                            <td><button onclick ="updateData(${i})" id="update">Update</button></td>
                            <td><button onclick="deleteData(${i})" id="delete">Delete</button></td>
                        </tr>
                    `;

            }
        }


        else {

            if (dataPro[i].category.includes(value.toLowerCase())) {

                table +=
                    `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${dataPro[i].title}</td>
                            <td>${dataPro[i].price}</td>
                            <td>${dataPro[i].taxes}</td>
                            <td>${dataPro[i].ads}</td>
                            <td>${dataPro[i].discount}</td>
                            <td>${dataPro[i].total}</td>
                            <td>${dataPro[i].category}</td>
                            <td><button onclick ="updateData(${i})" id="update">Update</button></td>
                            <td><button onclick="deleteData(${i})" id="delete">Delete</button></td>
                        </tr>
                    `;

            }
        }
    }
    document.getElementById('tbody').innerHTML = table;





}









// keyboard listener
document.addEventListener('keydown', function (event) {

    // Ctrl + N = 
    if (event.ctrlKey && event.key === 'n') {
        event.preventDefault();
        clearData();
        document.getElementById('title').focus();
        console.log('New Product shortcut activated!');
    }

    // Ctrl + S = create a new product
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        document.getElementById('submit').click();
        console.log('Save shortcut activated!');
    }

    // Ctrl + F = search
    if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        document.getElementById('search').focus();
        console.log('Search shortcut activated!');
    }

    // Delete 
    if (event.key === 'Delete') {
        if (confirm('')) {
            deleteAll();
            console.log('Delete All shortcut activated!');
        }
    }

    // Escape
    if (event.key === 'Escape') {
        clearData();
        document.getElementById('search').value = '';
        showData();
        console.log('Cancel/Clear shortcut activated!');
    }
});



//-------------------------------------------------------------
