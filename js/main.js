

/* ---------- Scroll reveal (AOS-style) ---------- */
function initScrollReveal(){
  const els = document.querySelectorAll("[data-aos]");
  if(!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        const delay = e.target.getAttribute("data-aos-delay") || 0;
        setTimeout(()=> e.target.classList.add("aos-in"), delay);
        io.unobserve(e.target);
      }
    });
  }, {threshold:.15});
  els.forEach(el => io.observe(el));
}

/* ---------- Animated counters ---------- */
function initCounters(){
  const counters = document.querySelectorAll("[data-count]");
  if(!counters.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        animateCount(e.target);
        io.unobserve(e.target);
      }
    });
  },{threshold:.4});
  counters.forEach(c=>io.observe(c));
}
function animateCount(el){
  const target = parseInt(el.getAttribute("data-count"),10);
  const suffix = el.getAttribute("data-suffix") || "";
  const dur = 1800;
  const start = performance.now();
  function tick(now){
    const p = Math.min((now-start)/dur, 1);
    const eased = 1 - Math.pow(1-p, 3);
    el.textContent = Math.round(eased * target).toLocaleString() + suffix;
    if(p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ---------- FAQ Accordion ---------- */
function initAccordion(){
  document.querySelectorAll(".faq-item").forEach(item=>{
    const q = item.querySelector(".faq-q");
    q.addEventListener("click", ()=>{
      const isOpen = item.classList.contains("open");
      item.closest(".faq-list")?.querySelectorAll(".faq-item").forEach(i=>i.classList.remove("open"));
      if(!isOpen) item.classList.add("open");
    });
  });
}

/* ---------- Testimonial slider ---------- */
function initTestimonialSlider(){
  const slider = document.querySelector(".t-slider");
  if(!slider) return;
  const track = slider.querySelector(".t-track");
  const slides = slider.querySelectorAll(".t-slide");
  const dotsWrap = slider.parentElement.querySelector(".t-dots");
  let idx = 0;
  slides.forEach((_,i)=>{
    const b = document.createElement("button");
    if(i===0) b.classList.add("active");
    b.addEventListener("click", ()=>go(i));
    dotsWrap.appendChild(b);
  });
  function go(i){
    idx = (i+slides.length)%slides.length;
    track.style.transform = `translateX(-${idx*100}%)`;
    dotsWrap.querySelectorAll("button").forEach((d,di)=>d.classList.toggle("active", di===idx));
  }
  slider.parentElement.querySelector(".t-arrow.prev")?.addEventListener("click", ()=>go(idx-1));
  slider.parentElement.querySelector(".t-arrow.next")?.addEventListener("click", ()=>go(idx+1));
  let auto = setInterval(()=>go(idx+1), 5000);
  slider.addEventListener("mouseenter", ()=>clearInterval(auto));
  slider.addEventListener("mouseleave", ()=>{ auto = setInterval(()=>go(idx+1), 5000); });
}

/* ---------- Gallery lightbox + filter ---------- */
function initGallery(){
  const items = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  if(!items.length) return;
  const lbImg = lightbox?.querySelector("img");
  items.forEach(it=>{
    it.addEventListener("click", ()=>{
      lbImg.src = it.querySelector("img").src;
      lightbox.classList.add("open");
    });
  });
  document.getElementById("lightboxClose")?.addEventListener("click", ()=>lightbox.classList.remove("open"));
  lightbox?.addEventListener("click",(e)=>{ if(e.target===lightbox) lightbox.classList.remove("open"); });

  const chips = document.querySelectorAll(".filter-chip[data-filter]");
  chips.forEach(chip=>{
    chip.addEventListener("click", ()=>{
      chips.forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      const f = chip.dataset.filter;
      items.forEach(it=>{
        it.style.display = (f==="all" || it.dataset.cat===f) ? "" : "none";
      });
    });
  });
}

/* ---------- Doctor search + department filter ---------- */
function initDoctorFilters(){
  const cards = document.querySelectorAll(".doc-card");
  if(!cards.length) return;
  const search = document.getElementById("doctorSearch");
  const chips = document.querySelectorAll(".filter-chip[data-dept]");
  function apply(){
    const q = (search?.value || "").toLowerCase();
    const activeChip = document.querySelector(".filter-chip[data-dept].active");
    const dept = activeChip ? activeChip.dataset.dept : "all";
    let visible = 0;
    cards.forEach(c=>{
      const name = c.dataset.name.toLowerCase();
      const matchesSearch = name.includes(q);
      const matchesDept = (dept==="all" || c.dataset.dept===dept);
      const show = matchesSearch && matchesDept;
      c.style.display = show ? "" : "none";
      if(show) visible++;
    });
    const empty = document.getElementById("doctorEmpty");
    if(empty) empty.style.display = visible===0 ? "block" : "none";
  }
  search?.addEventListener("input", apply);
  chips.forEach(chip=>{
    chip.addEventListener("click", ()=>{
      chips.forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      apply();
    });
  });
}

/* ---------- Treatments filter ---------- */
function initTreatmentFilter(){
  const chips = document.querySelectorAll(".filter-chip[data-tfilter]");
  const cards = document.querySelectorAll("[data-ttype]");
  if(!chips.length) return;
  chips.forEach(chip=>{
    chip.addEventListener("click", ()=>{
      chips.forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      const f = chip.dataset.tfilter;
      cards.forEach(c=>{
        c.style.display = (f==="all" || c.dataset.ttype===f) ? "" : "none";
      });
    });
  });
}

/* ---------- Before / After slider ---------- */
function initBeforeAfter(){
  document.querySelectorAll(".ba-wrap").forEach(wrap=>{
    const after = wrap.querySelector(".ba-after");
    const line = wrap.querySelector(".ba-slider-line");
    const handle = wrap.querySelector(".ba-handle");
    const range = wrap.querySelector(".ba-range");
    function setPos(pct){
      pct = Math.max(0,Math.min(100,pct));
      after.style.clipPath = `inset(0 0 0 ${pct}%)`;
      line.style.left = pct+"%";
      handle.style.left = pct+"%";
    }
    range?.addEventListener("input", (e)=> setPos(e.target.value));
  });
}

/* ---------- Appointment / Contact form submit (demo) ---------- */
function initForms(){
  document.querySelectorAll("form[data-demo-form]").forEach(form=>{
    form.addEventListener("submit", (e)=>{
      e.preventDefault();
      form.style.display = "none";
      const success = form.parentElement.querySelector(".form-success");
      if(success) success.classList.add("show");
      form.reset();
    });
  });
}

/* ---------- Hero eye pupil follows cursor slightly ---------- */
function initPupilTracking(){
  const pupils = document.querySelectorAll(".track-pupil");
  if(!pupils.length) return;
  document.addEventListener("mousemove",(e)=>{
    const cx = window.innerWidth/2, cy = window.innerHeight/2;
    const dx = (e.clientX-cx)/cx, dy = (e.clientY-cy)/cy;
    pupils.forEach(p=> p.style.transform = `translate(${dx*3}px, ${dy*3}px)`);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initCounters();
  initAccordion();
  initTestimonialSlider();
  initGallery();
  initDoctorFilters();
  initTreatmentFilter();
  initBeforeAfter();
  initForms();
  initPupilTracking();
});

window.addEventListener("load", function () {
    const loader = document.getElementById("site-loader");

    // Loader already shown in this browser tab
    if (sessionStorage.getItem("loaderShown")) {
        loader.remove();
        return;
    }

    // Mark loader as shown
    sessionStorage.setItem("loaderShown", "true");

    // Show loader for 3 seconds
    setTimeout(() => {
        loader.classList.add("hide");

        // Remove after fade-out animation
        setTimeout(() => {
            loader.remove();
        }, 700);

    }, 3000);
});