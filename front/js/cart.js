const cartItem = document.getElementById('cart__items');
const cartBasket = JSON.parse(window.localStorage.getItem('basket'));//récupère les infos du panier 
const firstname = document.getElementById('firstName');
const lastname = document.getElementById('lastName');
const city = document.getElementById("city");
const address = document.getElementById("address");
const email = document.getElementById("email");
const lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
const cityErrorMsg = document.getElementById('cityErrorMsg');
const emailErrorMsg = document.getElementById("emailErrorMsg");
const submit = document.getElementById('order');
const totalPrice = document.getElementById('totalPrice');
let total = 0;


//pour que le formulaire ne senvoi pas si le bouton est a desabled
submit.setAttribute("disabled", "disabled");//sur submit un attribute qui est disabled avec valeur disabled
                                            

//va récupérer la value du tableau
cartBasket.forEach((item, index) => {

    // Création de la card qui sera inséré en html
    const card = ` 
     <article class="cart__item" data-id="{product-ID}" data-color="{product-color}"> 
                <div class="cart__item__img">
                  <img src="${item[1].img}">
                </div>

                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${item[1].title}</h2>
                    <p>${item[1].color}</p>
                    <p>${item[1].price}</p>
                </div>
                 <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>                                                                           
                      <input id="qt_${index}" type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item[1].qt}">
                    </div></br>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem" onclick="deleteItemFromBasket(${index})">Supprimer</p>
                    </div>
                  </div>
     </article>
                `;

    //Récupère le total qui est initialisé a 0 a chaque fois (en base 10)            
    total = parseInt(total, 10) + (parseInt(item[1].price, 10) * parseInt(item[1].qt, 10));

    cartItem.insertAdjacentHTML("afterbegin", card); //pour insérer le code html



    const elem = document.getElementById(`qt_${index}`); //ajout de id"qt" dans notre element html pour le cibler
                                                        //et pouvoir le récupérer

    elem.addEventListener('change', (event) => {          
        cartBasket[index][1].qt = event.currentTarget.value; //récupère la qt du panier+mise a jour de la quantité
        window.localStorage.setItem('basket', JSON.stringify(cartBasket)); //Mise a jour dans le panier total
        window.location.reload(); //rafraichit la page
    });

})

//insérer la card dans le html
const totalCard = `<span>${total}</span>`;
totalPrice.insertAdjacentHTML('afterbegin', totalCard);

//pour supprimer élément du panier
const deleteItemFromBasket = (index) => {  //fonction qui va récupérer l'index
    cartBasket.splice(index, 1);           //il va supprimer l'index 1
    window.localStorage.setItem('basket', JSON.stringify(cartBasket)); //mise a jour du panier
    window.location.reload();              //rafraichissement de la page
}


//Pour le prénom du formulaire Fonction sur le "change qui prend en param l'evenement"
firstname.addEventListener("change", (Event) => {
    firstNameErrorMsg.insertAdjacentHTML("afterbegin", "");
    if (isNaN(Event.currentTarget.value) === false) {           //Si is not a number est faux donc c'est un nombre alors message d'erreur
        const errors = `<p>le prénom est une chaine de charactère</p>`;
        firstNameErrorMsg.insertAdjacentHTML("afterbegin", errors); //inserion html
    }
});


//Pour le nom dans le formulaire
lastname.addEventListener("change", (Event) => {
    lastNameErrorMsg.insertAdjacentHTML("afterbegin", "");
    if (isNaN(Event.currentTarget.value) === false) {
        const errors = `<p>le nom est une chaine de charactère</p>`;
        lastNameErrorMsg.insertAdjacentHTML("afterbegin", errors);
    }
});


//pour la ville dans le formulaire
city.addEventListener("change", (Event) => {
    cityErrorMsg.insertAdjacentHTML("afterbegin", "");
    if (isNaN(Event.currentTarget.value) === false) {
        const errors = `<p>la ville est une chaine de charactère</p>`;
        cityErrorMsg.insertAdjacentHTML("afterbegin", errors);
    }
});

//pour l'email dans le formulaire
email.addEventListener("change", (Event) => {
    emailErrorMsg.insertAdjacentHTML("afterbegin", "");
    submit.removeAttribute("disabled");
    if (!/(.+)@(.+){2,}\.(.+){2,}/.test(email.value)) {
        const errors = `<p>Mettez une adresse email valide</p>`;
        emailErrorMsg.insertAdjacentHTML("afterbegin", errors);
        submit.setAttribute("disabled", "disabled");
    }
});

submit.addEventListener("click", (event) => {
    event.preventDefault();

    const products = []

    cartBasket.forEach((item) => {
        products.push(item[1])
    })

    const order = {
        contact: {
            firstName: firstname.value,  //récupère la valeur de l'input
            lastName: lastname.value,
            address: address.value,
            city: city.value,
            email: email.value
        },
        products
    }

    // -------  Envoi de la requête POST au back-end --------
    const options = {
        method: "POST",
        body: JSON.stringify(order),
        headers: {"Content-Type": "application/json"},
    };

    
    // Envoie de la requête et changera de page avec un localStorage qui ne contiendra plus que l'order id.
   fetch("http://localhost:3000/api/products/order", options)
     .then((response) => response.json())
     .then((data) => {
       localStorage.removeItem("basket");
       window.location.href = `../html/confirmation.html?orderId=${data.orderId}`;
     })
     .catch((error) => {
       console.log(error);
     });

});








