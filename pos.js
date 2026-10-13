(function () {
    "use strict";

    // --- Session guard: only signed-in staff may use the POS ---
    var currentUser = sessionStorage.getItem("luna_user");
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    var currency = function (n) {
        return "₱ " + n.toFixed(2);
    };

    var products = window.LUNA_PRODUCTS || [];

    var cart = {};
    var currentCat = "All";
    var searchTerm = "";

    var listEl = document.getElementById("product-list");
    var cartItemsEl = document.getElementById("cart-items");
    var cartCountEl = document.getElementById("cart-count");
    var subtotalEl = document.getElementById("subtotal");
    var totalEl = document.getElementById("total");
    var searchInput = document.getElementById("search-input");
    var filtersEl = document.getElementById("cat-filters");

    // --- Category filters ---
    var cats = ["All"];
    var seen = {};
    products.forEach(function (p) {
        if (!seen[p.c]) {
            seen[p.c] = true;
            cats.push(p.c);
        }
    });
    cats.forEach(function (c) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cat-filter" + (c === "All" ? " active" : "");
        btn.textContent = c;
        btn.setAttribute("data-cat", c);
        btn.addEventListener("click", function () {
            currentCat = c;
            document.querySelectorAll(".cat-filter").forEach(function (b) {
                b.classList.toggle("active", b.getAttribute("data-cat") === c);
            });
            renderList();
        });
        filtersEl.appendChild(btn);
    });

    // --- Product list rendering ---
    function matches(p) {
        var okCat = currentCat === "All" || p.c === currentCat;
        var term = searchTerm.toLowerCase();
        var okSearch = !term || p.n.toLowerCase().indexOf(term) !== -1;
        return okCat && okSearch;
    }

    function renderList() {
        listEl.innerHTML = "";
        products.filter(matches).forEach(function (p) {
            var card = document.createElement("div");
            card.className = "product-card";

            var img = document.createElement("img");
            img.className = "product-thumb";
            img.src = p.i;
            img.alt = p.n;

            var info = document.createElement("div");
            info.className = "product-info";

            var name = document.createElement("span");
            name.className = "product-name";
            name.textContent = p.n;

            var price = document.createElement("span");
            price.className = "product-price";
            price.textContent = currency(p.p);

            var addBtn = document.createElement("button");
            addBtn.type = "button";
            addBtn.className = "product-add";
            addBtn.textContent = "Add to Sale";
            addBtn.addEventListener("click", function () { addToCart(p); });

            info.appendChild(name);
            info.appendChild(price);
            card.appendChild(img);
            card.appendChild(info);
            card.appendChild(addBtn);
            listEl.appendChild(card);
        });

        if (listEl.children.length === 0) {
            listEl.innerHTML = '<p class="cart-empty">No products found.</p>';
        }
    }

    // --- Cart operations ---
    function addToCart(p) {
        if (!cart[p.n]) {
            cart[p.n] = { name: p.n, img: p.i, price: p.p, qty: 0 };
        }
        cart[p.n].qty += 1;
        renderCart();
    }

    function changeQty(name, delta) {
        if (!cart[name]) return;
        cart[name].qty += delta;
        if (cart[name].qty <= 0) {
            delete cart[name];
        }
        renderCart();
    }

    function removeItem(name) {
        delete cart[name];
        renderCart();
    }

    function renderCart() {
        var keys = Object.keys(cart);
        cartItemsEl.innerHTML = "";
        if (keys.length === 0) {
            cartItemsEl.innerHTML = '<p class="cart-empty">No items yet. Tap a product to add it.</p>';
        }

        var count = 0;
        var subtotal = 0;
        keys.forEach(function (k) {
            var it = cart[k];
            count += it.qty;
            subtotal += it.qty * it.price;

            var row = document.createElement("div");
            row.className = "cart-item";

            var img = document.createElement("img");
            img.src = it.img;
            img.alt = it.name;

            var info = document.createElement("div");
            info.className = "cart-item-info";

            var nm = document.createElement("div");
            nm.className = "name";
            nm.textContent = it.name;

            var line = document.createElement("div");
            line.className = "line";
            line.textContent = currency(it.price);

            var qtyCtrl = document.createElement("div");
            qtyCtrl.className = "qty-control";

            var minus = document.createElement("button");
            minus.type = "button";
            minus.textContent = "−";
            minus.addEventListener("click", function () { changeQty(k, -1); });

            var qty = document.createElement("span");
            qty.className = "qty";
            qty.textContent = it.qty;

            var plus = document.createElement("button");
            plus.type = "button";
            plus.textContent = "+";
            plus.addEventListener("click", function () { changeQty(k, 1); });

            qtyCtrl.appendChild(minus);
            qtyCtrl.appendChild(qty);
            qtyCtrl.appendChild(plus);
            info.appendChild(nm);
            info.appendChild(line);
            info.appendChild(qtyCtrl);

            var remove = document.createElement("button");
            remove.type = "button";
            remove.className = "cart-remove";
            remove.textContent = "✕";
            remove.addEventListener("click", function () { removeItem(k); });

            row.appendChild(img);
            row.appendChild(info);
            row.appendChild(remove);
            cartItemsEl.appendChild(row);
        });

        cartCountEl.textContent = count;
        subtotalEl.textContent = currency(subtotal);
        totalEl.textContent = currency(subtotal);
    }

    // --- Checkout / clear ---
    document.getElementById("checkout-btn").addEventListener("click", function () {
        var keys = Object.keys(cart);
        if (keys.length === 0) {
            alert("The sale is empty. Add a product first.");
            return;
        }
        var total = keys.reduce(function (sum, k) { return sum + cart[k].qty * cart[k].price; }, 0);
        var lines = keys.map(function (k) {
            return cart[k].name + "  x" + cart[k].qty + "  =  " + currency(cart[k].qty * cart[k].price);
        }).join("\n");
        alert("RECEIPT\nLuna's Pharmacy\n\n" + lines + "\n\nTOTAL: " + currency(total));
        cart = {};
        renderCart();
    });

    document.getElementById("clear-btn").addEventListener("click", function () {
        cart = {};
        renderCart();
    });

    document.getElementById("logout-btn").addEventListener("click", function () {
        sessionStorage.removeItem("luna_user");
        sessionStorage.removeItem("luna_admin");
        window.location.href = "login.html";
    });

    searchInput.addEventListener("input", function () {
        searchTerm = searchInput.value.trim();
        renderList();
    });

    renderList();
    renderCart();
})();