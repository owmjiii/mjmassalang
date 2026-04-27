/* ═══════════════════════════════════════
      SHARED STATE (localStorage keys)
      portfolio_messages  — array of {name, email, message, date}
      portfolio_techstack — array of {name, src}
   ═══════════════════════════════════════ */

/* ─── NAV ─── */
const nav = document.querySelector("nav");
window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 10));

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a:not(.nav-back)");

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 150) current = s.getAttribute("id"); });
    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) link.classList.add("active");
    });
});

navLinks.forEach(link => {
    link.addEventListener("click", e => {
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#")) return; // let real page links navigate normally
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) window.scrollTo({ top: target.offsetTop - 100, behavior: "smooth" });
    });
});

/* ─── TOAST ─── */
function showToast(msg) {
    const t = document.getElementById("admin-toast");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2800);
}

/* ══════════════════════════════════════
   TECH STACK
══════════════════════════════════════ */
const DEFAULT_TECH = [
    { name: "Photoshop", src: "Photoshop Logo.png" },
    { name: "Illustrator", src: "Illustrator Logo.png" },
    { name: "Canva", src: "cANVA lOGO.png" },
    { name: "Figma", src: "Figma Logo.png" },
    { name: "Java", src: "Java Logo.png" },
    { name: "MySQL", src: "MySQL Logo.png" },
    { name: "HTML", src: "HTML Logo.png" },
    { name: "CSS", src: "CSS Logo.png" },
    { name: "Javascript", src: "Javascript Logo.png" },
];

function loadTechStack() {
    const saved = localStorage.getItem("portfolio_techstack");
    return saved ? JSON.parse(saved) : DEFAULT_TECH;
}

function saveTechStack(arr) {
    localStorage.setItem("portfolio_techstack", JSON.stringify(arr));
}

function renderTechStack() {
    const list = loadTechStack();
    const container = document.getElementById("ts-list");
    container.innerHTML = "";

    list.forEach((item, idx) => {
        const div = document.createElement("div");
        div.classList.add("child-container-tech-stack");

        const img = document.createElement("img");
        img.src = item.src;
        img.alt = item.name;
        img.style.width = "60px";

        const span = document.createElement("span");
        span.textContent = item.name;

        const delBtn = document.createElement("button");
        delBtn.classList.add("ts-delete");
        delBtn.innerHTML = "✕";
        delBtn.title = "Remove";
        delBtn.addEventListener("click", e => {
            e.stopPropagation();
            const arr = loadTechStack();
            arr.splice(idx, 1);
            saveTechStack(arr);
            renderTechStack();
            showToast("✅ Tech stack item removed.");
        });

        div.appendChild(delBtn);
        div.appendChild(img);
        div.appendChild(span);
        container.appendChild(div);
    });

    // Add button
    const addDiv = document.createElement("div");
    addDiv.classList.add("child-container-tech-stack-add");
    addDiv.innerHTML = `<img src="ic_baseline-plus.png" alt="Add" onerror="this.outerHTML='<span style=\\'font-size:28px\\'>＋</span>'">`;
    addDiv.addEventListener("click", () => {
        document.getElementById("add-tech-stack").style.display = "flex";
    });
    container.appendChild(addDiv);
}

renderTechStack();

/* Add tech stack modal */
let uploadedLogoSrc = "";

document.getElementById("import-logo-box").addEventListener("click", () => {
    document.getElementById("logo-upload").click();
});

document.getElementById("logo-upload").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            uploadedLogoSrc = e.target.result;
            const preview = document.getElementById("preview-logo");
            if (preview) { preview.src = uploadedLogoSrc; preview.style.width = "70px"; preview.style.display = "block"; }
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById("add-button-ts").addEventListener("click", () => {
    const name = document.getElementById("ts-name").value.trim();
    if (!name || !uploadedLogoSrc) { alert("Please enter a name and upload a logo!"); return; }

    const arr = loadTechStack();
    arr.push({ name, src: uploadedLogoSrc });
    saveTechStack(arr);
    renderTechStack();

    document.getElementById("ts-name").value = "";
    uploadedLogoSrc = "";
    const preview = document.getElementById("preview-logo");
    if (preview) preview.src = "ic_baseline-plus.png";
    document.getElementById("add-tech-stack").style.display = "none";
    showToast("✅ Tech stack updated!");
});

document.getElementById("back-btn-ts").addEventListener("click", () => {
    document.getElementById("add-tech-stack").style.display = "none";
    document.getElementById("ts-name").value = "";
    uploadedLogoSrc = "";
});

/* ══════════════════════════════════════
PROJECTS – Change Project modal
══════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", function () {

    let cpTargetImg = null;

    const modal = document.getElementById("change-project-modal");
    const currentImg = document.getElementById("cp-current-img");
    const fileInput = document.getElementById("cp-file-input");
    const uploadSlot = document.getElementById("cp-upload-slot");
    const backBtn = document.getElementById("cp-back-btn");

    /* CLICK GRID IMAGE */
    document.querySelectorAll(".grid-image img").forEach(img => {
        img.addEventListener("click", () => {

            cpTargetImg = img;
            currentImg.src = img.src;

            modal.style.display = "flex";
            fileInput.value = "";
        });
    });

    /* CLOSE MODAL */
    backBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    /* OPEN FILE SELECT */
    uploadSlot.addEventListener("click", () => {
        fileInput.click();
    });

    /* UPDATE IMAGE */
    fileInput.addEventListener("change", function () {

        const file = this.files[0];
        if (!file || !cpTargetImg) return;

        const reader = new FileReader();

        reader.onload = function (e) {
            cpTargetImg.src = e.target.result;
            modal.style.display = "none";
            showToast("✅ Project image updated!");

            // Persist all current grid image srcs to localStorage
            const projectData = JSON.parse(localStorage.getItem("portfolio_project_images") || "{}");
            ["gd-grid", "merch-grid"].forEach(gridId => {
                const imgs = document.querySelectorAll("#" + gridId + " img");
                projectData[gridId] = Array.from(imgs).map(img => img.src);
            });
            localStorage.setItem("portfolio_project_images", JSON.stringify(projectData));
        };

        reader.readAsDataURL(file);

    });

    /* CLOSE IF CLICK OUTSIDE */
    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    });

    /* ══════════════════════════════════════
       MESSAGES
    ══════════════════════════════════════ */
    function loadMessages() {
        return JSON.parse(localStorage.getItem("portfolio_messages") || "[]");
    }

    function saveMessages(arr) {
        localStorage.setItem("portfolio_messages", JSON.stringify(arr));
    }

    function renderMessages(filter = "") {
        const tbody = document.getElementById("messages-body");
        const messages = loadMessages();
        const filtered = filter
            ? messages.filter(m => (m.name + m.email + m.message).toLowerCase().includes(filter.toLowerCase()))
            : messages;

        tbody.innerHTML = "";

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr style="animation:none;opacity:1"><td colspan="4">
          <div class="empty-state">
            <div class="empty-icon">📭</div>
            <p>${filter ? "No messages match your search." : "No messages yet. They'll appear here once visitors submit the form."}</p>
          </div></td></tr>`;
            document.getElementById("msg-count").textContent = 0;
            return;
        }

        filtered.forEach((msg, i) => {
            const isNew = i === 0 && !filter;
            const tr = document.createElement("tr");
            tr.innerHTML = `
          <td class="name-cell">${escHtml(msg.name)}${isNew ? '<span class="badge-new">NEW</span>' : ""}</td>
          <td class="email-cell">${escHtml(msg.email)}</td>
          <td class="message-cell">
            ${escHtml(msg.message)}
            <br>
            <button class="delete-btn" data-index="${messages.indexOf(msg)}">Delete</button>
          </td>
          <td class="date-cell">${escHtml(msg.date)}</td>`;
            tbody.appendChild(tr);
        });

        // Wire delete buttons
        tbody.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.dataset.index);
                const arr = loadMessages();
                arr.splice(idx, 1);
                saveMessages(arr);
                renderMessages(document.getElementById("search-input").value);
                showToast("🗑️ Message deleted.");
            });
        });

        document.getElementById("msg-count").textContent = filtered.length;
    }

    function escHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    renderMessages();

    document.getElementById("search-input").addEventListener("input", function () {
        renderMessages(this.value);
    });

    document.getElementById("clear-all-btn").addEventListener("click", () => {
        if (!loadMessages().length) return;
        if (confirm("Clear all messages? This cannot be undone.")) {
            saveMessages([]);
            renderMessages();
            showToast("🗑️ All messages cleared.");
        }
    });

    // Refresh messages if another tab submits
    window.addEventListener("storage", e => {
        if (e.key === "portfolio_messages") renderMessages(document.getElementById("search-input").value);
        if (e.key === "portfolio_techstack") renderTechStack();
    });