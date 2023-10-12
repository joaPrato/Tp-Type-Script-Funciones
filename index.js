var todas = [];
var displayedPeople = [];
var sortBy = {};
//Utils
function drawTable(people) {
    //Prepare table HTML  botones para filtrar <button type="button" class="btn btn-link">Link</button>
    var tableHTML = "\n  <thead>\n    <tr>\n      <th><button type=\"button\" class=\"btn btn-link\" onclick=sortPeople(\"name\")>Name</button></th>\n      <th><button type=\"button\" class=\"btn btn-link\" onclick=sortPeople(\"birth_year\")>DOB</button></th>\n      <th><button type=\"button\" class=\"btn btn-link\" onclick=sortPeople(\"gender\")>Gender</button></th>\n      <th><button type=\"button\" class=\"btn btn-link\" onclick=sortPeople(\"url\")>URL</button></th>\n    </tr>\n  </thead>\n  <tbody>\n  "; // Loop thru all products to generate rows of the table
    people.forEach(function (p) {
        tableHTML += "<tr></td><td>".concat(p.name, "</td><td>").concat(p.birth_year, "</td><td>").concat(p.gender, "</td><td>").concat(p.url, "</td></tr>");
    });
    // Close table body
    tableHTML += '</tbody>';
    // Grab table element to set its inner HTML
    document.querySelector('#tableElement').innerHTML = tableHTML;
}
//handless
function paginateProducts(page) {
    fetch("https://swapi.dev/api/people/?page=".concat(page))
        .then(function (res) { return res.json(); })
        .then(function (data) {
        displayedPeople = data.results;
        drawTable(data.results);
    });
}
//Para filtrar
function filterPeople(value) {
    var filteredPeople = displayedPeople.filter(function (p) { return p.name.toLowerCase().includes(value.toLowerCase()) //en filteredpeople (que es otra variable) se van a devolver el conjunto de personas  que se estan mostrando (displayedPeople) pero ordenadas 
        || p.birth_year.toLowerCase().includes(value.toLowerCase()) //el filter tomara todos los elementos del array y les hara la comparacion con el valor que esta buscando y si cumple lo agrega al nuevo array con los demas que cumplen
        || p.gender.toLowerCase().includes(value.toLowerCase())
        || p.url.toLowerCase().includes(value.toLowerCase()); });
    drawTable(filteredPeople);
}
function sortPeople(prop) {
    if (sortBy[prop]) {
        if (sortBy[prop] === 'asc') {
            sortBy[prop] = 'desc';
        }
        else if (sortBy[prop] === 'desc') {
            sortBy[prop] = 'null';
        }
    }
    else {
        sortBy[prop] = 'asc';
    }
    var sortedPeople = displayedPeople.toSorted(function (a, b) {
        if (sortBy[prop] === 'asc') {
            return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
        }
        else if (sortBy[prop] === 'desc') {
            return a[prop] < b[prop] ? 1 : a[prop] > b[prop] ? -1 : 0;
        }
        else {
            return displayedPeople;
        }
    });
    drawTable(sortedPeople);
}
fetch("https://swapi.dev/api/people")
    .then(function (res) { return res.json(); })
    .then(function (data) {
    displayedPeople = data.results;
    //invocamos a drawTabla con los 10 iniciales 
    drawTable(data.results);
    var pages = Math.ceil(data.count / 10);
    var paginationElement = document.querySelector('#paginationElement');
    var pagesHTLM = '';
    for (var index = 1; index <= pages; index++) {
        pagesHTLM += "<li class=\"page-item\"><a class=\"page-link\" href=\"#\" onClick=\"paginateProducts(".concat(index, ")\">").concat(index, "</a></li>");
    }
    paginationElement.innerHTML = pagesHTLM;
    //Hide spinner
    var spinnerElement = document.querySelector('#spinnerContainer');
    spinnerElement.style.display = 'none';
});
