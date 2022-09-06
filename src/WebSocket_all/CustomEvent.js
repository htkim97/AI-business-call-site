



function Event () {
}

Event.listen = function (eventName, callback) {
    if(document.addEventListener) {
        document.addEventListener(eventName, callback, false);
    } else {    
        document.documentElement.attachEvent('onpropertychange', function (e) {
            if(e.propertyName  == eventName) {
                callback();
            }            
        });
    }
};

Event.trigger = function (eventName) {
    if(document.createEvent) {
        var event = document.createEvent('Event');
        event.initEvent(eventName, true, true);
        document.dispatchEvent(event);
    } else {
        document.documentElement[eventName]++;
    }
};

Event.once = function(eventName, callback) { 
    if(document.addEventListener ) {
      var cbak = function (e) {   
        document.removeEventListener (eventName, cbak, false);
        callback();   
      };
      document.addEventListener(eventName, cbak, false);
    } else {    
      var cbak = function (e) { 
        if(e.propertyName  == eventName) { 
          document.documentElement.detachEvent('onpropertychange', cbak);
          callback();
        }            
      };
      document.documentElement.attachEvent('onpropertychange', cbak);
    }
};

