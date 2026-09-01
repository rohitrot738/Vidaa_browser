(function(){
  'use strict';
  var address=document.getElementById('url');
  var frame=document.getElementById('browser');
  var start=document.getElementById('startPage');
  var compat=document.getElementById('compatPage');
  var compatText=document.getElementById('compatText');
  var title=document.getElementById('tabTitle');
  var menu=document.getElementById('menu');
  var currentTarget='';

  var embeddedBlockedHosts=[
    'google.com','youtube.com','youtu.be','github.com','accounts.google.com',
    'facebook.com','instagram.com','x.com','twitter.com','netflix.com'
  ];

  function needsFullPage(url){
    try{
      var host=new URL(url).hostname.toLowerCase().replace(/^www\./,'');
      return embeddedBlockedHosts.some(function(item){return host===item||host.slice(-(item.length+1))==='.'+item;});
    }catch(e){return false;}
  }

  function updateChrome(target){
    currentTarget=target;
    address.value=target;
    title.textContent=BrowserCore.hostname(target);
    menu.classList.add('hidden');
  }

  function showFullPagePrompt(target){
    updateChrome(target);
    start.style.display='none';
    frame.style.display='none';
    compat.classList.remove('hidden');
    compatText.textContent=BrowserCore.hostname(target)+' blocks embedded display. Open it in full-page mode using the VIDAA platform web engine.';
  }

  function openFullPage(target){
    target=target||currentTarget||BrowserCore.normalize(address.value);
    if(!target)return false;
    var adapter=BrowserCore.getNativeAdapter();
    if(adapter){
      try{return adapter.open(target)!==false;}catch(e){}
    }
    try{window.location.href=target;return true;}catch(e2){return false;}
  }

  function openWithoutHistory(target){
    if(!target)return;
    updateChrome(target);

    if(needsFullPage(target)){
      showFullPagePrompt(target);
      return;
    }

    compat.classList.add('hidden');
    start.style.display='none';
    frame.style.display='block';
    frame.src=target;
  }

  function navigate(value,push){
    var target=BrowserCore.normalize(value);
    if(!target)return;
    if(push!==false)BrowserCore.push(target);
    openWithoutHistory(target);
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

  window.VIDAA_UI={
    openWithoutHistory:openWithoutHistory,
    showHome:showHome,
    openFullPage:openFullPage
  };
  window.loadPage=function(){navigate(address.value,true);};

  document.getElementById('addressForm').addEventListener('submit',function(e){e.preventDefault();navigate(address.value,true);});
  document.getElementById('homeSearchForm').addEventListener('submit',function(e){e.preventDefault();navigate(document.getElementById('homeSearch').value,true);});
  Array.prototype.forEach.call(document.querySelectorAll('.shortcut'),function(el){el.addEventListener('click',function(){navigate(el.getAttribute('data-url'),true);});});
  document.getElementById('backBtn').addEventListener('click',function(){var u=BrowserCore.back();if(u)openWithoutHistory(u);else showHome();});
  document.getElementById('forwardBtn').addEventListener('click',function(){var u=BrowserCore.forward();if(u)openWithoutHistory(u);});
  document.getElementById('reloadBtn').addEventListener('click',function(){if(frame.style.display==='block'&&frame.src){var src=frame.src;frame.src='about:blank';setTimeout(function(){frame.src=src;},20);}else if(currentTarget)openWithoutHistory(currentTarget);});
  document.getElementById('homeBtn').addEventListener('click',showHome);
  document.getElementById('menuBtn').addEventListener('click',function(){menu.classList.toggle('hidden');});
  document.getElementById('menuHome').addEventListener('click',function(){menu.classList.add('hidden');showHome();});
  document.getElementById('menuReload').addEventListener('click',function(){menu.classList.add('hidden');document.getElementById('reloadBtn').click();});
  document.getElementById('menuDirect').addEventListener('click',function(){menu.classList.add('hidden');openFullPage();});
  document.getElementById('openDirectBtn').addEventListener('click',function(){openFullPage(currentTarget);});
  document.getElementById('cancelDirectBtn').addEventListener('click',showHome);
  document.getElementById('fullscreenBtn').addEventListener('click',function(){menu.classList.add('hidden');var el=document.documentElement;if(el.requestFullscreen)el.requestFullscreen();else if(el.webkitRequestFullscreen)el.webkitRequestFullscreen();});
  document.getElementById('bookmarkBtn').addEventListener('click',function(){this.textContent=this.textContent==='★'?'☆':'★';});
  document.querySelector('.new-tab').addEventListener('click',showHome);
  document.querySelector('.tab-close').addEventListener('click',showHome);
  address.addEventListener('focus',function(){try{this.select();}catch(e){}});
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape')menu.classList.add('hidden');
    if((e.ctrlKey||e.metaKey)&&String(e.key).toLowerCase()==='l'){e.preventDefault();address.focus();}
    if(e.key==='F5'){e.preventDefault();document.getElementById('reloadBtn').click();}
  });

  showHome();
})();
