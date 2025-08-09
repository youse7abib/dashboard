

let name = document.getElementById('name')
let number = document.getElementById('mobile')
let email = document.getElementById('email')
let send = document.getElementById('send')



let mood = 'create';
let temp;


// create client

let dataClient;
if (localStorage.client != null) {
    dataClient = JSON.parse(localStorage.client)
} else {
    dataClient = [];
}

send.onclick = function () {
    let newClient = {
        name: name.value.toLowerCase(),
        number: number.value,
        email: email.value.toLowerCase(),
    }


    if (name.value != '') {
        if (mood === 'create') {
            dataClient.push(newClient);

        } else {
            dataClient[temp] = newClient;
            mood = 'create'
            send.innerHTML = 'Create';
            number.style.display = 'block';

        }
        clearClientData()
    } else {
        alert('Please enter availd value');
    }





    // save localstorage
    localStorage.setItem('client', JSON.stringify(dataClient))


    showclientdata()
}


// clear inputs

function clearClientData() {
    name.value = '';
    number.value = '';
    email.value = '';
}

// read

function showclientdata() {
    let clientable = '';
    for (let i = 0; i < dataClient.length; i++) {
        clientable +=
            `
            <tr>
                <td>${dataClient[i].name}</td>
                <td>${dataClient[i].number}</td>
                <td>${dataClient[i].email}</td>
                <td><button onclick ="updateClientData(${i})" id="update">Update</button></td>
                <td><button onclick="deleteClientData(${i})" id="delete">Delete</button></td>
            </tr>
            `
            ;
    }

    document.getElementById('tclientbody').innerHTML = clientable;

    let deleteAllClient = document.getElementById('deleteAllClient');
    if (dataClient.length > 0) {
        deleteAllClient.innerHTML = `
        <button onclick="deleteAllClient()">Delete All (${dataClient.length})</button>
        `
    } else {
        deleteAllClient.innerHTML = '';
    }

}
showclientdata()

// delete

function deleteClientData(i) {
    dataClient.splice(i, 1);
    localStorage.client = JSON.stringify(dataClient);
    showclientdata()
}
// deleteAllClient
function deleteAllClient() {
    localStorage.removeItem('client');
    dataClient.splice(0);
    showclientdata()
}


// update

function updateClientData(i) {
    name.value = dataClient[i].name;
    email.value = dataClient[i].email;
    number.value = dataClient[i].number;
    send.innerHTML = 'Update';
    mood = 'update'
    temp = i;
    scroll({
        top: 0,
        behavior: 'smooth',
    })

}


// search

let searchMoode = 'name';

function getSearchMoode(id) {

    let search = document.getElementById('seearch')

    if (id == 'searchName') {
        searchMoode = 'name';

    } else {
        searchMoode = 'email';

    }
    search.placeholder = 'Search By ' + searchMoode;
    search.focus()
    search.value = '';
    showclientdata()
}




function searchdata(value) {
    let clientable = '';


    for (let i = 0; i < dataClient.length; i++) {
        if (searchMoode == 'name') {

            if (dataClient[i].name.includes(value.toLowerCase())) {

                clientable +=
                    `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${dataClient[i].name}</td>
                            <td>${dataClient[i].email}</td>
                            <td>${dataClient[i].number}</td>
                            <td><button onclick ="updateClientData(${i})" id="update">Update</button></td>
                            <td><button onclick="deleteClientData(${i})" id="delete">Delete</button></td>
                        </tr>
                    `;

            }
        }


        else {

            if (dataClient[i].email.includes(value.toLowerCase())) {

                clientable +=
                    `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${dataClient[i].name}</td>
                            <td>${dataClient[i].email}</td>
                            <td>${dataClient[i].number}</td>
                            <td><button onclick ="updateClientData(${i})" id="update">Update</button></td>
                            <td><button onclick="deleteClientData(${i})" id="delete">Delete</button></td>
                        </tr>
                    `;

            }
        }
    }
    document.getElementById('tclientbody').innerHTML = clientable;





}









// keyboard listener
document.addEventListener('keydown', function (event) {

    // Ctrl + N = 
    if (event.ctrlKey && event.key === 'n') {
        event.preventDefault();
        clearClientData();
        document.getElementById('name').focus();
        console.log('New client shortcut activated!');
    }

    // Ctrl + S = create a new client
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        document.getElementById('send').click();
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
            deleteAllClient();
            console.log('Delete All shortcut activated!');
        }
    }

    // Escape
    if (event.key === 'Escape') {
        clearClientData();
        document.getElementById('search').value = '';
        showclientdata();
        console.log('Cancel/Clear shortcut activated!');
    }
});




