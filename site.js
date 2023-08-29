function openPopup(e) {
    var t = e.target.closest(".product"),
      n = e.target.getAttribute("data-color"),
      r = e.target.getAttribute("data-price"),
      o = document.getElementById("popup");
    o.getElementsByClassName("popup-product-name")[0].innerText = t.getElementsByClassName("product-name")[0].innerText, o.getElementsByClassName("popup-color")[0].innerText = n + ": €" + r;
    var l = t.getElementsByTagName("img")[0];
    document.getElementById("popup-product-image").src = l.src;
    for (var a = t.querySelectorAll('.sizes[data-color="' + n + '"] > .size'), d = o.getElementsByClassName("popup-sizes")[0]; d.firstChild;) d.removeChild(d.firstChild);
    for (var s = 0; s < a.length; s++) {
      for (var p = a[s].cloneNode(!0), c = p.querySelectorAll(".measure-container .measure"), m = 0; m < c.length; m++) {
        var u = c[m].nextSibling;
        if (!u || "input" !== u.nodeName.toLowerCase()) {
          var y = document.createElement("input");
          y.type = "number", y.min = "0", y.className = "measure-quantity", c[m].parentNode.insertBefore(y, c[m].nextSibling);
        }
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
    let itemsInCart = cartItems.length;
  
    if (cartItems.length > 0) {
      var o;
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
      // se o carrinho está vazio, o total deve ser o valor do frete
      document.getElementById("total").innerText = freight.toFixed(2);
    }
  
    updateCartCount();
  
    document.getElementById('nariz-category').addEventListener('click', function() {
      loadCategory('nariz');
    });
  
    // Adicionando event delegation ao 'product-container'
    document.querySelector('.product-container').addEventListener('click', function(event) {
      const target = event.target;
      
      // Substitua 'classe-do-botao-com-preco' pela classe real que identifica o botão em seus produtos
      let btn = target.closest('.classe-do-botao-com-preco');
      
      if (btn) {
        // Coloque aqui o código que abre o modal de escolha de cada variação.
        // Você pode usar 'btn' para acessar o botão que foi clicado.
        // Por exemplo, sua função atual para abrir o modal pode ser chamada aqui.
      }
    });
  });
  
  // Função para carregar a categoria de produtos
  function loadCategory(categoryName) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${categoryName}.html`, true);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Substitua o conteúdo de 'product-container' com o novo conteúdo HTML
            document.querySelector('.product-container').innerHTML = xhr.responseText;

            // Adiciona o evento aos novos botões de cor carregados
            let colorButtons = document.getElementsByClassName("color");
            for(let i=0; i < colorButtons.length; i++) {
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
        var quantity = parseInt(measures[i].nextElementSibling.value, 10);

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

            var productElement = document.createElement("p");
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

            // Adicionar o novo elemento ao array cartItems
            cartItems.push(productElement.outerHTML);
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

 closePopup();
 updateCartCount();
}
function updateCartCount() {
  const cart = document.getElementById("cart");
  const cartCount = document.querySelector(".cart-count");
  cartCount.innerText = cart.children.length;
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