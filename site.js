// Esta função deve ser adicionada no início do seu código JavaScript
document.querySelector(".cart-container").addEventListener("click", function(event) {
    var targetElement = event.target;
    
    // Verifique se o elemento clicado é um item do carrinho
    while (targetElement != null && !targetElement.classList.contains("cart-item")) {
        targetElement = targetElement.parentElement;
    }

    if (targetElement != null) {
        openEditPopup(targetElement);
    }
});


function openPopup(e) {
  var t = e.target.closest(".product"),
      n = e.target.getAttribute("data-color"),
      r = e.target.getAttribute("data-price"),
      o = document.getElementById("popup");

  o.getElementsByClassName("popup-product-name")[0].innerText = t.getElementsByClassName("product-name")[0].innerText;
  o.getElementsByClassName("popup-color")[0].innerText = n + ": €" + r;
  
  var l = t.getElementsByTagName("img")[0];
  document.getElementById("popup-product-image").src = l.src;

  var d = o.getElementsByClassName("popup-sizes")[0];
  while (d.firstChild) {
    d.removeChild(d.firstChild);
  }

  var a = t.querySelectorAll('.sizes[data-color="' + n + '"] > .size');
  for (var s = 0; s < a.length; s++) {
    var p = a[s].cloneNode(true);
    var c = p.querySelectorAll(".measure-container .measure");
    
    for (var m = 0; m < c.length; m++) {
      var measureContainer = c[m].parentNode;

      // Pega o input existente
      var y = measureContainer.querySelector(".measure-quantity");

      // Criar e configurar os botões
      var decreaseButton = document.createElement("button");
      decreaseButton.innerText = "-";
      decreaseButton.className = "decrease-button";

      var increaseButton = document.createElement("button");
      increaseButton.innerText = "+";
      increaseButton.className = "increase-button";
      
      // Inserir os botões antes e depois do input
      measureContainer.insertBefore(decreaseButton, y);
      measureContainer.insertBefore(increaseButton, y.nextSibling);

decreaseButton.addEventListener("click", function(event) {
  let inputElement = event.target.parentNode.querySelector(".measure-quantity");
  let currentValue = parseInt(inputElement.value, 10);
  if (isNaN(currentValue)) {
    currentValue = 0;
  }
  if (currentValue > 0) {
    inputElement.value = currentValue - 1;
  }
});

increaseButton.addEventListener("click", function(event) {
  let inputElement = event.target.parentNode.querySelector(".measure-quantity");
  let currentValue = parseInt(inputElement.value, 10);
  if (isNaN(currentValue)) {
    currentValue = 0;
  }
  inputElement.value = currentValue + 1;
});

    }
    
    d.appendChild(p);
  }
  
  o.style.display = "block";
}



let freight = 21.0; // define o valor do frete
let selectedSize = null,
  initialViewportHeight = window.innerHeight;
let itemsInCart = 0;

window.addEventListener("DOMContentLoaded", e => {
  let cartItems = JSON.parse(getItemWithExpiry("cart") || "[]");
  let total = freight; // Inicializa o total com o valor do frete

  if (cartItems.length > 0) {
    let l = document.getElementById("cart");
    for (let item of cartItems) {
      let d = document.createElement("div");
      d.innerHTML = item;
      let s = d.firstChild;
      s.querySelector("button").addEventListener("click", removeFromCart);
      l.appendChild(s);
      total += parseFloat(s.querySelector(".product-info > span").innerText.match(/€(\d+(\.\d{1,2})?) \* (\d+) unid = €(\d+(\.\d{1,2})?)/)[4]);
    }

    document.getElementById("total").innerText = total.toFixed(2);
  } else {
    document.getElementById("total").innerText = freight.toFixed(2);
  }

  updateCartCount();

  // Configuração do dropdown customizado
  document.getElementById("active-category-title").addEventListener("click", function() {
    const dropdownContent = document.getElementById("custom-dropdown");
    dropdownContent.style.display = dropdownContent.style.display === "flex" ? "none" : "flex";
  });

  document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", function() {
      setActiveCategory(this.getAttribute("data-category"));
      document.getElementById("custom-dropdown").style.display = "none";
    });

document.querySelectorAll("li[id$='-category']").forEach(item => {
  item.addEventListener("click", function() {
    let category = this.id.replace("-category", "");
    setActiveCategory(category);
  });
});


  });

  // Carrega a categoria "Básicos" como padrão
  loadCategory('basicos');
  var activeCategory = "basicos";

  document.getElementById("active-category-title").innerText = getCategoryName(activeCategory);

function setActiveCategory(category) {
  console.log("Set active category chamado com: ", category); // log para debug
  activeCategory = category;
  let categoryName = getCategoryName(activeCategory);
  const titleElement = document.getElementById("active-category-title");
  if (titleElement) {
    titleElement.innerText = categoryName;
  }
  loadCategory(activeCategory);  // Chama a função para carregar os produtos da nova categoria
}





  function getCategoryName(categoryId) {
    switch (categoryId) {
      case "basicos": return "Básicos";
      case "nariz": return "Nariz";
      case "septo": return "Septo";
      case "orelha": return "Orelha";
      case "sobrancelha": return "Sobrancelha";
      case "umbigo": return "Umbigo";
      case "mamilo": return "Mamilo";
      default: return "Produtos";
    }
  }
});

// Sua função loadCategory permanece inalterada
function loadCategory(categoryName) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `${categoryName}.html`, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      document.querySelector('.product-container').innerHTML = xhr.responseText;
      let colorButtons = document.getElementsByClassName("color");
      for(let i = 0; i < colorButtons.length; i++) {
        colorButtons[i].addEventListener("click", openPopup);
      }
    }
  };

  xhr.send();
}




function addToCartFromPopup() {
  var totalValue = parseFloat(document.getElementById("total").innerText);
  var popup = document.getElementById("popup");
  var productName = popup.querySelector(".popup-product-name").innerText;
  var color = popup.querySelector(".popup-color").innerText.split(":")[0].trim();
  var productImage = popup.querySelector(".popup-product-image").src;
  var measures = popup.querySelectorAll(".measure");

  // Inicialize cartItems como um array vazio
  let cartItems = JSON.parse(getItemWithExpiry("cart") || "[]");

  for (var i = 0; i < measures.length; i++) {
      var price = parseFloat(measures[i].getAttribute("data-price"));
      var quantity = parseInt(measures[i].parentNode.querySelector(".measure-quantity").value, 10);

      if (quantity > 0) {
          var sizeText = measures[i].innerText;
          var sizeName = measures[i].closest(".size").querySelector("h4").innerText;

          // Encontrar o índice do produto existente, se houver
          var existingIndex = cartItems.findIndex(p => {
              var div = document.createElement('div');
              div.innerHTML = p;
              return div.firstChild.querySelector(".product-info").innerText.includes(productName + " " + color + " | " + sizeName + " " + sizeText);
          });

          if (existingIndex >= 0) {
              // Atualizar a quantidade e remover o item existente do array cartItems
              var div = document.createElement('div');
              div.innerHTML = cartItems[existingIndex];
              var existingQty = parseInt(div.firstChild.querySelector(".product-info > span").innerText.split("*")[1].split("unid")[0].trim());
              
              // Atualizar o totalValue de acordo com a quantidade anterior
              totalValue -= price * existingQty;

              quantity += existingQty;
              cartItems.splice(existingIndex, 1);
          }

          // Atualizar o totalValue de acordo com a nova quantidade
          totalValue += price * quantity;

// Dentro da sua função addToCartFromPopup
var uniqueIdentifier = productName + "_" + color + "_" + sizeName + "_" + sizeText;

var productElement = document.createElement("p");
productElement.className = "cart-item";
productElement.setAttribute("data-id", uniqueIdentifier);



          var imgElement = document.createElement("img");
          imgElement.src = productImage;
          productElement.appendChild(imgElement);

          var productInfo = document.createElement("span");
          productInfo.className = "product-info";
          productInfo.innerText = productName + " " + color + " | " + sizeName + " " + sizeText;
          var productPrice = document.createElement("span");
          productPrice.innerText = "€" + price.toFixed(2) + " * " + quantity + " unid = €" + (price * quantity).toFixed(2);
          productInfo.appendChild(document.createElement("br"));
          productInfo.appendChild(productPrice);
          productElement.appendChild(productInfo);

          var removeButton = document.createElement("button");
          removeButton.innerText = "X";
          removeButton.addEventListener("click", removeFromCart);
          productElement.appendChild(removeButton);

// Adicionar evento de clique para abrir o modal de edição
productElement.className = "cart-item";
productElement.addEventListener("click", function() {
  openEditPopup(this);
});

          // Adicionar o novo elemento ao array cartItems
          cartItems.push(productElement.outerHTML);
// Adicione esta linha
updateClickableItems();

      }
  }

// Atualize o localStorage e o carrinho no DOM
document.getElementById("total").innerText = totalValue.toFixed(2);
setItemWithExpiry("cart", JSON.stringify(cartItems));

var cart = document.getElementById("cart");
cart.innerHTML = "";  // Limpa o carrinho para evitar duplicação de elementos
for (var i = 0; i < cartItems.length; i++) {
   var div = document.createElement('div');
   div.innerHTML = cartItems[i];
   div.firstChild.querySelector("button").addEventListener("click", removeFromCart);
   cart.appendChild(div.firstChild);
}
var B = document.createElement("div");
B.style.position = "absolute";
B.style.top = "0";
B.style.left = "10px";
B.style.color = "white";
B.style.padding = "5px";
B.style.zIndex = "100";
B.className = "added-banner";
B.innerText = "Adicionado";

var h = document.querySelector(`img[src="${productImage}"]`).closest(".product"); // Note que substituí "r" por "productImage", que é o nome da variável do seu código atual
h.style.position = "relative";
h.appendChild(B);

closePopup();
updateCartCount();
}
function updateCartCount() {
const cart = document.getElementById("cart");
const cartCount = document.querySelector(".cart-count");
cartCount.innerText = cart.children.length;
}
function updateClickableItems() {
  // Pega todos os elementos de produto do carrinho
  var cartItems = document.querySelectorAll(".cart-item");

  // Adiciona um evento de clique a cada item do carrinho
  cartItems.forEach(function(item) {
    item.removeEventListener("click", function() { openEditPopup(this); });  // Remove o evento existente para evitar múltiplas chamadas
    item.addEventListener("click", function() { openEditPopup(this); });  // Adiciona o novo evento
  });
}


function removeFromCart(e) {
  var t = e.target.parentNode,
    n = t.querySelector("span").innerText.match(/€(\d+(\.\d{1,2})?) \* (\d+) unid = €(\d+(\.\d{1,2})?)/),
    r = parseFloat(n[1]),
    o = parseInt(n[3]), // Declare 'o' before using it
    l = document.getElementById("total"),
    a = parseFloat(l.innerText),
    c = document.getElementById("cart");
  a -= r * o, l.innerText = a.toFixed(2), t.remove();
  itemsInCart -= o; // Now decrement 'itemsInCart' by 'o'

    // Aqui é a parte que remove o item do armazenamento local
let E = JSON.parse(getItemWithExpiry("cart") || "[]");
E.splice(E.indexOf(t.outerHTML), 1);
setItemWithExpiry("cart", JSON.stringify(E));

updateCartCount();
}

window.addEventListener("resize", function () {
  let e;
  (initialViewportHeight - window.innerHeight) / initialViewportHeight * 100 > 20 ? document.body.classList.add("keyboard-open") : document.body.classList.remove("keyboard-open");
}), document.addEventListener("click", e => {
  e.target.classList.contains("measure") && (selectedSize && selectedSize.classList.remove("selected"), e.target.classList.add("selected"), selectedSize = e.target);
}), document.getElementById("popup-add").addEventListener("click", addToCartFromPopup);
for (var colorButtons = document.getElementsByClassName("color"), i = 0; i < colorButtons.length; i++) colorButtons[i].addEventListener("click", openPopup);
function closePopup() {
  document.getElementById("popup").style.display = "none";
}
function getCartItemsText() {
  var cartElements = document.getElementById("cart").children;
  var cartText = "";
  for (var i = 0; i < cartElements.length; i++) {
      let productInfo = cartElements[i].querySelector(".product-info").innerText;
      // We find the last line which contains the price calculation.
      let lastLineStart = productInfo.lastIndexOf("\n") + 1;
      let productText = productInfo.substring(0, lastLineStart);
      let productPriceLine = productInfo.substring(lastLineStart);
      // Now we can separate the price part to apply the bold effect
      let productPriceParts = productPriceLine.split("=");
      let productPrice = productPriceParts[0] + "=*" + productPriceParts[1].trim() + "*";
      cartText += productText + productPrice + "\n\n";
  }
  return cartText;
  
}

document.getElementById("popup-close").addEventListener("click", closePopup);
document.getElementById("whatsappButton").addEventListener("click", function () {
  var cartText = getCartItemsText();
  var totalText = "Total: €" + document.getElementById("total").innerText;
  var freightText = "Frete: €" + freight.toFixed(2); // Assuming "freight" is a global variable
  var message = encodeURIComponent("Resumo da Compra:\n" + cartText + freightText + "\n" + totalText);
  var totalText = "*Total: €" + document.getElementById("total").innerText + "*";
  var freightText = "Frete: *€" + freight.toFixed(2) + "*"; // Assuming "freight" is a global variable
  var message = encodeURIComponent("*Resumo da Compra:*\n\n" + cartText + freightText + "\n\n" + totalText);
  window.open(`https://wa.me/393898986018?text=${message}`);
});
document.getElementById("copyButton").addEventListener("click", function () {
  var cartText = getCartItemsText();
  var totalText = "*Total: €" + document.getElementById("total").innerText + "*";
  var freightText = "Frete: *€" + freight.toFixed(2) + "*"; // Assuming "freight" is a global variable
  var copiedText = "*Resumo da Compra:*\n\n" + cartText + freightText + "\n\n" + totalText;
  navigator.clipboard.writeText(copiedText).then(() => {
      var copyConfirmation = document.getElementById("copiedText");
      copyConfirmation.innerText = "Copiado!";
      copyConfirmation.style.visibility = "visible";
      setTimeout(function () {
          copyConfirmation.style.visibility = "hidden";
      }, 3e3);
  }).catch(err => {
      console.error('Erro ao copiar texto: ', err);
  });
});

document.getElementById("clearCartButton").addEventListener("click", function () {
  if (confirm("Você deseja remover todos os produtos do carrinho?")) {
    var cart = document.getElementById("cart");
    while (cart.firstChild) {
      cart.firstChild.remove();
    }
    document.getElementById("total").innerText = freight.toFixed(2); // Define o total como o valor do frete
    localStorage.removeItem("cart");
    itemsInCart = 0; // Reset itemsInCart to 0
  }
});  

function setItemWithExpiry(key, value, ttl = 4 * 60 * 60 * 1000) {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl
  };
  localStorage.setItem(key, JSON.stringify(item));
}
function getItemWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}

document.getElementById("menuIcon").addEventListener("click", function() {
  document.getElementById("sideMenu").style.width = "90%";
});

document.getElementById("closeButton").addEventListener("click", function() {
  document.getElementById("sideMenu").style.width = "0";
});

// Suponha que os IDs dos botões de categoria terminem com "-category"
const categoryButtons = document.querySelectorAll("[id$='-category']");

// Para cada botão encontrado, adiciona um evento de clique
categoryButtons.forEach((button) => {
  button.addEventListener("click", function() {
      const categoryName = button.id.replace("-category", "");  // Extrai o nome da categoria do ID
      loadCategory(categoryName);
      document.getElementById("sideMenu").style.width = "0";
  });
});
function openEditPopup(productElement) {
  var popup = document.getElementById("edit-product-popup");
  var productName = productElement.querySelector(".product-info").innerText.split(" | ")[0];
  var colorSize = productElement.querySelector(".product-info").innerText.split(" | ")[1];
  var color = colorSize.split(" ")[0];
  var size = colorSize.split(" ")[2];
  var quantity = productElement.querySelector(".product-info > span").innerText.split("*")[1].split("unid")[0].trim();

  popup.querySelector(".popup-product-name").innerText = productName;
  popup.querySelector(".popup-color").innerText = "Cor: " + color;
  popup.querySelector(".popup-size").innerText = "Tamanho: " + size;
  document.getElementById("edit-quantity").value = quantity;
  
  popup.style.display = "block";
  document.getElementById("edit-product-popup").style.display = "block";
}

function closeEditPopup() {
  document.getElementById("edit-product-popup").style.display = "none";
}

function confirmEdit() {
  var popup = document.getElementById("edit-product-popup");
  var quantity = parseInt(document.getElementById("edit-quantity").value);
  // Aqui você atualiza a quantidade do produto no resumo e no cache.
  // Código para atualizar a linha do produto e o cache vai aqui.
  popup.style.display = "none";
}
document.addEventListener("click", function(event) {
  if (event.target.closest(".cart-item")) {
    const itemId = event.target.closest(".cart-item").getAttribute("data-id");
    openEditPopup(itemId);
  }
});
