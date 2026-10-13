(function () {
    "use strict";

    var page = document.body.getAttribute("data-page") || "inventory";
    var role = sessionStorage.getItem("luna_user");

    // --- Access guard ---
    if (!role) {
        window.location.href = "login.html";
        return;
    }
    if (page === "inventory-edit" && role !== "admin") {
        window.location.href = "inventory.html";
        return;
    }

    // --- Show the signed-in role ---
    var roleLabel = document.getElementById("role-label");
    if (roleLabel) {
        roleLabel.textContent = role === "admin" ? "Administrator" : "Cashier";
    }

    // --- Logout ---
    document.querySelectorAll(".inv-logout").forEach(function (btn) {
        btn.addEventListener("click", function () {
            sessionStorage.removeItem("luna_user");
            sessionStorage.removeItem("luna_admin");
            window.location.href = "login.html";
        });
    });

    var products = window.LUNA_PRODUCTS || [];
    var table = document.getElementById("inv-table");
    var tbody = table ? table.querySelector("tbody") : null;
    var search = document.getElementById("inv-search");
    var chipsBox = document.getElementById("inv-chips");
    var activeCat = "All";

    function esc(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function currency(n) {
        return "₱ " + Number(n).toFixed(2);
    }

    // Deterministic stock level so the page looks consistent on every load.
    function stockFor(name) {
        var h = 0;
        for (var i = 0; i < name.length; i++) {
            h = (h * 31 + name.charCodeAt(i)) % 997;
        }
        var pool = [0, 0, 6, 9, 12, 15, 18, 25, 40, 60, 85, 120, 150, 210, 240, 300];
        return pool[h % pool.length];
    }

    function statusFor(stock) {
        if (stock <= 0) return { cls: "badge-out", label: "Out of stock" };
        if (stock < 20) return { cls: "badge-low", label: "Low stock" };
        return { cls: "badge-in", label: "In stock" };
    }

    function itemCell(p) {
        return '<div class="inv-item">' +
            '<img class="inv-thumb" src="' + esc(p.i) + '" alt="" />' +
            '<div><div class="inv-item-name">' + esc(p.n) + "</div>" +
            '<div class="inv-item-sub">' + esc(p.c) + "</div></div></div>";
    }

    function itemCellEdit(p) {
        return '<div class="inv-item">' +
            '<img class="inv-thumb" src="' + esc(p.i) + '" alt="" />' +
            '<input class="inv-input" type="text" value="' + esc(p.n) + '" /></div>';
    }

    function render() {
        if (!tbody) return;

        if (page === "inventory-edit") {
            tbody.innerHTML = products.map(function (p) {
                var stock = stockFor(p.n);
                var st = statusFor(stock);
                return '<tr data-cat="' + esc(p.c) + '">' +
                    "<td>" + itemCellEdit(p) + "</td>" +
                    '<td><input class="inv-input" type="text" value="' + esc(p.c) + '" /></td>' +
                    '<td><input class="inv-input narrow" type="text" value="' + currency(p.p) + '" /></td>' +
                    '<td><input class="inv-input narrow" type="number" value="' + stock + '" /></td>' +
                    '<td><span class="badge ' + st.cls + '">' + st.label + "</span></td>" +
                    '<td><div class="row-actions">' +
                    '<button type="button" class="icon-btn icon-save">Save</button>' +
                    '<button type="button" class="icon-btn icon-del">Delete</button>' +
                    "</div></td></tr>";
            }).join("");
        } else {
            tbody.innerHTML = products.map(function (p) {
                var stock = stockFor(p.n);
                var st = statusFor(stock);
                return '<tr data-cat="' + esc(p.c) + '">' +
                    "<td>" + itemCell(p) + "</td>" +
                    "<td>" + esc(p.c) + "</td>" +
                    "<td>" + currency(p.p) + "</td>" +
                    "<td>" + stock + "</td>" +
                    '<td><span class="badge ' + st.cls + '">' + st.label + "</span></td>" +
                    "</tr>";
            }).join("");
        }

        updateStats();
    }

    function updateStats() {
        var rows = table.querySelectorAll("tbody tr");
        var low = 0, out = 0;
        rows.forEach(function (row) {
            var badge = row.querySelector(".badge");
            if (!badge) return;
            if (badge.classList.contains("badge-low")) low++;
            if (badge.classList.contains("badge-out")) out++;
        });
        var totalEl = document.getElementById("total-count");
        var lowEl = document.getElementById("low-count");
        var outEl = document.getElementById("out-count");
        if (totalEl) totalEl.textContent = rows.length;
        if (lowEl) lowEl.textContent = low;
        if (outEl) outEl.textContent = out;
    }

    // --- Category chips built from the product data ---
    function buildChips() {
        if (!chipsBox) return;
        var cats = ["All"];
        var seen = {};
        products.forEach(function (p) {
            if (!seen[p.c]) {
                seen[p.c] = true;
                cats.push(p.c);
            }
        });
        chipsBox.innerHTML = "";
        cats.forEach(function (c) {
            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = "chip" + (c === "All" ? " active" : "");
            btn.setAttribute("data-cat", c);
            btn.textContent = c;
            btn.addEventListener("click", function () {
                chipsBox.querySelectorAll(".chip").forEach(function (x) {
                    x.classList.remove("active");
                });
                btn.classList.add("active");
                activeCat = c;
                applyFilters();
            });
            chipsBox.appendChild(btn);
        });
    }

    function applyFilters() {
        var term = (search ? search.value : "").trim().toLowerCase();
        var visible = 0;
        table.querySelectorAll("tbody tr").forEach(function (row) {
            var text = row.textContent.toLowerCase();
            row.querySelectorAll("input").forEach(function (input) {
                text += " " + (input.value || "").toLowerCase();
            });
            var cat = row.getAttribute("data-cat") || "";
            var show = (!term || text.indexOf(term) !== -1) &&
                (activeCat === "All" || cat === activeCat);
            row.style.display = show ? "" : "none";
            if (show) visible++;
        });

        var empty = document.getElementById("no-results");
        if (empty) {
            empty.style.display = visible === 0 ? "block" : "none";
        }
    }

    if (search) {
        search.addEventListener("input", applyFilters);
    }

    // --- Edit-page buttons (design only) ---
    var hint = document.getElementById("save-hint");
    function flash(message) {
        if (!hint) return;
        hint.textContent = message;
        clearTimeout(flash._t);
        flash._t = setTimeout(function () {
            hint.textContent = "";
        }, 2000);
    }

    if (table) {
        table.addEventListener("click", function (e) {
            var btn = e.target;
            if (!btn.classList) return;
            if (btn.classList.contains("icon-save")) {
                flash("Changes saved.");
            } else if (btn.classList.contains("icon-del")) {
                var row = btn.closest("tr");
                if (row) row.remove();
                updateStats();
                applyFilters();
                flash("Item removed.");
            }
        });
    }

    var addBtn = document.getElementById("add-item");
    if (addBtn && table) {
        addBtn.addEventListener("click", function () {
            var row = document.createElement("tr");
            row.setAttribute("data-cat", activeCat === "All" ? "Cardiovascular" : activeCat);
            row.innerHTML =
                '<td><input class="inv-input" type="text" placeholder="Item name" /></td>' +
                '<td><input class="inv-input" type="text" placeholder="Category" /></td>' +
                '<td><input class="inv-input narrow" type="text" placeholder="₱ 0.00" /></td>' +
                '<td><input class="inv-input narrow" type="number" value="0" /></td>' +
                '<td><span class="badge badge-in">In stock</span></td>' +
                '<td><div class="row-actions">' +
                '<button type="button" class="icon-btn icon-save">Save</button>' +
                '<button type="button" class="icon-btn icon-del">Delete</button>' +
                "</div></td>";
            tbody.insertBefore(row, tbody.firstChild);
            row.querySelector(".inv-input").focus();
            updateStats();
            flash("New item added.");
        });
    }

    // --- Quick refresh (view page) ---
    var refreshBtn = document.getElementById("refresh-btn");
    if (refreshBtn) {
        refreshBtn.addEventListener("click", function () {
            if (search) search.value = "";
            activeCat = "All";
            if (chipsBox) {
                chipsBox.querySelectorAll(".chip").forEach(function (c) {
                    c.classList.toggle("active", c.getAttribute("data-cat") === "All");
                });
            }
            applyFilters();
            flash("Inventory refreshed.");
        });
    }

    buildChips();
    render();
    applyFilters();
})();
