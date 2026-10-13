// Builds the site: index.html (card), admin/index.html (owner tools), app.css, app.js, config.js, assets.
// Usage:  node src/build.js          -> writes into ./site
//         node src/build.js .        -> writes into the repository root (GitHub Pages serves it)
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const out=path.resolve(root,process.argv[2]||'site');
const {htmlPage}=require('./app.js');
const D=JSON.parse(fs.readFileSync(path.join(__dirname,'data.json'),'utf8'));
fs.mkdirSync(path.join(out,'admin'),{recursive:true});
fs.writeFileSync(path.join(out,'index.html'),htmlPage(D,{base:'./'}));
fs.writeFileSync(path.join(out,'admin','index.html'),htmlPage(D,{base:'../',admin:true}));
for(const f of ['app.css','app.js'])fs.copyFileSync(path.join(__dirname,f),path.join(out,f));
// config.js holds the live Apps Script link: never overwrite one that exists
if(!fs.existsSync(path.join(out,'config.js')))fs.copyFileSync(path.join(__dirname,'config.js'),path.join(out,'config.js'));
if(path.resolve(out)!==path.resolve(root)){
  fs.mkdirSync(path.join(out,'assets'),{recursive:true});
  for(const f of fs.readdirSync(path.join(root,'assets')))fs.copyFileSync(path.join(root,'assets',f),path.join(out,'assets',f));
}
fs.writeFileSync(path.join(out,'.nojekyll'),'');
console.log('built into',out);
