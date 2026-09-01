(function(){
  var address=document.getElementById('url');
  var frame=document.getElementById('browser');
  var start=document.getElementById('startPage');
  var title=document.getElementById('tabTitle');
  var menu=document.getElementById('menu');
  var historyList=[];
  var historyIndex=-1;

  function normalize(value){
    value=(value||'').trim();
    if(!value)return '';
    if(/^https?:\/\//i.test(value))return value;
    if(/^www\./i.test(value)||(/^[^\s]+\.[a-z]{2,}(\/.*)?$/i.test(value)))return 'https://'+value;
    return 'https://www.google.com/search?q='+encodeURIComponent(value);
  }

  function hostLabel(url){
    try{return new URL(url).hostname.replace(/^www\./,'')||'New Tab';}catch(e){return 'New Tab';}
  }

  function navigate(value,push){
    var target=normalize(value);
    if(!target)return;
    if(push!==false){historyList=historyList.slice(0,historyIndex+1);historyList.push(target);historyIndex=historyList.length-1;}
    address.value=target;
    title.textContent=hostLabel(target);
    start.style.display='none';
    frame.style.display='block';
    frame.src=target;
  }

  function showHome(){
    frame.style.display='none';frame.src='about:blank';start.style.display='flex';address.value='';title.textContent='New Tab';address.focus();
  }

  window.loadPage=function(){navigate(address.value,true);};
  document.getElementById('addressForm').addEventListener('submit',function(e){e.preventDefault();navigate(address.value,true);});
  document.getElementById('homeSearchForm').addEventListener('submit',function(e){e.preventDefault();navigate(document.getElementById('homeSearch').value,true);});
  Array.prototype.forEach.call(document.querySelectorAll('.shortcut'),function(el){el.addEventListener('click',function(){navigate(el.getAttribute('data-url'),true);});});
  document.getElementById('backBtn').addEventListener('click',function(){if(historyIndex>0){historyIndex--;navigate(historyList[historyIndex],false);}else showHome();});
  document.getElementById('forwardBtn').addEventListener('click',function(){if(historyIndex<historyList.length-1){historyIndex++;navigate(historyList[historyIndex],false);}});
  document.getElementById('reloadBtn').addEventListener('click',function(){if(frame.style.display==='block'){var src=frame.src;frame.src=src;}});
  document.getElementById('homeBtn').addEventListener('click',showHome);
  document.getElementById('menuBtn').addEventListener('click',function(){menu.classList.toggle('hidden');});
  document.getElementById('menuHome').addEventListener('click',function(){menu.classList.add('hidden');showHome();});
  document.getElementById('menuReload').addEventListener('click',function(){menu.classList.add('hidden');document.getElementById('reloadBtn').click();});
  document.getElementById('fullscreenBtn').addEventListener('click',function(){menu.classList.add('hidden');var el=document.documentElement;if(el.requestFullscreen)el.requestFullscreen();else if(el.webkitRequestFullscreen)el.webkitRequestFullscreen();});
  document.getElementById('bookmarkBtn').addEventListener('click',function(){this.textContent=this.textContent==='★'?'☆':'★';});
  document.querySelector('.new-tab').addEventListener('click',showHome);
  document.querySelector('.tab-close').addEventListener('click',showHome);
  address.addEventListener('focus',function(){try{this.select();}catch(e){}});
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){menu.classList.add('hidden');}
    if((e.ctrlKey||e.metaKey)&&String(e.key).toLowerCase()==='l'){e.preventDefault();address.focus();}
    if(e.key==='F5'){e.preventDefault();document.getElementById('reloadBtn').click();}
  });
  showHome();
})();
