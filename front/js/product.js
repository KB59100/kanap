const queryString = location.search;                 
const params = new URLSearchParams(queryString);          //sert a cibler dans le HTTP l'id du kanap
const id = params.get("id");

const itemImage = document.getElementsByClassName('item__img');   //recupère l'image 

const price = document.getElementById('price');                    //le prix
const description = document.getElementById('description');         //description
const title = document.getElementById('title');                     //nom du kanap
const colors = document.getElementById('colors');                   //couleur


const localBasket = JSON.parse(window.localStorage.getItem('basket')); //récupère une valeur dans le localStorage qui s'appel basket

if (localBasket === null) {                                     //si c'est null
    window.localStorage.setItem('basket', JSON.stringify([])); //il va initialiser le premier tableau
}                                                            //avec un tableau vide comme sa on peut concat a l'interieur

//création du panier
const basket = new Map(); 

const localObj = {
    _id: null,
    img: null,
    title: null,
    qt: null,
    color: null,
    price: null,
};


//Quand un produit est ajouté au panier
const toast = `<div id="toast" class="message">votre produit a bien été ajouté au panier.</div>`;//création msg
const main = document.getElementsByClassName('limitedWidthBlockContainer');//ciblage de la classe qui permet
                                                                           //de lemanipuler

fetch(`http://localhost:3000/api/products/${id}`) //requête HTTP 
    .then(response => response.json())            //réponse en JSON
    .then((response) => {

         localObj._id = response._id;           //je recup id
         localObj.title = response.name;         //nom
         localObj.price = response.price;        //prix

        response.colors.forEach(color => {
            const option = `<option value="${color}">${color}</option>`;   //pour le choix de la couleur
            colors.insertAdjacentHTML("beforeend", option);   //beforeend pour que le choix soit en dessous du selecteur
        })

        const img = `<img src="${response.imageUrl}">`; //constance image pour récupérer L'image dans le HTML
        localObj.img = response.imageUrl;


        price.insertAdjacentHTML("afterbegin", response.price);
        description.insertAdjacentHTML("afterbegin", response.description);
        title.insertAdjacentHTML("afterbegin", response.name);
        itemImage[0].insertAdjacentHTML("afterbegin", img);

    })


const getQuantite = (qt) => {
    localObj.qt = qt.value;
};

const getColor = (color) => {
    localObj.color = color.value;
};

const saveToBasket = () => {
  localObj.price = price.innerText;
  localObj.title = title.innerText;

  //création depuis la MAP - on set le panier qui sera la conquaténation du nom,couleur, etc
  basket.set(`${localObj.title}.${localObj.color}.${localObj._id}`, {
    ...localObj, 
  });

  let ifBasketIsDefined;

  if (localBasket !== null) {         //si localBasket existe 
    ifBasketIsDefined = localBasket;  // la variable isBasketIsDefined récupère localBasket
  } else {                            //sinon ça récupère un tableau vide
    ifBasketIsDefined = [];
  }
   //On transforme la MAP en tableau
  const basketArrayFromMap = Array.from(basket); 

   //concat va retourner une nvelle instance du tableau localBasket
  const concatArray = ifBasketIsDefined.concat(basketArrayFromMap);  //je récup le tableau qui va bien

  window.localStorage.setItem("basket", JSON.stringify(concatArray)); //sauvegarde du panier dans le localStorage
                                                                      //sous format de chaine de caractère


                                //pour l'insertion du msg ajout panier                                      
  main[0].insertAdjacentHTML("afterbegin", toast);//insert l'element html dans le DOM (pour le msg ajout panier)

  setTimeout(() => {
    const toastMsg = document.getElementById("toast");
    toastMsg.remove();
  }, 3000);
};

