
module.exports = {

  DatabaseObject: class DatabaseWorker {
      constructor(){
    
          this.postgrade = require('pg')
    
          this.pool = new this.postgrade.Pool({
              user: '',
              host: '',
              database: '',
              password: '',
              port: 5432,
            })
      }
    
      selectLastRow(table){
          return new Promise((resolve, reject) => {
              let q = "SELECT * FROM " + table + " ORDER BY ID DESC LIMIT 1"
     
              this.pool.query(q, (err,res) => {
                if (!err){
                  resolve(res.rows[0])
                }else{
                  reject(err)
                }
    
              })
            })
      }
    
      async insertInto(table,rows,valIn){
        let dollarSign = ""
        for(var i = 1;i<valIn.length+1;i++){
          if (i != valIn.length){
            dollarSign += String("$" + i + ",")
          }else{
            dollarSign += String("$" + i )
          }
        }
      
        const q = {
          text: "INSERT INTO " + table + " (" + rows + ") VALUES (" + dollarSign + ");",
          values: valIn
        }  
        const res = this.pool.query(q)
      
      }
    
      async checkSame(table,data){
        return new Promise((resolve, reject) => {
        let rows = ""
        let rowsArr = Object.keys(data)
        let validItems = ['p_type','p_pay','p_tflat','p_area','street','city','source']
        for(let i = 0; i < validItems.length; i++){
          let atr = validItems[i]
    
          if(i == validItems.length-1){
            atr === 'p_area' ? rows += (atr + "='" + data[atr] + "'") : rows += (atr + " ILIKE '" + data[atr] + "'")
          }else{
            atr === 'p_area' ? rows += (atr + "='" + data[atr] + "' AND ") : rows += (atr + " ILIKE '" + data[atr] + "' AND ")
          }
        }
    
        let q = "SELECT * FROM " + table + " WHERE " + rows
        this.pool.query(q, (err,res) => {
          if(!err){
            let found
            
            if(res.rowCount > 0  && res.rows[0].source != data.source){
              found = true
            }
            else{
              found = false
            }
            resolve({found,res,q})
          }else{
            reject(err,q)
          }
    
        })
      })
      }
    
      async insertIntoChecked(table,data){
        try{
          let rows = ""
          let values = []
            let canBeSame = await this.checkSame(table,data)
            if(canBeSame.found){
              console.log("need  more check")
            }else{
              let rowsArr = Object.keys(data)
              rowsArr.forEach((item,index,arr)=>{
                if(index == arr.length - 1){
                  rows += item
                }else{
                  rows += (item + ",")
                }
              })
              for(var i = 0;i<rowsArr.length;i++){
                let name = rowsArr[i]
                values.push(data[name])
              }
              await this.insertInto(table,rows,values)
            }
         
        }catch(err){
          console.log(err);
        }
      }
    }
  
  }
  
      // let obj = {
      // p_type: "byt-test",
      // p_pay: "prodej",
      // p_tflat: "4+1",
      // p_area: 120,
      // price: "7000000",
      // street: "test-ová",
      // city: "praha",
      // district: "kokotín",
      // source: "test",
      // link: "test-odkaz.com/Test1",
      // img: "test-odkaz.com/kokot/img1",
      // duplicities: false
      // }
  
  
  
  // async function doit(){
  //   const db = new DatabaseWorker()
  //   const res = await db.insertIntoChecked('properties',obj)
  //   console.log(res);
  // }
  
  // doit()
  
  