/* TODO
*/

var eventData = document.getElementById('data');
var groupData = document.getElementById('groups');
var ccdaData = document.getElementById('ccda');
var searchText = document.getElementById('search-term');

var btnSave = document.getElementById('save');
var btnCcdaImport = document.getElementById('import-ccda');
var btnSearch = document.getElementById('search');
var searchForm = document.getElementById('search-form');

var items = new vis.DataSet();

var container = document.getElementById('visualization');
var options = {
  // editable: true
};
var eventSet = new EventSet();
var groups = new vis.DataSet();
var timeline = new vis.Timeline(container, items, groups, options);

timeline.on('select', function(properties) {
  var additional_info_text, item;
  item = items.get(properties.items[0]);
  additional_info_text = JSON.stringify(item, null, 2);
  document.querySelector('#additional_info').style.display = "block";
  document.querySelector('#additional_info_text').innerHTML = additional_info_text;
});

timeline.on('click', function(properties) {
  console.log(this.getSelection());
  if (this.getSelection().length < 1) {
   document.querySelector('#additional_info').style.display = "none";
  }
});

function Groups(events) {
  this._events = events;
  this.visArray = this._generateVisArray();
}

/* derive group array for vis js from events */
Groups.prototype._generateVisArray = function () {
  var events = this._events;
  var unique = {};
  var distinct = [];
  for( var i in events ) {
    if( typeof(unique[events[i].group_name]) == "undefined" && typeof events[i].group_name !== "undefined"){
      distinct.push({ id: parseInt(i), content:events[i].group_name });
    }
    unique[events[i].group_name] = 0;
  }

  return distinct;
}

/* return a groupd id from group name */
Groups.prototype.groupId = function (group_name) {
  for (var group of this.visArray) {
    if (group.content == group_name) {
      return group.id;
    }
  }
}

function search(evt) {
  evt.preventDefault();
  items.clear();
  items.add(eventSet.search(searchText.value));
  timeline.fit();
}

function loadData() {
  var rawData = jsyaml.load(eventData.value);

  var GroupSet = new Groups(rawData);

  eventSet.set(rawData, GroupSet);

  items.clear();
  items.add(eventSet.get());

  groups.clear();
  groups.update( GroupSet.visArray );

  // adjust the timeline window so that we see the loaded data
  timeline.fit();
}

function saveData() {
  localStorage.setItem('events', eventData.value);
  loadData();
  vNotify.success({title:'Data saved and loaded into timeline'});
}

function loadSampleCcda() {
  var xhr = new XMLHttpRequest();
  xhr.open('get', './sample-ccda.xml', false);
  xhr.send();
  ccdaData.value = xhr.responseText;
  importCcda();
}

function importCcda() {
  ccdaProcessor = new CcdaProcessor(ccdaData.value);;
  eventData.value = JSON.stringify(ccdaProcessor.events(), null, 2);
  saveData();
  vNotify.success({title:'CCDA imported'});
}

var CcdaProcessor = function(ccdaData) {
  this.ccdaData = ccdaData;
  this.bb = BlueButton(ccdaData);
}

CcdaProcessor.prototype.events = function() {
  var encounterEvents = this.bb.data.encounters.map(function(encounter) {
    encounter.start = encounter.date;
    encounter.group_name = 'Encounters';
    encounter.content = encounter.name;
    return encounter;
  });

  var immunizationEvents = this.bb.data.immunizations.map(function(immunization) {
    immunization.content = immunization.product.name;
    immunization.start = immunization.date;
    immunization.group_name = 'Immunizations';
    return immunization;
  });

  var medicationEvents = this.bb.data.medications.map(function(item) {
    item.content = item.text;
    item.start = item.date_range.start;
    item.end = item.date_range.end;
    item.group_name = 'Medications';
    return item;
  });

  var problemEvents = this.bb.data.problems.map(function(item) {
    item.content = item.name;
    item.start = item.date_range.start;
    item.end = item.date_range.end;
    item.group_name = 'Problems';
    return item;
  });

  var procedureEvents = this.bb.data.procedures.map(function(item) {
    item.content = item.name;
    item.start = item.date;
    item.group_name = 'Procedures';
    return item;
  });

  return encounterEvents.concat(immunizationEvents).concat(medicationEvents).concat(problemEvents).concat(procedureEvents);
}

btnSave.onclick = saveData;
btnCcdaImport.onclick = importCcda;
searchForm.onsubmit = search;

document.querySelector("#load-sample-ccda").addEventListener("click", function(event){
  event.preventDefault();
  loadSampleCcda();
});

document.querySelector('#close-additional-info').addEventListener("click", function(event) {
  event.preventDefault();
  document.querySelector('#additional_info').style.display = "none";
});

// init
events = localStorage.getItem("events");
if (events != null) {
  eventData.value = events;
  loadData();
} else {
  loadSampleCcda();
  document.querySelector('.first-time-notice').style.display = "block";
}
