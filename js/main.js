let XAXIS_LABEL = "Year";
let YAXIS_LABEL = "?";
let GRAPH_TITLE = "Compustat";
let CSV_URL = "./cdc.csv";

var displayedTraces = [];

var sampleSectors = [
  { 
    sector: "Consumer Discretionary",
    average: 0,
    industries: [
      {
        industry: "Automobiles",
        average: 0,
        companies: [
          {
            company: "Zap",
            data: {
              x: ['2000-01-01',    '2001-01-01',   '2002-01-01',  '2003-01-01',  '2004-01-01',   '2005-01-01', '2006-01-01'],
              y: [0.359, -2.701,- 0.492, 0.201, 4.803, -3.807, 0.613]
            }
          }
        ]
      },
      {
        industry: "Retailing",
        average: 0,
        companies: [
          {
            company: "A.C. Moore Arts & Crafts Inc",
            data: {
              x: ['2000-01-01',    '2001-01-01',   '2002-01-01',  '2003-01-01',  '2004-01-01',   '2005-01-01', '2006-01-01'],
              y: [-4.243, 0.508, 50.766, -17.884, 4.728, 9.32, 18.372]
            }
          }
        ]
      }
    ]
  }
]

var sectors = {
  data: sampleSectors,
  getSectors: function(){
    return this.data.map(function(datum) {
      return datum.sector;
    });
  },
  getIndustries: function(sector) {
    return flatten(this.data.map(function(datum) {
      if (sector == null || datum.sector == sector){
        return datum.industries.map(function(indust){
          return indust.industry
        });
      }
    }));
  },
  getCompanies: function(industry) {
    return flatten(this.data.map(function(sectors) {
      return flatten (sectors.industries.map(function(indust) {
        if (industry == null || industry == indust.industry) {
          return indust.companies.map(function(company) {
            return company.company
          });
        };
      }));
    }));
  }
}

// Returns array of industries in sector. Null for all sectors

function traceForCompany(company) {
  var trace = {};

  trace.x = company.data.x;
  trace.y = company.data.y;
  trace.type = 'scatter';
  trace.name = company.company;
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
      type: 'date'
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
  let industry = obj.Industry
  let company = obj.Company
  let cpny = {
      name: obj.Company,
      data: {
        x: ['1998-01-01' , '1999-01-01', '2000-01-01', '2001-01-01', '2002-01-01','2003-01-01', '2004-01-01', '2005-01-01', '2006-01-01','2007-01-01','2008-01-01','2009-01-01','2010-01-01','2011-01-01','2012-01-01','2013-01-01'],
        y: [obj["1998"], obj["1999"], obj["2000"], obj["2001"], obj["2002"], obj["2003"], obj["2004"], obj["2005"], obj["2006"], obj["2007"], obj["2008"], obj["2009"], obj["2010"], obj["2011"], obj["2012"], obj["2013"]]
      },
  }
  companies.push(cpny);
}


function flatten(ary) {
      var ret = [];
      for(var i = 0; i < ary.length; i++) {
                if(Array.isArray(ary[i])) {
                              ret = ret.concat(flatten(ary[i]));
                          } else if (ary[i] != undefined) {
                                        ret.push(ary[i]);
                                    }
            }
      return ret;
}

function didSelectSector(select) {
  var industrySel = document.getElementById("industrySelector")
  for (i = 0; i < industrySel.options.length; i++)
    industrySel.options[i] = null;
  var industries = sectors.getIndustries(select.value);
  for (industry in industries) {
    var opt = document.createElement("option")
    opt.value= industries[industry];
    opt.innerHTML = industries[industry];
    industrySel.appendChild(opt);
  }
}

function didSelectIndustry(select) {
  var companySel = document.getElementById("companySelector")
  for (i = 0; i < companySel.options.length; i++)
    companySel.options[i] = null;
  var companies = sectors.getCompanies(select.value)
  for (company in companies) {
    var opt = document.createElement("option");
    opt.value = companies[company];
    opt.innerHTML = companies[company];
    companySel.appendChild(opt);
  } 
}

function addLine() {
  var sectorName = document.getElementById("sectorSelector").value
  var industryName = document.getElementById("industrySelector").value
  var companyName = document.getElementById("companySelector").value
  for (sector in sectors.data) {
    if (sectors.data[sector].sector == sectorName) {
      for (industry in sectors.data[sector].industries) {
        if (sectors.data[sector].industries[industry].industry == industryName) {
          for (company in sectors.data[sector].industries[industry].companies) {
            if (sectors.data[sector].industries[industry].companies[company].company == companyName) {
              console.log("Found company");
              displayedTraces.push(traceForCompany(sectors.data[sector].industries[industry].companies[company]))
              plotTracesInDiv("myDiv", displayedTraces);
            }
          }
        }
      }
    }
  }
}
