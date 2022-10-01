const items = document.getElementById('items');  // récupère dans le DOM l'id 'items'

fetch('http://localhost:3000/api/products') //appel l'url voulu
    .then(response => response.json())      //me retourne une réponse json
    .then((response) => {
        response.forEach((item) => {        //je récupère chaque item l'un après l'autre en ciblant id image etc...
            console.log(item)
            const card = `                    
              <a href="./product.html?id=${item._id}">   
            <article>
              <img src="${item.imageUrl}">
              <h3 class="productName">${item.name}</h3>
              <p class="productDescription">${item.description}</p>
            </article>
          </a> 
        `
            items.insertAdjacentHTML('afterbegin', card); // après le commencement de la div insertion de la card
          
        });
    });