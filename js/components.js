
const EYE_LOGO_SVG = `
<svg class="eye-logo" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M2 20C2 20 10 8 20 8C30 8 38 20 38 20C38 20 30 32 20 32C10 32 2 20 2 20Z" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>
  <circle cx="20" cy="20" r="7" fill="#00B894"/>
  <circle cx="20" cy="20" r="3" fill="currentColor"/>
  <circle cx="22.3" cy="17.7" r="1.3" fill="#fff"/>
</svg>`;

const NAV_ITEMS = [
  {href:"index.html", label:"Home"},
  {href:"about.html", label:"About"},
  {href:"doctors.html", label:"Doctors"},
  {href:"treatments.html", label:"Treatments"},
  {href:"diseases.html", label:"Eye Diseases"},
  {href:"gallery.html", label:"Gallery"},
  {href:"blog.html", label:"Blog"},
  {href:"faq.html", label:"FAQ"},
  {href:"contact.html", label:"Contact"},
];

function currentPage(){
  const p = location.pathname.split("/").pop();
  return p === "" ? "index.html" : p;
}

function renderHeader(){
  const cur = currentPage();
  const links = NAV_ITEMS.map(i => `<a href="${i.href}" class="${cur===i.href?'active':''}">${i.label}</a>`).join("");
  const mobileLinks = NAV_ITEMS.concat([{href:"appointment.html",label:"Book Appointment"},{href:"testimonials.html",label:"Testimonials"},{href:"emergency.html",label:"Emergency Care"}])
    .map(i => `<a href="${i.href}" class="${cur===i.href?'active':''}">${i.label}</a>`).join("");

  document.getElementById("app-header").innerHTML = `
  <div class="header-fixed">
    <div class="emg-strip">
      24/7 Eye Emergency Helpline: <a href="tel:+911234567890">+91 12345 67890</a> &nbsp;|&nbsp; <a href="emergency.html">Emergency Care Info →</a>
    </div>
    <header class="navbar" id="navbar">
      <div class="container">
        <a href="index.html" class="brand">${EYE_LOGO_SVG}<span>Netra<em>Vision</em></span></a>
        <nav class="nav-links">${links}</nav>
        <div class="nav-actions">
          <button class="icon-btn" id="searchToggle" title="Search Doctor" aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          </button>
          <button class="icon-btn" id="themeToggle" title="Dark / Light Mode" aria-label="Toggle theme">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z"/></svg>
          </button>
          <button class="icon-btn" id="loginToggle" title="Patient / Doctor Login" aria-label="Login">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>
          </button>
          <button class="hamburger" id="hamburgerBtn" aria-label="Menu"><span></span><span></span><span></span></button>
        </div>
      </div>
    </header>
  </div>
  <div class="mobile-panel" id="mobilePanel">
    ${mobileLinks}
    <a href="tel:+911234567890" class="btn btn-accent btn-block" style="margin-top:20px">Call Now: +91 12345 67890</a>
  </div>
  <div class="modal-overlay" id="loginModal">
    <div class="modal-box">
      <button class="modal-close" id="modalClose">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <div class="modal-tabs">
        <button class="active" data-tab="patient">Patient Login</button>
        <button data-tab="doctor">Doctor Login</button>
        <button data-tab="admin">Admin</button>
      </div>
      <h3 id="modalTitle">Patient Login</h3>
      <p>Access your reports, appointments and prescriptions.</p>
      <form onsubmit="event.preventDefault(); alert('Demo only — login flow is not connected to a live backend.');">
        <div class="field" style="margin-bottom:14px;"><label>Mobile / Email</label><input type="text" placeholder="Enter mobile number or email" required></div>
        <div class="field" style="margin-bottom:20px;"><label>Password</label><input type="password" placeholder="Enter password" required></div>
        <button class="btn btn-primary btn-block" type="submit">Login</button>
      </form>
    </div>
  </div>`;

  // scroll style
  const nav = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 30);
  });

  // hamburger
  const panel = document.getElementById("mobilePanel");
  document.getElementById("hamburgerBtn").addEventListener("click", () => panel.classList.toggle("open"));
  panel.querySelectorAll("a").forEach(a => a.addEventListener("click", () => panel.classList.remove("open")));

  // theme toggle
  const themeBtn = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("nv-theme");
  if(savedTheme === "dark"){ document.documentElement.setAttribute("data-theme","dark"); }
  themeBtn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if(isDark){ document.documentElement.removeAttribute("data-theme"); localStorage.setItem("nv-theme","light"); }
    else { document.documentElement.setAttribute("data-theme","dark"); localStorage.setItem("nv-theme","dark"); }
  });

  // login modal
  const modal = document.getElementById("loginModal");
  document.getElementById("loginToggle").addEventListener("click", () => modal.classList.add("open"));
  document.getElementById("modalClose").addEventListener("click", () => modal.classList.remove("open"));
  modal.addEventListener("click", (e) => { if(e.target === modal) modal.classList.remove("open"); });
  modal.querySelectorAll(".modal-tabs button").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      modal.querySelectorAll(".modal-tabs button").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      const map = {patient:"Patient Login", doctor:"Doctor Login", admin:"Admin Dashboard"};
      document.getElementById("modalTitle").textContent = map[btn.dataset.tab];
    });
  });

  // search toggle -> go to doctors page with focus on search
  document.getElementById("searchToggle").addEventListener("click", () => {
    if(cur === "doctors.html"){
      const s = document.getElementById("doctorSearch");
      if(s){ s.focus(); s.scrollIntoView({behavior:"smooth", block:"center"}); }
    } else {
      window.location.href = "doctors.html";
    }
  });
}

function renderFooter(){
  document.getElementById("app-footer").innerHTML = `
  <footer>
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">${EYE_LOGO_SVG}<span>Netra Vision</span></div>
          <p style="color:#9DB8CE;font-size:.9rem;margin-bottom:18px;">A multi-specialty eye hospital dedicated to preserving and restoring vision with advanced technology and compassionate care.</p>
          <div class="footer-social">
            <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.5c0-.9.25-1.5 1.55-1.5H16.5V4.3C16.2 4.26 15.2 4.17 14 4.17c-2.4 0-4 1.46-4 4.15V10.5H7.5v3H10V21h3.5z"/></svg></a>
            <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg></a>
            <a href="#" aria-label="Twitter"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 00-7 3.7A11.6 11.6 0 013 4.9a4.1 4.1 0 001.3 5.5c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4a4.2 4.2 0 01-1.9.1 4.1 4.1 0 003.8 2.9A8.3 8.3 0 012 18.6a11.7 11.7 0 006.3 1.8c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.3z"/></svg></a>
            <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="3"/><path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none"/></svg></a>
          </div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="about.html">About Us</a></li>
            <li><a href="doctors.html">Our Doctors</a></li>
            <li><a href="treatments.html">Eye Treatments</a></li>
            <li><a href="testimonials.html">Testimonials</a></li>
            <li><a href="gallery.html">Gallery</a></li>
          </ul>
        </div>
        <div>
          <h4>Patient Help</h4>
          <ul>
            <li><a href="appointment.html">Book Appointment</a></li>
            <li><a href="faq.html">FAQs</a></li>
            <li><a href="emergency.html">Emergency Care</a></li>
            <li><a href="blog.html">Eye Care Tips</a></li>
            <li><a href="contact.html">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h4>Stay Updated</h4>
          <p style="color:#9DB8CE;font-size:.88rem;margin-bottom:14px;">Subscribe for eye care tips & hospital updates.</p>
          <form class="newsletter" onsubmit="event.preventDefault(); this.reset(); alert('Thanks for subscribing!');">
            <input type="email" placeholder="Your email address" required>
            <button type="submit">Join</button>
          </form>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 Netra Vision Eye Hospital. All rights reserved.</span>
        <span>Designed with care for healthier vision.</span>
      </div>
    </div>
  </footer>`;
}

function renderFloating(){
  document.getElementById("app-floating").innerHTML = `
  <div class="floating-actions">
    <a class="fab fab-emergency" href="emergency.html" title="Emergency Eye Care" aria-label="Emergency">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l9 4.5V12c0 5.5-3.8 9.7-9 10-5.2-.3-9-4.5-9-10V6.5L12 2z"/><path d="M12 8v5M12 16h.01"/></svg>
    </a>
    <a class="fab fab-whatsapp" href="https://wa.me/911234567890" target="_blank" title="Chat on WhatsApp" aria-label="WhatsApp">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11 11 0 003.8 17.4L2 22l4.7-1.7A11 11 0 1020.5 3.5zM12 20a8 8 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1112 20zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.1-.3.2-.5.1a6.6 6.6 0 01-1.9-1.2 7.2 7.2 0 01-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4c-.1-.1-.5-1.3-.7-1.7-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 3.9 3.5.5.2 1 .4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1z"/></svg>
    </a>
    <button class="fab fab-chat" id="liveChatBtn" title="Live Chat" aria-label="Live chat">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a8 8 0 01-11.4 7.2L3 21l1.8-6.6A8 8 0 1121 12z"/></svg>
    </button>
  </div>`;
  document.getElementById("liveChatBtn").addEventListener("click", () => {
    alert("👋 Hi! Our live chat support is available Mon–Sat, 9 AM – 8 PM.\nFor immediate help call +91 12345 67890.");
  });
}

function initLoader(){
  const loader = document.getElementById("site-loader");
  if(!loader) return;
  const already = sessionStorage.getItem("nv-loaded");
  const duration = already ? 400 : 2600;
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("hide");
      sessionStorage.setItem("nv-loaded","1");
    }, duration);
  });
  // fallback in case load event already fired
  setTimeout(() => { loader.classList.add("hide"); }, duration + 2500);
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  renderFloating();
  initLoader();
});
window.addEventListener('load', () => {
    const loader = document.getElementById('site-loader');

    setTimeout(() => {
        loader.classList.add('hide');

        setTimeout(() => {
            loader.remove();
        }, 700);

    }, 3000);
});