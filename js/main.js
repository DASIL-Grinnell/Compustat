let XAXIS_LABEL = "Year";
let YAXIS_LABEL = "Debt Ratio";
let GRAPH_TITLE = "Consumer Discretionary Sector";
let CSV_URL = "./consumer_discretionary_debt_ratio.csv";

var displayedTraces = [];

var sectors = {
  data: {},
  insert: function(sector,industry,company,data) {
    if (!this.data[sector]) {
      this.data[sector] = {}
    }
    if (!this.data[sector][industry]) {
      this.data[sector][industry] = {}
    }
    this.data[sector][industry][company] = data
  },
  listSectors: function() {
    return Object.keys(this.data).filter(function(x){return x != ""})
  },
  listIndustries: function(sector) {
    return Object.keys(this.data[sector]).filter(function(x){return x != ""})
  },
  listCompanies: function(sector, industry) {
    return Object.keys(this.data[sector][industry]).filter(function(x){return x != ""})
  }
}

// Returns array of industries in sector. Null for all sectors

function traceForCompany(name, data) {
  var trace = {};

  trace.x = data.x;
  trace.y = data.y;
  trace.type = 'scatter';
  trace.name = name;
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
  Papa.parse(CSV_URL, {
    download: true,
    header: true,
    // function(row)
    step: companyFromRow,
    // function()
    complete: complete,
  });
}

function companyFromRow(row) {
  let obj = row.data[0];
  let sector = obj["GICS Econ Sect (Descr)"]
  let industry = obj["GICS Industry (Descr)"]
  let company = obj["Company Name"]
  let data = {
        x: ['1998-01-01' , '1999-01-01', '2000-01-01', '2001-01-01', '2002-01-01','2003-01-01', '2004-01-01', '2005-01-01', '2006-01-01','2007-01-01','2008-01-01','2009-01-01','2010-01-01','2011-01-01','2012-01-01','2013-01-01'],
        y: [obj["1998"], obj["1999"], obj["2000"], obj["2001"], obj["2002"], obj["2003"], obj["2004"], obj["2005"], obj["2006"], obj["2007"], obj["2008"], obj["2009"], obj["2010"], obj["2011"], obj["2012"], obj["2013"]]
      }
  sectors.insert(sector, industry,company,data)
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
  var industries = sectors.listIndustries(select.value);
  clearIndustryDropdown();
  for (var industry in industries) {
    var opt = document.createElement("option")
    opt.value= industries[industry];
    opt.innerHTML = industries[industry];
    industrySel.appendChild(opt);
  }
  industrySel.value = industries[0]
  didSelectIndustry(industrySel)
}

function didSelectIndustry(select) {
  var sector = document.getElementById("sectorSelector").value
  var companySel = document.getElementById("companySelector")
  var sectorSel = document.getElementById("sectorSelector")
  clearCompanyDropdown();
  var companies = sectors.listCompanies(sector, select.value)
  for (var company in companies) {
    var opt = document.createElement("option");
    opt.value = companies[company];
    opt.innerHTML = companies[company];
    companySel.appendChild(opt);
  }
}

function clearSectorDropdown(){
  var sectorDropdown = document.getElementById("sectorSelector")
  sectorDropdown.options.length = 0;
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
  let trace = traceForCompany(companyName, sectors.data[sectorName][industryName][companyName])
  displayedTraces.push(trace)
  plotTracesInDiv("myDiv", displayedTraces);
}

fetchCompanies();
plotTracesInDiv("myDiv",displayedTraces);

fetchCompanies(function() {
  var sectorSel = document.getElementById("sectorSelector")
  clearSectorDropdown()
  var list = sectors.listSectors()
  for (var sector in list) {
    var opt = document.createElement("option")
    opt.value = list[sector]
    opt.innerHTML = list[sector]
    sectorSel.appendChild(opt)
  }
  didSelectSector(sectorSel)
});
