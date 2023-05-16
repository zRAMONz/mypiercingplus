window.addEventListener('DOMContentLoaded', (event) => {
    // Função para aumentar os preços dos produtos em 22% para pessoa jurídica
    // Função para aumentar os preços dos produtos em 22% para pessoa jurídica
    function updatePricesForBusiness() {
        var colorButtons = document.getElementsByClassName('color');
        for (var i = 0; i < colorButtons.length; i++) {
            var price = parseFloat(colorButtons[i].getAttribute('data-price'));
            price *= 1.22; // Aumentar o preço em 22%
            colorButtons[i].setAttribute('data-price', price.toFixed(2)); // Atualizar o preço no atributo data-price
            var colorName = colorButtons[i].innerText.replace(/€\s*\d+(\.\d{1,2})?/, '').trim(); // Remove original price from the color name
            colorButtons[i].innerText = colorName + '€' + price.toFixed(2); // Show the new price with two decimal places
        }
    
        var measureButtons = document.getElementsByClassName('measure');
        for (var i = 0; i < measureButtons.length; i++) {
            var price = parseFloat(measureButtons[i].getAttribute('data-price'));
            price *= 1.22; // Aumentar o preço em 22%
            measureButtons[i].setAttribute('data-price', price.toFixed(2)); // Atualizar o preço no atributo data-price
            var measureName = measureButtons[i].innerText.replace(/€\s*\d+(\.\d{1,2})?/, '').trim(); // Remove original price from the measure name
            measureButtons[i].innerText = measureName; // Show only measure name
        }
    }
    
    
    
    // Exibe o popup de boas-vindas
    document.getElementById('welcomePopup').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    
    document.getElementById('businessButton').addEventListener('click', function() {
        updatePricesForBusiness();
        document.getElementById('welcomePopup').style.display = 'none';
        document.body.style.overflow = '';
    });
    
    document.getElementById('individualButton').addEventListener('click', function() {
        document.getElementById('welcomePopup').style.display = 'none';
        document.body.style.overflow = '';
    });
    
    
        // Resto do código...
    });
    
    
    
    // Função para abrir o popup e preencher com as informações do produto
    // Função para abrir o popup e preencher com as informações do produto
    function openPopup(e) {
        var product = e.target.closest('.product');
        var color = e.target.getAttribute('data-color');
        var price = e.target.getAttribute('data-price');
        
        var popup = document.getElementById('popup');
        popup.getElementsByClassName('popup-product-name')[0].innerText = product.getElementsByClassName('product-name')[0].innerText;
        popup.getElementsByClassName('popup-color')[0].innerText = color + ': €' + price;
        var productImage = product.getElementsByTagName('img')[0];
        document.getElementById('popup-product-image').src = productImage.src;
        // Pega as divs de medidas da cor correta
       
        var sizes = product.querySelectorAll('.sizes[data-color="' + color + '"] > .size');
    
        // Remove as opções de medidas existentes no pop-up
        var popupSizes = popup.getElementsByClassName('popup-sizes')[0];
        while (popupSizes.firstChild) {
            popupSizes.removeChild(popupSizes.firstChild);
        }
    
      // Adiciona as opções de medidas corretas ao pop-up
      for (var i = 0; i < sizes.length; i++) {
        var sizeDiv = sizes[i].cloneNode(true);
    
        // Adiciona novamente os campos de entrada
        var measures = sizeDiv.querySelectorAll('.measure-container .measure');
        for (var j = 0; j < measures.length; j++) {
            // Verifica se já existe um campo de entrada ao lado da medida
            var nextSibling = measures[j].nextSibling;
            if (!nextSibling || nextSibling.nodeName.toLowerCase() !== 'input') {
                var input = document.createElement('input');
                input.type = 'number';
                input.min = '0';
                input.className = 'measure-quantity';
                measures[j].parentNode.insertBefore(input, measures[j].nextSibling);
            }
        }
    
        popupSizes.appendChild(sizeDiv);
    }
    
    
    popup.style.display = 'block';
    }
    
    let selectedSize = null;
    
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('measure')) {
            // Remova a classe 'selected' de qualquer botão de medida anteriormente selecionado
            if (selectedSize) {
                selectedSize.classList.remove('selected');
            }
    
            // Adicione a classe 'selected' ao botão de medida atualmente selecionado
            event.target.classList.add('selected');
    
            // Atualize a variável selectedSize
            selectedSize = event.target;
        }
    });
    
    
    // Adicionar produto ao resumo da compra a partir do popup
    function addToCartFromPopup() {
        var popup = document.getElementById('popup');
        var productName = popup.querySelector('.popup-product-name').innerText;
        var color = popup.querySelector('.popup-color').innerText.split(':')[0].trim();
        var productImage = popup.querySelector('.popup-product-image').src;
    
        var measures = popup.querySelectorAll('.measure');
        for (var i = 0; i < measures.length; i++) {
            var price = parseFloat(measures[i].getAttribute('data-price'));
            var quantity = parseInt(measures[i].nextElementSibling.value, 10);
            if (quantity > 0) {
                var measure = measures[i].innerText;
                var size = measures[i].parentNode.parentNode.querySelector('h4').innerText;
    
                var cart = document.getElementById('cart');
                var cartItem = document.createElement('p');
                
                var productImageElement = document.createElement('img');
                productImageElement.src = productImage;
                cartItem.appendChild(productImageElement);
                
                var productInfo = document.createElement('span');
                productInfo.className = 'product-info';
                productInfo.innerText = productName + ' ' + color + ' | ' + size + ' ' + measure;
                var priceElement = document.createElement('span');
                priceElement.innerText = '€' + price.toFixed(2) + ' * ' + quantity + ' unid = €' + (price * quantity).toFixed(2);
                productInfo.appendChild(document.createElement('br'));
                productInfo.appendChild(priceElement);
                cartItem.appendChild(productInfo);
                
                var deleteButton = document.createElement('button');
                deleteButton.innerText = 'X';
                deleteButton.addEventListener('click', removeFromCart);

                
                cartItem.appendChild(deleteButton);
                cart.appendChild(cartItem);
    
                var totalElement = document.getElementById('total');
                var total = parseFloat(totalElement.innerText);
                total += price * quantity;
                totalElement.innerText = total.toFixed(2);
    
                selectedSize = null;
            }
        }
        // Fechar o popup após adicionar o item ao carrinho
        closePopup();
        // Resetar o campo de quantidade para 1
        document.querySelector('.popup-quantity').value = 1;
    }
    
    document.getElementById('popup-add').addEventListener('click', addToCartFromPopup);
    
    
    function removeFromCart(event) {
        var cartItem = event.target.parentNode;
        var priceElement = cartItem.querySelector('span');
        var priceAndQuantity = priceElement.innerText.match(/€(\d+(\.\d{1,2})?) \* (\d+) unid = €(\d+(\.\d{1,2})?)/);
        var price = parseFloat(priceAndQuantity[1]);
        var quantity = parseInt(priceAndQuantity[3]);
    
        var totalElement = document.getElementById('total');
        var total = parseFloat(totalElement.innerText);
        total -= price * quantity;
        totalElement.innerText = total.toFixed(2);
    
        cartItem.remove();
    }
    
    
    
    
    
    
    var colorButtons = document.getElementsByClassName('color');
    for (var i = 0; i < colorButtons.length; i++) {
        colorButtons[i].addEventListener('click', openPopup);
    }
    
    function closePopup() {
        var popup = document.getElementById('popup');
        popup.style.display = 'none';
    }
    
    document.getElementById('popup-close').addEventListener('click', closePopup);
    
    function getCartItemsText() {
        var cartItems = document.getElementById('cart').children;
        var cartItemsText = '';
        
        for (var i = 0; i < cartItems.length; i++) {
            var productInfo = cartItems[i].querySelector('.product-info').innerText;
            cartItemsText += productInfo + '\n';
        }
        
        return cartItemsText;
    }
    
    
    document.getElementById('whatsappButton').addEventListener('click', function() {
        var cartItemsText = getCartItemsText();
        var totalValue = document.getElementById('total').innerText;
        var textToSend = "Resumo da Compra:\n" + cartItemsText + "Total: €" + totalValue;
        var phoneNumber = "393898986018"; // Substitua pelo número de telefone desejado
        var message = encodeURIComponent(textToSend);
        window.open(`https://wa.me/${phoneNumber}?text=${message}`);
    });
    
    document.getElementById('copyButton').addEventListener('click', function() {
        var cartItemsText = getCartItemsText();
        var totalValue = document.getElementById('total').innerText;
        var textToCopy = "Resumo da Compra:\n" + cartItemsText + "Total: €" + totalValue;
        var tempInput = document.createElement('textarea');
        tempInput.style = "position: absolute; left: -1000px; top: -1000px";
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    });
    
    
    
