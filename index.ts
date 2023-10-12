

type Person ={
  
    "name": String,
    "height": number,
    "mass":number,
    "hair_color": String,
    "skin_color": String,
    "eye_color": String,
    "birth_year": String,
    "gender": String,
    "homeworld": String,
    "films": String[],
    "species": String[],
    "vehicles":String[],
    "starships":String[],
    "created":String,
    "edited": String,
    "url": String
};

type ServerResponse={
  count:number;
  results:Person[];
};


let todas:Person[]=[];
let displayedPeople: Person[]=[];
let sortBy:any={};

//Utils
function drawTable(people:Person[]){
  
  //Prepare table HTML  botones para filtrar <button type="button" class="btn btn-link">Link</button>
  let tableHTML: string = `
  <thead>
    <tr>
      <th><button type="button" class="btn btn-link" onclick=sortPeople("name")>Name</button></th>
      <th><button type="button" class="btn btn-link" onclick=sortPeople("birth_year")>DOB</button></th>
      <th><button type="button" class="btn btn-link" onclick=sortPeople("gender")>Gender</button></th>
      <th><button type="button" class="btn btn-link" onclick=sortPeople("url")>URL</button></th>
    </tr>
  </thead>
  <tbody>
  `;  // Loop thru all products to generate rows of the table
  people.forEach((p: Person) => {
    tableHTML += `<tr></td><td>${p.name}</td><td>${p.birth_year}</td><td>${p.gender}</td><td>${p.url}</td></tr>`;
  });
  // Close table body
  tableHTML += '</tbody>';
  // Grab table element to set its inner HTML
  document.querySelector('#tableElement')!.innerHTML = tableHTML;
}

//handless
function paginateProducts(page:number){
  fetch(`https://swapi.dev/api/people/?page=${page}`)
  .then(res => res.json())
  .then((data:ServerResponse) => {
    displayedPeople=data.results;
    drawTable(data.results);
  });
}
  //Para filtrar
  function filterPeople(value:String){
    const filteredPeople=displayedPeople.filter((p:Person)=>p.name.toLowerCase().includes(value.toLowerCase())  //en filteredpeople (que es otra variable) se van a devolver el conjunto de personas  que se estan mostrando (displayedPeople) pero ordenadas 
    ||p.birth_year.toLowerCase().includes(value.toLowerCase())  //el filter tomara todos los elementos del array y les hara la comparacion con el valor que esta buscando y si cumple lo agrega al nuevo array con los demas que cumplen
    ||p.gender.toLowerCase().includes(value.toLowerCase())
    ||p.url.toLowerCase().includes(value.toLowerCase()) 
    );
    drawTable(filteredPeople);
  }

  function sortPeople(prop:string){
    if(sortBy[prop]){
        if (sortBy[prop]==='asc'){
          sortBy[prop]='desc';
        }else if(sortBy[prop]==='desc'){
          sortBy[prop]='null';
        }
    }else{
      sortBy[prop]='asc';
    
    }
  


    const sortedPeople= displayedPeople.toSorted((a:Person,b:Person)=>{
      if (sortBy[prop] === 'asc') {
        return a[prop]> b[prop] ? 1 : a[prop]< b[prop]?-1 :0;
      } else if (sortBy[prop] === 'desc') {
        return a[prop] < b[prop] ? 1 : a[prop] > b[prop] ? -1 : 0;
      } else {
        return displayedPeople;
      }
    });
    drawTable(sortedPeople);
  }




fetch(`https://swapi.dev/api/people`)
  .then(res => res.json())
  .then((data:ServerResponse) => {
    displayedPeople=data.results;
      //invocamos a drawTabla con los 10 iniciales 
      drawTable(data.results);
     

    const pages = Math.ceil(data.count / 10 );
    const paginationElement : any= document.querySelector('#paginationElement');
    let pagesHTLM='';

    for (let index = 1; index <= pages; index++) {
      pagesHTLM +=`<li class="page-item"><a class="page-link" href="#" onClick="paginateProducts(${index})">${index}</a></li>`;
    }
    paginationElement.innerHTML=pagesHTLM
    //Hide spinner
    const spinnerElement: HTMLElement = document.querySelector('#spinnerContainer')!;
    spinnerElement.style.display = 'none';
  });