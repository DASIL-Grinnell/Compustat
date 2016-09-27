let XAXIS_LABEL = "Year";
let YAXIS_LABEL = "?";
let GRAPH_TITLE = "Compustat";
let CSV_URL = "cds.csv";

var displayedTraces = [];
var companies = []
function traceForCompany(company) {
  var trace = {};

  trace.x = company.data.x;
  trace.y = company.data.y;
  trace.type = 'scatter';
  trace.name = company.name;
  console.log(trace)
  return trace;
}

function plotCompaniesInDiv(divID, companies) {
  let traces = companies.map(traceForCompany);
  plotTracesInDiv(divID, traces);
}

function plotTracesInDiv(divID, traces) {
  let layout = {
    title: GRAPH_TITLE,
    xaxis: {
      title: XAXIS_LABEL,
    },
    yaxis: {
      title: YAXIS_LABEL,
    },
  };

  Plotly.newPlot(divID, traces, layout);
}

function fetchCompanies(row,complete) {
  Papa.parse(CSV_URL, {
    download: true,
    header: true,
    // function(row)
    step: row,
    // function()
    complete: complete,
  });
}

function companyFromRow(row) {
  let obj = row.data[0];
  let company = {
      name: obj.Company,
      data: {
        x: [1998 , 1999, 2000, 2001, 2002,2003, 2004, 2005, 2006,2007,2008,2009,2009,2011,2012,2013],
        y: [obj["1998"], obj["1999"], obj["2000"], obj["2001"], obj["2002"], obj["2003"], obj["2004"], obj["2005"], obj["2006"], obj["2007"], obj["2008"], obj["2009"], obj["2010"], obj["2011"], obj["2012"], obj["2013"]]
      },
  }
  companies.push(company);
}


function main() {
  var complete = function() {console.log("done");};
  fetchCompanies(companyFromRow, function() {
  plotCompaniesInDiv("myDiv" , companies);
  });
}

main();
