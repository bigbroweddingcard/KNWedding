// Builds index.html from src/ (styles, script, data) and assets/ (images embedded as data URIs).
// Run: node src/build.js
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const {shell}=require('./app.js');
const css=fs.readFileSync(path.join(__dirname,'app.css'),'utf8');
const js=fs.readFileSync(path.join(__dirname,'app.js'),'utf8');
if(/<\/script/i.test(js)||/<\/style/i.test(css))throw new Error('source must not contain a closing script/style tag');
const D=JSON.parse(fs.readFileSync(path.join(__dirname,'data.json'),'utf8'));
const uri=(f,t)=>'data:'+t+';base64,'+fs.readFileSync(path.join(root,'assets',f)).toString('base64');
const assets=JSON.stringify({monogram:uri('monogram.png','image/png'),monk:uri('ic-monk.png','image/png'),khanmak:uri('ic-khanmak.png','image/png'),
  couple:uri('ic-couple.png','image/png'),food:uri('ic-food.png','image/png'),qr:uri('qr-map.jpg','image/jpeg')});
fs.writeFileSync(path.join(root,'index.html'),shell(D,{css,js,assets}));
console.log('index.html',fs.statSync(path.join(root,'index.html')).size,'bytes');
