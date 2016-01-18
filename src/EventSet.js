function EventSet() {
  this.events = {};
}

EventSet.prototype.get = function() {
  return this.events;
}

/**
 * @param {string} can be raw yaml or json
 * @param {string} an instance of the groups class
 */
EventSet.prototype.set = function(rawEventData, GroupSet) {
  // map data items and convert any ongoing event to proper end date
  var events = rawEventData.map(function(item) {
    if(typeof item.end !== 'undefined' && item.end == 'ongoing') {
      item.end = vis.moment();
    }

    item.group = GroupSet.groupId(item.group_name);

    if(typeof item.end !== 'undefined' && item.start == item.end) {
      delete item.end;
    }

    if(item.end == null) {
      delete item.end;
    }

    if(typeof item.end == 'undefined') {
      item.type = 'point';
    }

    return item;
  }).filter(function(item){
    if(item.start == null) {
      return false;
    }

    if(item.content == null) {
      return false;
    }

    return true;
  });

  this.events = events;
}

/**
 * @param {string} search term
 */
EventSet.prototype.search = function(searchTerm) {
  return this.events.filter(function (item){
    console.log(searchTerm);
    var re = new RegExp(searchTerm,"i");
    if (item.content.search(re) > -1) {
      return true;
    }
    return false;
  });
}
