function handleFile() {
  //get  the file that is from the input field
  const fileInput = document.getElementById("csvFileInput");
  const file = fileInput.files[0];
  if(file === undefined)
  {
    document.getElementById('error').innerText="please a select a filez first "
    return;
  }
  const reader = new FileReader();

  reader.onload = function (e) {
    const contents = e.target.result;
    parseCSVData(contents);
  };

  reader.readAsText(file);
}

//Handle the csv data
function parseCSVData(contents) {
  let heading = ["URL", "Overview"];
  let OutputVal = [];
  let urls = [];
  const lines = contents.split("\n");

  lines.forEach((line) => {
    const [url, description] = line.split(",");
    const urlElements = url.split("/");
    const dataInd = urlElements.indexOf("data");
    
    if (dataInd != -1) {
      //get the base url
      let baseURL= url.substring(0, url.indexOf(urlElements[dataInd + 1]));
      baseURL += `${urlElements[dataInd + 1]}`;
      //check if it is already in the urls and if present add the new field
      if (urls.includes(baseURL)) {
        let ind = urls.indexOf(baseURL);
        //if new column found add it to the heading
        let column = urlElements[dataInd + 2];
        if (!heading.includes(column)) {
          heading.push(column);
        }
        //Update field of the url
        OutputVal = OutputVal.map((row, index) => {
          if (ind == index) {
            row[column] = description.trim();
          }
          return row;
        });
      }
      //add new url and to url and objectVals  
      else {
        urls.push(baseURL);
        let obj1 = {
          URL: baseURL,
         
        };
        if(dataInd+ 2<urlElements.length)
        {
          obj1[urlElements[dataInd+2]]=description.trim();
        }
        else{
          obj1[heading[1]]=description.trim();
        }
        // console.log(obj1);
        OutputVal.push(obj1);
      }
    }
  });
  // console.log(heading);
  // console.log(OutputVal);
  const csvData = objectToCSV(OutputVal, heading);
  downloadCSV(csvData, 'output.csv');
}
//Generate String from the Object
function objectToCSV(OutputVals,heading)
{
  let str="";
  const title=heading.join(",");
  str=title+"\n";
  console.log(title);
  OutputVals.forEach(obj=>{
    let row=[];
    heading.forEach(key=>{
      if(obj.hasOwnProperty(key))
      {
        let value=obj[key].trim();
      row.push(value);  
      }
      else{
        row.push('');
      }
    });
    str+=row.join(",")+"\n";
  })
  return str;
}
// download the csv file
function downloadCSV(csvData, filename) {
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) { 
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

