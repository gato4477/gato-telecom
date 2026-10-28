(function(){
  var b=document.querySelector('.mbtn'), n=document.getElementById('mnav');
  if(b&&n){b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false');document.body.style.overflow=o?'hidden':'';});}
})();
