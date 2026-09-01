(function(){
  var address=document.getElementById('url');
  var frame=document.getElementById('browser');
  var start=document.getElementById('startPage');
  var compat=document.getElementById('compatPage');
  var compatText=document.getElementById('compatText');
  var title=document.getElementById('tabTitle');
  var menu=document.getElementById('menu');
  var historyList=[];
  var historyIndex=-1;
  var currentTarget='';

  var directHosts=[
    'google.com','youtube.com','youtu.be','github.com','accounts.google.com',
    'facebook.com','instagram.com','x.com','twitter.com','netflix.com'
  ];

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

  function needsDirect(url){
    try{
      var host=new URL(url).hostname.toLowerCase().replace(/^www\./,'');
      return directHosts.some(function(item){return host===item||host.slice(-(item.length+1))==='.'+item;});
    }catch(e){return false;}
  }

  function remember(target,push){
    if(push===false)return;
    historyList=historyList.slice(0,historyIndex+1);
    historyList.push(target);
    historyIndex=historyList.length-1;
  }

  function showCompat(target){
    currentTarget=target;
    start.style.display='none';
    frame.style.display='none';
    compat.classList.remove('hidden');
    compatText.textContent=hostLabel(target)+' blocks iframe display. Direct Mode opens the real website instead of showing a broken page.';
  }

  function openDirect(target){
    target=target||currentTarget||normalize(address.value);
    if(!target)return;
    currentTarget=target;
    var opened=null;
    try{opened=window.open(target,'_blank');}catch(e){}
    if(!opened){window.location.href=target;}
  }

  function navigate(value,push){
    var target=normalize(value);
    if(!target)return;
    remember(target,push);
    currentTarget=target;
    address.value=target;
    title.textContent=hostLabel(target);
    menu.classList.add('hidden');
    if(needsDirect(target)){
      showCompat(target);
      return;
    }
    compat.classList.add('hidden');
    start.style.display='none';
    frame.style.display='block';
    frame.src=target;
  }

  function showHome(){
    frame.style.display='none';
    frame.src='about:blank';
    compat.classList.add('hidden');
    start.style.display='flex';
    address.value='';
    title.textContent='New Tab';
    currentTarget='';
    try{address.focus();}catch(e){}
  }

  window.loadPage=function(){navigate(address.value,true);};
  document.getElementById('addressForm').addEventListener('submit',function(e){e.preventDefault();navigate(address.value,true);});
  document.getElementById('homeSearchForm').addEventListener('submit',function(e){e.preventDefault();navigate(document.getElementById('homeSearch').value,true);});
  Array.prototype.forEach.call(document.querySelectorAll('.shortcut'),function(el){el.addEventListener('click',function(){navigate(el.getAttribute('data-url'),true);});});
  document.getElementById('backBtn').addEventListener('click',function(){if(historyIndex>0){historyIndex--;navigate(historyList[historyIndex],false);}else showHome();});
  document.getElementById('forwardBtn').addEventListener('click',function(){if(historyIndex<historyList.length-1){historyIndex++;navigate(historyList[historyIndex],false);}});
  document.getElementById('reloadBtn').addEventListener('click',function(){if(frame.style.display==='block'&&frame.src){var src=frame.src;frame.src='about:blank';setTimeout(function(){frame.src=src;},30);}else if(currentTarget){navigate(currentTarget,false);}});
  document.getElementById('homeBtn').addEventListener('click',showHome);
  document.getElementById('menuBtn').addEventListener('click',function(){menu.classList.toggle('hidden');});
  document.getElementById('menuHome').addEventListener('click',function(){menu.classList.add('hidden');showHome();});
  document.getElementById('menuReload').addEventListener('click',function(){menu.classList.add('hidden');document.getElementById('reloadBtn').click();});
  document.getElementById('menuDirect').addEventListener('click',function(){menu.classList.add('hidden');openDirect();});
  document.getElementById('openDirectBtn').addEventListener('click',function(){openDirect(currentTarget);});
  document.getElementById('cancelDirectBtn').addEventListener('click',showHome);
  document.getElementById('fullscreenBtn').addEventListener('click',function(){menu.classList.add('hidden');var el=document.documentElement;if(el.requestFullscreen)el.requestFullscreen();else if(el.webkitRequestFullscreen)el.webkitRequestFullscreen();});
  document.getElementById('bookmarkBtn').addEventListener('click',function(){this.textContent=this.textContent==='★'?'☆':'★';});
  document.querySelector('.new-tab').addEventListener('click',showHome);
  document.querySelector('.tab-close').addEventListener('click',showHome);
  address.addEventListener('focus',function(){try{this.select();}catch(e){}});
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){menu.classList.add('hidden');}
    if((e.ctrlKey||e.metaKey)&&String(e.key).toLowerCase()==='l'){e.preventDefault();address.focus();}
    if(e.key==='F5'){e.preventDefault();document.getElementById('reloadBtn').click();}
    if(e.key==='Enter'&&document.activeElement===document.getElementById('openDirectBtn'))openDirect(currentTarget);
  });

  showHome();
})();
