(function () {
    "use strict";

    // --- Session guard: only admins may use the POS ---
    if (sessionStorage.getItem("luna_admin") !== "1") {
        window.location.href = "login.html";
        return;
    }

    var currency = function (n) {
        return "₱ " + n.toFixed(2);
    };

    var products = [
        // Cardiovascular
        { n: "Amlodipine 5 mg", i: "Amlodipine.jpg", c: "Cardiovascular", p: 6 },
        { n: "Amlodipine + Losartan 5mg/50mg", i: "Amlodipine+Losartan.jpg", c: "Cardiovascular", p: 18 },
        { n: "Apixaban 2.5 mg", i: "Apixaban_2.5mg.jpg", c: "Cardiovascular", p: 30 },
        { n: "Apixaban 5 mg", i: "Apixaban_5mg.jpg", c: "Cardiovascular", p: 40 },
        { n: "Aspirin 80 mg", i: "Aspirin.avif", c: "Cardiovascular", p: 3 },
        { n: "Aspirin 100 mg", i: "Aspirin_100mg.avif", c: "Cardiovascular", p: 5 },
        // Pain Relief
        { n: "Philpra (Paracetamol) 500 mg", i: "Philpra (Paracetamol).jpg", c: "Pain Relief", p: 3 },
        { n: "Biogesic (Paracetamol) 500 mg", i: "Biogesic (Paracetamol).jpg", c: "Pain Relief", p: 7 },
        { n: "Saridon 250mg/150mg/50mg", i: "Saridon (Paracetamol, Prophenazone, Caffeine).jpg", c: "Pain Relief", p: 11 },
        { n: "Rexidol 500mg/65mg", i: "Rexidol (Paracetamol, Caffeine).jpg", c: "Pain Relief", p: 10 },
        { n: "Ponstan SF (Mefenamic Acid) 500 mg", i: "Ponstan SF (Mefenamic Acid).jpg", c: "Pain Relief", p: 48 },
        { n: "Ritemed (Mefenamic Acid) 500 mg", i: "Ritemed (Mefenamic Acid).jpg", c: "Pain Relief", p: 10 },
        { n: "Mefein (Mefenamic Acid) 500 mg", i: "Mefein (Mefenamic Acid).jpg", c: "Pain Relief", p: 18 },
        { n: "Acid Mecid (Mefenamic Acid) 500 mg", i: "Acid Mecid (Mefenamic Acid).jpg", c: "Pain Relief", p: 3 },
        { n: "Norgesic", i: "Norgesic.jpg", c: "Pain Relief", p: 27 },
        { n: "Norgesic Forte", i: "Norgesic_forte.jpg", c: "Pain Relief", p: 45 },
        { n: "Orfagen 650mg/35mg", i: "Orfagen (Paracetamol + Orphenadrine Citrate).jpg", c: "Pain Relief", p: 28 },
        { n: "Duo-Gesic 325mg/37.5mg", i: "Duo-Gesic (Paracetamol + Tramadol HCl).jpg", c: "Pain Relief", p: 20 },
        { n: "Opiodex (Tramadol) 50 mg", i: "Tramadol (Opiodex).webp", c: "Pain Relief", p: 12 },
        { n: "Philflam (Diclofenac) 50 mg", i: "Philflam (Diclofenac Sodium).jpg", c: "Pain Relief", p: 5 },
        { n: "Curafen (Diclofenac) 100 mg", i: "Curafen (Diclofenac Sodium).jpg", c: "Pain Relief", p: 8 },
        { n: "Celecox (Celecoxib) 200 mg", i: "Celecoxx (Celecoxib).jpg", c: "Pain Relief", p: 30 },
        { n: "Emicox (Celecoxib) 200 mg", i: "Emicox (Celecoxib).jpg", c: "Pain Relief", p: 14 },
        { n: "Emicox (Celecoxib) 400 mg", i: "Emicox (Celecoxib)_400mg.jpg", c: "Pain Relief", p: 40 },
        { n: "Neperlan (Piroxicam) 20 mg", i: "Neperlan (Piroxicam).jpg", c: "Pain Relief", p: 8 },
        { n: "Melotab (Meloxicam) 15 mg", i: "Melotab (Meloxicam).jpg", c: "Pain Relief", p: 15 },
        // Cough, Cold & Allergy
        { n: "Sinutab Cold Plus 500mg/5mg/2mg", i: "Sinutab.webp", c: "Cough, Cold & Allergy", p: 16 },
        { n: "Neozep Forte", i: "neozep.jpg", c: "Cough, Cold & Allergy", p: 11 },
        { n: "Decolgen Forte 25mg/2mg/500mg", i: "decolgen.jpg", c: "Cough, Cold & Allergy", p: 12 },
        { n: "Bioflu", i: "bioflu.jpg", c: "Cough, Cold & Allergy", p: 12 },
        { n: "Ambiflu", i: "ambiflu.jpg", c: "Cough, Cold & Allergy", p: 9 },
        { n: "Coldrex", i: "coldrex.webp", c: "Cough, Cold & Allergy", p: 8 },
        { n: "Symdex D 25mg/2mg/325mg", i: "symdex-d.jpg", c: "Cough, Cold & Allergy", p: 5 },
        { n: "Symdex Forte 25mg/2mg/500mg", i: "symdex-d_forte.jpg", c: "Cough, Cold & Allergy", p: 7 },
        { n: "Cetirizine 2 mg", i: "cetirizine.jpg", c: "Cough, Cold & Allergy", p: 4 },
        { n: "Alnix Cetirizine 10 mg", i: "alnix.jpg", c: "Cough, Cold & Allergy", p: 32 },
        { n: "Claricort 5mg/250mcg", i: "claricort.jpg", c: "Cough, Cold & Allergy", p: 55 },
        { n: "Allerta 10 mg", i: "allerta.webp", c: "Cough, Cold & Allergy", p: 25 },
        { n: "Loratamed 10 mg", i: "loratamed.jpg", c: "Cough, Cold & Allergy", p: 8 },
        { n: "Sinupret Forte", i: "sinupret_forte.jpg", c: "Cough, Cold & Allergy", p: 22 },
        { n: "Sinupret", i: "sinupret.jpg", c: "Cough, Cold & Allergy", p: 13 },
        { n: "Lagundi 300 mg", i: "lagundi.jpg", c: "Cough, Cold & Allergy", p: 4 },
        { n: "Plemex Forte 600 mg", i: "plemex.jpg", c: "Cough, Cold & Allergy", p: 10 },
        { n: "Asflem 600 mg", i: "asflem.jpg", c: "Cough, Cold & Allergy", p: 8 },
        { n: "Ascof Forte", i: "ascof.webp", c: "Cough, Cold & Allergy", p: 12 },
        { n: "Zykast 10mg/5mg", i: "zykast.avif", c: "Cough, Cold & Allergy", p: 32 },
        { n: "Cetrikast 10mg/5mg", i: "cetrikast.webp", c: "Cough, Cold & Allergy", p: 30 },
        { n: "Novakast 10 mg", i: "novakast.jpg", c: "Cough, Cold & Allergy", p: 24 },
        { n: "Leukorex 10 mg", i: "leukorex.webp", c: "Cough, Cold & Allergy", p: 12 },
        { n: "Mucomed 25 mg", i: "mucomed.jpg", c: "Cough, Cold & Allergy", p: 4 },
        { n: "Hietazyn 50 mg", i: "histazyn.jpg", c: "Cough, Cold & Allergy", p: 10 },
        // Gastrointestinal
        { n: "Hyoscine N. Butylbromide 10 mg", i: "hyoscine.jpg", c: "Gastrointestinal", p: 15 },
        { n: "Hyopan 10 mg", i: "hyopan.jpg", c: "Gastrointestinal", p: 23 },
        { n: "Buscopan 10 mg", i: "buscopan.jpg", c: "Gastrointestinal", p: 36 },
        { n: "Buscopan Venus 10 mg", i: "Buscopan-Venus.webp", c: "Gastrointestinal", p: 45 },
        { n: "Dulcolax (Bisacodyl) 5 mg", i: "Dulcolax.webp", c: "Gastrointestinal", p: 32 },
        { n: "Dylax 5 mg", i: "dylax.webp", c: "Gastrointestinal", p: 15 },
        { n: "Imodium (Loperamide) 2 mg", i: "imodium.webp", c: "Gastrointestinal", p: 20 },
        { n: "Lomotil (Loperamide) 2 mg", i: "lomotil.jpg", c: "Gastrointestinal", p: 16 },
        { n: "Diatabs 2 mg", i: "diatabs.webp", c: "Gastrointestinal", p: 13 },
        { n: "Diacure 2 mg", i: "diacure.webp", c: "Gastrointestinal", p: 8 },
        { n: "Diatabs Advanced 2mg/125mg", i: "diatabs_advance.webp", c: "Gastrointestinal", p: 24 },
        { n: "Gastrifar 10 mg", i: "Gastrifar.png", c: "Gastrointestinal", p: 15 },
        { n: "Motilium", i: "motilium.webp", c: "Gastrointestinal", p: 36 },
        { n: "Metoclopramide 10 mg", i: "metoclopramide.jpeg", c: "Gastrointestinal", p: 15 },
        { n: "Gaviscon", i: "gaviscon.webp", c: "Gastrointestinal", p: 40 },
        { n: "Gaviscon Double Action", i: "GAVISCON_DOUBLEACTION.webp", c: "Gastrointestinal", p: 48 },
        { n: "Kremil-S 178mg/233mg/30mg", i: "kremil-s.jpg", c: "Gastrointestinal", p: 12 },
        { n: "Kremil-S Advance 10mg/800mg/165mg", i: "kremil-s-advance.png", c: "Gastrointestinal", p: 27 },
        { n: "Maalox No.1 200mg/200mg", i: "maalox.jpg", c: "Gastrointestinal", p: 14 },
        { n: "Mucosta (Rebamipide) 10 mg", i: "mucosta.jpg", c: "Gastrointestinal", p: 43 },
        // Anti-Vertigo
        { n: "Bonamine 25 mg", i: "bonamine.webp", c: "Anti-Vertigo", p: 18 },
        { n: "Meclizsaph 25 mg", i: "meclizsaph.webp", c: "Anti-Vertigo", p: 12 },
        { n: "Vertilate 12 mg", i: "vertilate.webp", c: "Anti-Vertigo", p: 16 },
        { n: "Serc 8 mg", i: "serc.webp", c: "Anti-Vertigo", p: 55 },
        { n: "Vertisaph-8 8 mg", i: "vertisaph.webp", c: "Anti-Vertigo", p: 15 },
        { n: "Betzine 16 mg", i: "betzine.jpg", c: "Anti-Vertigo", p: 20 },
        { n: "Histakon 24 mg", i: "histakon.jpg", c: "Anti-Vertigo", p: 26 },
        { n: "Moticon 25 mg", i: "moticon.jpg", c: "Anti-Vertigo", p: 14 },
        { n: "Cinzitab 25 mg", i: "Cinzitab.jpg", c: "Anti-Vertigo", p: 8 },
        // Vitamins
        { n: "Noctu-Aid Melatonin 3 mg", i: "noctuaid.jpg", c: "Vitamins", p: 15 },
        { n: "MemoPlus Gold", i: "memoplus.jpg", c: "Vitamins", p: 18 },
        { n: "Glutaphos", i: "glutaphos.jpg", c: "Vitamins", p: 18 },
        { n: "Poten-Cee 500 mg", i: "potencee.avif", c: "Vitamins", p: 7 },
        { n: "Ascorbic Acid 500 mg", i: "ascorbic.jpg", c: "Vitamins", p: 4 },
        { n: "Protec-Zinc", i: "proteczinc.jpg", c: "Vitamins", p: 7 },
        { n: "ImmunPro 500mg/10mg", i: "immunpro.jpg", c: "Vitamins", p: 12 },
        { n: "Clusivol OB", i: "Clusivol_OB.webp", c: "Vitamins", p: 8 },
        { n: "Supraneuron", i: "supraneuron.webp", c: "Vitamins", p: 25 },
        { n: "Vineuron Plus", i: "vineuron.jpg", c: "Vitamins", p: 20 },
        { n: "Dolo-Neurobion", i: "Dolo-Neurobion.webp", c: "Vitamins", p: 29 },
        { n: "Neurobion", i: "Neurobion.webp", c: "Vitamins", p: 27 },
        { n: "Obmin Plus", i: "obmin.webp", c: "Vitamins", p: 35 },
        { n: "Hematrate FA", i: "Hemarate_FA.webp", c: "Vitamins", p: 39 },
        { n: "Ameciron", i: "ameciron.webp", c: "Vitamins", p: 6 },
        { n: "Iberet Folic 500 mg", i: "Iberet_Folic.webp", c: "Vitamins", p: 38 },
        { n: "GlucoFlex-B", i: "glucoflex.jpg", c: "Vitamins", p: 15 },
        { n: "Xanthone Plus", i: "xanthone.jpg", c: "Vitamins", p: 15 },
        { n: "Calcium Ambical 500 mg", i: "ambical.jpg", c: "Vitamins", p: 5 },
        { n: "Ambical-Plus", i: "ambical-plus.jpg", c: "Vitamins", p: 8 },
        { n: "Tanya E 400", i: "Tanya-E.webp", c: "Vitamins", p: 8 },
        { n: "E-Nova 400iu", i: "e-nova.jpg", c: "Vitamins", p: 8 },
        { n: "Myra E 400iu", i: "myra-e.webp", c: "Vitamins", p: 16 },
        { n: "Fortima", i: "fortima.jpg", c: "Vitamins", p: 20 },
        { n: "Myra Ultimate", i: "MYRA-ult.webp", c: "Vitamins", p: 21 },
        { n: "ULTIMA", i: "ultima.jpg", c: "Vitamins", p: 15 },
        { n: "Stresstab", i: "Stresstabs.webp", c: "Vitamins", p: 15 },
        { n: "Ling Zhi", i: "lingzhi.jpg", c: "Vitamins", p: 140 },
        // Others
        { n: "Biperiden HCl 2 mg", i: "Biperiden HCl.jpg", c: "Others", p: 26 },
        { n: "Dehydrosol 5.575g", i: "Dehydrosol.jpg", c: "Others", p: 12 },
        { n: "Lilibacil 2B", i: "lilibacil.jpg", c: "Others", p: 45 },
        { n: "Encazym", i: "encazym.webp", c: "Others", p: 45 },
        { n: "Nova Flora", i: "Novaflora.jpg", c: "Others", p: 45 },
        { n: "Hidrasec 100 mg", i: "hidrasec.jpg", c: "Others", p: 70 },
        { n: "Strepsils", i: "strepsils.jpg", c: "Others", p: 90 },
        { n: "Dequadin", i: "DEQUADIN.webp", c: "Others", p: 12 },
        { n: "AquaTab", i: "aquatab.jpg", c: "Others", p: 10 }
    ];

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