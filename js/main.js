let XAXIS_LABEL = "Year";
let YAXIS_LABEL = "Datapoints";
let GRAPH_TITLE = "Consumer Discretionary Sector";
let CSV_URL = "./cdc.csv";

var displayedTraces = [];

var sectors = {
  data: {},
  insertCompany: function(company) {
    if (this.data[company.sector] == undefined) {
      this.data[company.sector] = {}
    }
    if (this.data[company.sector][company.industry] == undefined) {
      this.data[company.sector][company.industry] = {}
    }
    this.data[company.sector][company.industry][company.name] = {
      name: company.name,
      x: ['2000-01-01',    '2001-01-01',   '2002-01-01',  '2003-01-01',  '2004-01-01',   '2005-01-01', '2006-01-01', '2007-01-01', '2008-01-01','2009-01-01','2010-01-01','2011-01-01','2012-01-01','2013-01-01','2014-01-01'],
      y: company.datapoints
    }
  },
  getSectors: function(){
     return Object.keys(this.data).filter(function(x){
       return sectors.data.hasOwnProperty(x)
     })
  },
  getIndustries: function(sector) {
    return Object.keys(this.data[sector]).filter(function(x) {
      return sectors.data[sector].hasOwnProperty(x)
    })
  },
  getCompanies: function(sector, industry) {
    return Object.keys(this.data[sector][industry]).filter(function (x) {
      return sectors.data[sector][industry].hasOwnProperty(x)
    })
  }
}

// Returns array of industries in sector. Null for all sectors

function traceForCompany(company) {
  var trace = {};

  trace.x = company.x;
  trace.y = company.y;
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
      type: 'date'
    },
    yaxis: {
      title: YAXIS_LABEL,
    },
  };

  Plotly.newPlot(divID, traces, layout);
}

function fetchCompanies(complete) {
  d3.csv("cdc.csv", function(error, data) {
    let companies = data.map(function(d) {
      var company = {}
      company.name = d['Company Name']
      company.industry = d['GICS Industry (Descr)']
      company.sector =  d['GICS Econ Sect (Descr)']
      company.datapoints = [d['2000'],d['2001'],d['2002'],d['2003'],d['2004'],d['2005'],d['2006'],d['2007'],d['2008'],d['2009'],d['2010'],d['2011'],d['2012'],d['2013'],d['2014']]
      return company
    });
    for (var i = 0; i < companies.length; i++) {
      sectors.insertCompany(companies[i]) 
    }
    if (complete) { complete() }
  });
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
  var industries = sectors.getIndustries(select.value);
  clearIndustryDropdown();
  for (industry in industries) {
    var opt = document.createElement("option")
    opt.value= industries[industry];
    opt.innerHTML = industries[industry];
    industrySel.appendChild(opt);
  }
  industrySel.value = industries[0]
  didSelectIndustry(industrySel)
}

function didSelectIndustry(select) {
  var companySel = document.getElementById("companySelector")
  var sectorSel = document.getElementById("sectorSelector")
  clearCompanyDropdown();
  var companies = sectors.getCompanies(sectorSel.value, select.value)
  for (company in companies) {
    var opt = document.createElement("option");
    opt.value = companies[company];
    opt.innerHTML = companies[company];
    companySel.appendChild(opt);
  }
}

function clearSectorDropdown(){
  var sectorDropdown = document.getELementById("sectorSelector")
  selectorDropdown.options.length = 0;
}

function clearIndustryDropdown() {
  var industrySel = document.getElementById("industrySelector")
  industrySel.options.length = 0;
}

function clearCompanyDropdown() {
  var companySel = document.getElementById("companySelector")
  companySel.options.length = 0;
}

function clearDropdowns() {
  //clearSectorDropdown();
  clearIndustryDropdown();
  clearCompanyDropdown();
}

function addLine() {
  var sectorName = document.getElementById("sectorSelector").value
  var industryName = document.getElementById("industrySelector").value
  var companyName = document.getElementById("companySelector").value
  let company = sectors.data[sectorName][industryName][companyName]
  displayedTraces.push(traceForCompany(company))
  plotTracesInDiv("myDiv", displayedTraces);
}

fetchCompanies();
plotTracesInDiv("myDiv",displayedTraces);
