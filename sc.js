const Nightmare = require('nightmare')

const DatabaseManager = require('./dbModule');
  
const dbWorker = new DatabaseManager.DatabaseObject()

let lastLink = false

async function Sreal(url){
  const nightmare = Nightmare({ show: true })

  let PropertyArray = await nightmare
  .goto(url)
  .wait('.dir-property-list')
  .wait(2000)
  .evaluate(() => {
      let arrayProp = [];
      let realitky = document.querySelectorAll(".property");
      realitky.forEach((item) => {

        let baseName = item.querySelector('.name').innerText
        let baseLocation = item.querySelector('.locality').innerText
        let basePrice = item.querySelector('.norm-price').innerText
        let source = item.querySelector('a').href
        let images = item.querySelectorAll('.img')

        let images_links = ""

        images.forEach((item,index,arr) => {
          if(index == arr.length - 1){
            images_links += (item.src)
          }else{
            images_links += (item.src + '#')
          }
        })

        let typeflat
        let areaflat
        
        let typeRegex = /\d[+]([\d]|kk)/
        if(baseName.match(typeRegex)){
          let typeObj = typeRegex.exec(baseName)
          typeflat = typeObj[0]
        }
        else{
          typeflat = "pokoj"
        }
        
        let areaRegex = /\d+(?=[\u00a0]m)/
        if(baseName.match(areaRegex)){
          let areaObj = areaRegex.exec(baseName)
          areaflat = areaObj[0]
        }
        else{
          areaflat = 0        
        }

        let mesto = baseLocation;
        let ulice = "";
        let mestskaCast = "";
        let cena;

        let cenaReg = /\d+[\u00a0]\d+/
        if(basePrice.match(cenaReg)){

        console.log(cenaReg);
        if(basePrice.match(cenaReg)){
          cena = cenaReg.exec(basePrice)[0]
        }else{
          cena = 0
        }

        cena = cena.replace(/\s/,'')
      }
      else{
        cena = 0;
      }

        if (baseLocation.includes(",")){
            ulice = baseLocation.split(",")[0];
            ulice = ulice.trim()
            mesto = mesto.replace(ulice,"");
            mesto = mesto.replace(",","")
        }

        if (baseLocation.includes("-")){
            mestskaCast = baseLocation.split("-")[1];
            mestskaCast = mestskaCast.trim();
            mesto = mesto.replace(mestskaCast,"");
            mesto = mesto.replace("-","")
            mesto = mesto.trim()
        }

        let d = new Date()
        d = Date.now()
        let dstr = new Date(d).toUTCString()

        let obj = {
          add_date: dstr,//Date.now().toISOString(),
          p_type: 'byt',
          p_pay: 'najem',
          p_tflat: typeflat,
          p_area: Number(areaflat),
          price: cena,
          street: ulice,
          city: mesto,
          district: mestskaCast,
          source: "Sreality.cz",
          link: item.querySelector('a').href,
          img: images_links,
          duplicities: false
        }

        arrayProp.push(obj)

      });
      return arrayProp
    })
  .end()
  .then((items) => {
    //return items
    

    return items
  })
  .catch(error => {
    console.error('Search failed:', error)
  })
  return PropertyArray

}

async function doAll(){
  try{

    var lastLink = false
    var ind = 1;
    let last_row = await dbWorker.selectLastRow('properties')

    while(lastLink === false){

      let results = await Sreal("https://www.sreality.cz/hledani/pronajem/byty?strana=" + ind)
      results.forEach(async(item) => {
        if(last_row.link != item.link){
        const r = await dbWorker.insertIntoChecked('properties',item)
        }
        else{
            lastLink = true
        }
        
    })
      ind++
    }

  }
  catch(err){
    console.log(err);
  }
 
}

doAll()




  

  
  


