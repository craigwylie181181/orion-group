// Orion Group shared scripts
document.addEventListener('DOMContentLoaded',function(){
  // year
  var yr=document.getElementById('yr'); if(yr)yr.textContent=new Date().getFullYear();

  // mobile menu
  var burger=document.getElementById('burger'),menu=document.getElementById('menu');
  if(burger&&menu){
    burger.addEventListener('click',function(){menu.classList.toggle('open');});
  }
  // mobile submenu toggles (tap parent with caret to expand)
  document.querySelectorAll('.menu>li>a .car').forEach(function(car){
    car.parentElement.addEventListener('click',function(e){
      if(window.innerWidth<=900){
        e.preventDefault();
        this.parentElement.classList.toggle('open-sub');
      }
    });
  });
  // close mobile menu after clicking a real link
  document.querySelectorAll('.dropdown a, .menu>li>a:not(:has(.car))').forEach(function(a){
    a.addEventListener('click',function(){ if(menu)menu.classList.remove('open'); });
  });

  // reveal on scroll
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.15});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  // animated counters
  function runCount(el){
    var target=+el.dataset.count, suf=el.dataset.suffix||'', dur=1400, t0=performance.now();
    function step(now){
      var p=Math.min((now-t0)/dur,1), val=Math.round(p*target);
      el.textContent=val+suf;
      if(p<1)requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var co=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){runCount(e.target);co.unobserve(e.target);}});},{threshold:.6});
  document.querySelectorAll('.num').forEach(function(el){co.observe(el);});

  // news country filter
  var fbtns=document.querySelectorAll('.fbtn');
  if(fbtns.length){
    fbtns.forEach(function(btn){
      btn.addEventListener('click',function(){
        var c=this.dataset.country;
        fbtns.forEach(function(b){b.classList.remove('active');});
        this.classList.add('active');
        document.querySelectorAll('.ncard').forEach(function(card){
          var match=(c==='all'||card.dataset.country===c);
          card.classList.toggle('hide',!match);
        });
      });
    });
  }
});
