/* ─── LOAD ADMIN UPDATES FROM localStorage ─── */

let loginAttempts = 0;
let adminShortcutLocked = false;

// Default tech stack (matches the original static HTML)
const DEFAULT_TECH = [
    { name: "Photoshop", src: "Photoshop Logo.png" },
    { name: "Illustrator", src: "Illustrator Logo.png" },
    { name: "Canva", src: "cANVA lOGO.png" },
    { name: "Figma", src: "Figma Logo.png" },
    { name: "JAVA", src: "Java Logo.png" },
    { name: "MySQL", src: "MySQL Logo.png" },
    { name: "HTML", src: "HTML Logo.png" },
    { name: "CSS", src: "CSS Logo.png" },
    { name: "Javascript", src: "Javascript Logo.png" },
];

/* ─── NAV SCROLL ─── */
const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 10);
});

/* ─── ACTIVE NAV LINK ─── */
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 150) current = s.getAttribute("id");
    });
    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) link.classList.add("active");
    });
});

/* ─── SMOOTH SCROLL ─── */
navLinks.forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) window.scrollTo({ top: target.offsetTop - 100, behavior: "smooth" });
    });
});

/* ─── CURSOR TOOLTIP ─── */
const tooltip = document.getElementById("cursor-tooltip");

function attachTooltip(els) {
    els.forEach(el => {
        el.addEventListener("mouseenter", () => {
            tooltip.innerText = el.dataset.name;
            tooltip.style.opacity = 1;
        });
        el.addEventListener("mouseleave", () => { tooltip.style.opacity = 0; });
    });
}

// Used by the tech stack loader above (runs after this function is defined)
function attachTooltipLate(els) { attachTooltip(els); }

attachTooltip(document.querySelectorAll(".socials a"));
attachTooltip(document.querySelectorAll("#tech-stack img"));

document.addEventListener("mousemove", e => {
    tooltip.style.left = (e.clientX + 15) + "px";
    tooltip.style.top = (e.clientY + 15) + "px";
});

/* ─── ADMIN KEYBOARD SHORTCUT: Alt + Shift + M + J ─── */
const keys = { alt: false, shift: false, m: false, j: false };

document.addEventListener("keydown", e => {
    if (e.key === "Alt") keys.alt = true;
    if (e.key === "Shift") keys.shift = true;
    if (e.key === "m" || e.key === "M") keys.m = true;
    if (e.key === "j" || e.key === "J") keys.j = true;
    if (keys.alt && keys.shift && keys.m && keys.j) {

        const lockedUntil = localStorage.getItem("adminLockTime");

        document.getElementById("admin-login").style.display = "flex";
    }
    if (e.key === "Escape") {
        document.getElementById("admin-login").style.display = "none";
        document.getElementById("otp-login").style.display = "none";
    }
});

document.addEventListener("keyup", e => {
    if (e.key === "Alt") keys.alt = false;
    if (e.key === "Shift") keys.shift = false;
    if (e.key === "m" || e.key === "M") keys.m = false;
    if (e.key === "j" || e.key === "J") keys.j = false;
});

/* ─── ADMIN LOGIN ─── */
const admins = [
    { email: "mjmassalangg24@gmail.com", password: "March242006" },
    { email: "mjmassalang11@gmail.com", password: "admin123" }
];

// Simple 6-digit OTP generated per session
let sessionOTP = "";

document.getElementById("admin-button").addEventListener("click", () => {
    const email = document.getElementById("admin-email").value.trim();
    const password = document.getElementById("admin-password").value;
    const valid = admins.find(a => a.email === email && a.password === password);

    if (valid) {
        // Generate a fake OTP and store it (in a real app you'd send via email)
        sessionOTP = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("🔑 OTP (dev only):", sessionOTP); // visible in browser console
        document.getElementById("admin-login").style.display = "none";
        document.getElementById("otp-login").style.display = "flex";
        // Show OTP in a subtle way for demo purposes
        alert("Demo OTP: " + sessionOTP + "\n(In production this would be sent to your email)");
    } else {

        loginAttempts++;

        if (loginAttempts >= 3) {
            adminShortcutLocked = true;
            alert("Too many failed login attempts. Admin shortcut has been locked.");
            document.getElementById("admin-login").style.display = "none";
        } else {

            loginAttempts++;

            if (loginAttempts >= 3) {

                const lockUntil = Date.now() + LOCK_TIME;
                localStorage.setItem("adminLockTime", lockUntil);

                alert("Too many failed attempts. Admin shortcut locked for 3 hours.");
                document.getElementById("admin-login").style.display = "none";

            } else {

                alert("Invalid email or password. Attempt " + loginAttempts + " of 3.");

            }

        }

    }
});

document.getElementById("login-button-otp").addEventListener("click", () => {
    const entered = document.getElementById("otp").value.trim();
    if (entered === sessionOTP) {
        document.getElementById("otp-login").style.display = "none";
        window.location.href = "admin.html";
    } else {
        alert("Incorrect OTP. Please try again.");
    }
});

/* ─── CONTACT FORM → localStorage ─── */
document.getElementById("submit-btn").addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        alert("Please fill in all fields before submitting.");
        return;
    }

    // Load existing messages
    const messages = JSON.parse(localStorage.getItem("portfolio_messages") || "[]");

    // Add new message
    messages.unshift({
        name,
        email,
        message,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    });

    localStorage.setItem("portfolio_messages", JSON.stringify(messages));

    // Clear form
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("message").value = "";

    // Show toast
    const toast = document.getElementById("submit-toast");
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3500);
});

/* ─── APPLY ADMIN UPDATES ON PAGE LOAD ─── */

// Tech stack: rebuild from localStorage if admin made changes
(function applyTechStack() {
    const saved = localStorage.getItem("portfolio_techstack");
    const list = saved ? JSON.parse(saved) : DEFAULT_TECH;
    const container = document.getElementById("tech-stack");
    container.innerHTML = "";

    list.forEach(item => {
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = item.name;
        img.dataset.name = item.name;
        container.appendChild(img);
    });

    // Re-attach tooltips to the newly created images
    attachTooltip(container.querySelectorAll("img"));
})();

// Project images: overwrite grid srcs if admin swapped any photos
(function applyProjectImages() {
    const saved = localStorage.getItem("portfolio_project_images");
    if (!saved) return;
    const data = JSON.parse(saved);

    ["gd-grid", "merch-grid"].forEach(gridId => {
        if (!data[gridId]) return;
        const imgs = document.querySelectorAll("#" + gridId + " img");
        imgs.forEach((img, i) => {
            if (data[gridId][i]) img.src = data[gridId][i];
        });
    });
})();


function updateSpanBreaks() {
    const isMobile = window.innerWidth <= 798;
    const dSpan = document.querySelector('.designer span');
    const aSpan = document.querySelector('.aspiring span');

    if (isMobile) {
        dSpan.innerHTML = '// Currently studying<br>BS Information<br>Technology';
        aSpan.innerHTML = '// Graphic Designer<br>focusing on UI/UX<br>Designer';
    } else {
        dSpan.innerHTML = '// Currently studying<br>BS Information Technology';
        aSpan.innerHTML = '// Graphic Designer<br>focusing on UI/UX Design';
    }
}

// Run on load and on every resize
updateSpanBreaks();
window.addEventListener('resize', updateSpanBreaks);
