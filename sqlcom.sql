CREATE TAbLE "properties"(
    id SERIAL NOT NULL,
    add_date DATE,
    p_type VARCHAR(50),
    p_pay VARCHAR(50),
    p_tflat VARCHAR(50),
    p_area INTEGER,
    price REAL,
    street VARCHAR(255),
    city VARCHAR(255),
    district VARCHAR(255),
    source VARCHAR(255),
    link TEXT,
    img TEXT,
    duplicities BOOLEAN
)

INSERT INTO properties(p_type,p_pay,p_tflat,p_area,price,street,city,district,source,link,img,duplicities) VALUES ('byt','najem','2+kk',10000,'test','test','test','sTEst.com','http://link.com/test','http://link.com/test/img01',false);

 if(last_row.link != data.link){
    let rows = ""
    let values = ""

    let rowsArr = Object.keys(data)
    rowsArr.forEach((item, index, arr) => {
        if(index == arr.length - 1){
          rows += item
        }else{
          rows += (item + ",")
        }

        

    })

    for(i = 0;i<rowsArr.length;i++){
        let name = rowsArr[i]
        if(i == rowsArr.length - 1){
          values += ("'" + data[name] + "'")
        }else{
          values += ("'" + data[name] + "',")
        }
    }
