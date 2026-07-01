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

  // service category tabs
  var segbtns=document.querySelectorAll('.seg .segbtn');
  if(segbtns.length){
    segbtns.forEach(function(b){
      b.addEventListener('click',function(){
        var cat=this.dataset.cat;
        segbtns.forEach(function(x){x.classList.remove('active');});
        this.classList.add('active');
        document.querySelectorAll('.cat-panel').forEach(function(p){
          p.classList.toggle('active',p.dataset.cat===cat);
        });
      });
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function(q){
    q.addEventListener('click',function(){
      var item=this.parentElement;
      var ans=item.querySelector('.faq-a');
      var open=item.classList.toggle('open');
      ans.style.maxHeight=open?ans.scrollHeight+'px':null;
    });
  });

  // service booking modal
  (function(){
    var modal=document.getElementById('bookModal');
    if(!modal) return;
    var content=document.getElementById('modalContent');
    var closeBtn=document.getElementById('modalClose');
    function fmt(n){return n.toLocaleString('en-US');}
    function esc(s){return (s||'').replace(/[<>&]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;'}[c];});}
    function closeModal(){modal.classList.remove('open');document.body.style.overflow='';}
    function openModal(svc,price){
      var quote=(price==='quote'), p=quote?0:parseInt(price,10), qty=1;
      modal.classList.add('open');document.body.style.overflow='hidden';
      render();
      function render(){
        content.innerHTML=
          '<div class="modal-head"><div class="mtitle">'+esc(svc)+'</div>'+
          (quote?'<div class="mprice">Price on request</div>':'<div class="mprice">From EGP '+fmt(p)+'</div>')+'</div>'+
          '<div class="modal-body">'+
          (quote?'':'<div class="field"><label>Quantity</label><div class="qty"><button type="button" id="qminus" aria-label="Decrease">&minus;</button><span id="qval">'+qty+'</span><button type="button" id="qplus" aria-label="Increase">+</button></div></div>')+
          '<div class="field"><label>Full name</label><input id="bkName" type="text" placeholder="Your name"></div>'+
          '<div class="field"><label>Phone</label><input id="bkPhone" type="tel" placeholder="Mobile number"></div>'+
          '<div class="field"><label>Community / address</label><input id="bkAddr" type="text" placeholder="e.g. Madinaty, B6"></div>'+
          '<div class="field"><label>Preferred date</label><input id="bkDate" type="date"></div>'+
          '<div class="field"><label>Notes (optional)</label><textarea id="bkNotes" rows="2" placeholder="Anything we should know"></textarea></div>'+
          (quote?'':'<div class="mtotal"><span>Estimated total</span><b id="bkTotal">EGP '+fmt(p)+'</b></div>')+
          '<div id="bkErr" style="color:#b00020;font-size:.85rem;margin-bottom:10px;display:none"></div>'+
          '<button class="btn" id="bkConfirm">'+(quote?'Request a Quote':'Confirm Booking')+'</button>'+
          '</div>';
        if(!quote){
          document.getElementById('qminus').onclick=function(){if(qty>1){qty--;upd();}};
          document.getElementById('qplus').onclick=function(){if(qty<20){qty++;upd();}};
        }
        document.getElementById('bkConfirm').onclick=confirmBooking;
      }
      function upd(){document.getElementById('qval').textContent=qty;document.getElementById('bkTotal').textContent='EGP '+fmt(p*qty);}
      function confirmBooking(){
        var name=(document.getElementById('bkName').value||'').trim();
        var phone=(document.getElementById('bkPhone').value||'').trim();
        var err=document.getElementById('bkErr');
        if(!name||!phone){err.textContent='Please add your name and phone so we can confirm.';err.style.display='block';return;}
        var ref='ORN-'+Math.random().toString(36).slice(2,7).toUpperCase();
        var total=quote?'Quote requested':'EGP '+fmt(p*qty);
        var addr=(document.getElementById('bkAddr').value||'').trim();
        var date=(document.getElementById('bkDate').value||'').trim();
        var notes=(document.getElementById('bkNotes').value||'').trim();
        var lines=['New '+(quote?'quote request':'booking'),'Service: '+svc,'Quantity: '+qty,'Total: '+total,'Name: '+name,'Phone: '+phone,'Address: '+addr,'Preferred date: '+date,'Notes: '+notes,'Reference: '+ref];
        var mail='mailto:bookings@orion-group.com?subject='+encodeURIComponent(svc+' - '+ref)+'&body='+encodeURIComponent(lines.join('\n'));
        content.innerHTML='<button class="modal-x" id="modalClose2" aria-label="Close">&times;</button><div class="modal-body"><div class="msuccess">'+
          '<div class="tick">&check;</div>'+
          '<h3 style="margin-bottom:8px">'+(quote?'Quote request received':'Booking received')+'</h3>'+
          '<p style="color:#505a70">Thanks '+esc(name.split(' ')[0])+'. Our team will call you on '+esc(phone)+' to confirm'+(quote?' your quote.':' and schedule.')+'</p>'+
          '<div class="ref">Reference: '+ref+'</div>'+
          '<a class="btn" href="tel:16286" style="margin-bottom:10px">Call 16286 to confirm</a>'+
          '<a class="btn dark" href="'+mail+'">Email my '+(quote?'request':'booking')+'</a>'+
          '</div></div>';
        var c2=document.getElementById('modalClose2'); if(c2)c2.onclick=closeModal;
      }
    }
    document.querySelectorAll('.tile').forEach(function(t){
      t.addEventListener('click',function(){openModal(t.dataset.svc,t.dataset.price);});
      t.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openModal(t.dataset.svc,t.dataset.price);}});
    });
    if(closeBtn)closeBtn.addEventListener('click',closeModal);
    modal.addEventListener('click',function(e){if(e.target===modal)closeModal();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal();});
  })();

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
