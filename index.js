const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const xlsx = require('xlsx');

console.log("hello");
const pageUrl = "https://www.sarkariresult.com/latestjob/";

const getData = async () => {
  try {
    const response = await axios.get(pageUrl);
    const pageData = response.data;
    fs.writeFile("file_data.txt", pageData, (err) => {
      if (err) {
        console.log("error in file writing: ", err);
        return;
      }
      console.log("pageData file written successfully");
    });
  } catch (error) {
    console.log("error for data apple : ", error);
  }
};

const data = fs.readFileSync("file_data.txt");

const $ = cheerio.load(data.toString());
const details = $("#post li a");

const dataDetails = [];
details.each((index, element) => {
  const titals = $(element).text();
  //console.log(titals);

  dataDetails.push({
    Job_detail: titals,
  });
});
//console.log(dataDetails);

// fs.writeFile("jobDetails.json",JSON.stringify(dataDetails),(err)=>{
//     if (err) {
//         console.log("error :",err);
//         return;
//     }
//     console.log("file written successfully");
// });

fs.readFile("jobDetails.json",(err,data)=>{
if (err) {
    console.log("Read File error: ",err);
    return;
}
console.log(JSON.parse(data.toString()));
});

//console.log(data.toString());
//getData();

//save in excel
const workbook = xlsx.utils.book_new();
const sheet=xlsx.utils.json_to_sheet(dataDetails);
// Append the sheet to the workbook
xlsx.utils.book_append_sheet(workbook, sheet, 'Sheet1');

xlsx.writeFile(workbook, 'output.xlsx');

console.log('XLSX file created successfully!');

