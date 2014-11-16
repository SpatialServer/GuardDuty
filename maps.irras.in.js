var Spooky;

try {
  Spooky = require('spooky');
} catch (e) {
  Spooky = require('../lib/spooky');
}

var Page = function(){

}


Page.prototype.run = function(cb){

  this.stats = {}; //Public statistics property
  this.cb = cb;
  this.startTime;
  this.loadTime;

  var self = this;

  var spooky = new Spooky({
    child: {
      transport: 'http'
    },
    casper: {
      logLevel: 'debug',
      verbose: true
    }
  }, function (err) {
    if (err) {
      e = new Error('Failed to initialize SpookyJS');
      e.details = err;
      throw e;
    }

    //Which URL to open
    spooky.start('http://maps.irras.in');

    //Load up Casper with instructions once the page loads
    spooky.then(function () {
      this.emit('loaded', 'Hello, from ' + this.evaluate(function () {
        return document.title;
      }));
    });

    //When the first 'then' block is done, this one is next
    spooky.then(function () {
      this.evaluate(function () {
        //Calling function in page context
        slideToContent();
      })
    });

    //When the previous 'then' block is done, this one is next
    spooky.then(function () {
      this.wait(5000, function() {
        this.capture('./outputimages/irrasmaps.png');
      })
    });

    spooky.then(function(){
      this.emit('finished', 'finished'); //let us know we're done.  //This should always be the last spooky.then
    });

    self.startTime = Date.now();
    spooky.run(); //Kick of the loading.
  });

  spooky.on('error', function (e, stack) {
    console.error(e);

    if (stack) {
      console.log(stack);
    }
  });


  // Uncomment this block to see all of the things Casper has to say.
  // There are a lot.
  // He has opinions.
  //spooky.on('console', function (line) {
  //console.log(line);
  //});


  spooky.on('loaded', function (greeting) {
    self.stats.loadTime = (Date.now() - self.startTime) / 1000; //seconds
    self.stats.greeting = greeting;
    console.log(greeting);
    console.log("Loaded in " + self.stats.loadTime + "ms")
  });

  spooky.on('log', function (log) {
    if (log.space === 'remote') {
      console.log(log.message.replace(/ \- .*/, ''));
    }
  });

  spooky.on('finished', function (imgPath) {
    self.cb();
  });

}


Page.prototype.getStats = function(){
  //Return the stats property
  return this.stats;
}

module.exports = Page;