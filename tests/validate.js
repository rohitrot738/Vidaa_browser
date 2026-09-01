const fs=require('fs');
const vm=require('vm');

const files=['browser-core.js','vidaa-adapter.js','remote.js','script.js'];
for(const file of files){
  const src=fs.readFileSync(file,'utf8');
  new vm.Script(src,{filename:file});
  console.log('syntax ok:',file);
}

const html=fs.readFileSync('index.html','utf8');
const requiredIds=['url','browser','startPage','compatPage','compatText','tabTitle','menu','backBtn','forwardBtn','reloadBtn','homeBtn','addressForm','homeSearchForm','menuBtn','menuHome','menuReload','menuDirect','openDirectBtn','cancelDirectBtn','fullscreenBtn','bookmarkBtn'];
for(const id of requiredIds){
  if(!new RegExp(`id=["']${id}["']`).test(html)) throw new Error('Missing required element id: '+id);
}
for(const script of ['vidaa-adapter.js','browser-core.js','remote.js','script.js']){
  if(!html.includes(`src="${script}"`)) throw new Error('Missing script include: '+script);
}

const manifest=JSON.parse(fs.readFileSync('manifest.template.json','utf8'));
for(const key of ['id','name','version','type','entry']){
  if(!manifest[key]) throw new Error('Manifest template missing '+key);
}
if(manifest.entry!=='index.html') throw new Error('Manifest entry must be index.html');

console.log('HTML wiring ok');
console.log('manifest template ok');
console.log('VALIDATION PASSED');
