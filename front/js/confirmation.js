//const orderId = document.getElementById("orderId"); //récupération de l'orderId
//orderId.innerText = localStorage.getItem("orderId"); //o lui ajoute avec le iinertext le orderId

const queryStrings = location.search;
const param = new URLSearchParams(queryStrings);
const orderid = param.get("orderId");

const orderElement = document.getElementById("orderId");
orderElement.innerText = orderid;
