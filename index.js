/**

 SpookyJS Runner.
 Looks for all .js files in root, and executes them, collecting stats on each website and reporting them via a simple UI

**/

var path = require("path"),
    flow = require("flow");


    var files = require("fs").readdirSync(__dirname);

    flow.serialForEach(files, function(file){
        //Each value in the array is passed here.
        //Call 'this' as cb

        if (path.extname(file) === ".js" && file != "index.js") {
          try {
            var operation = require(__dirname + "/" + file);
            var page = new operation();
            if (page && page.run) page.run(this);
          }
          catch (e) {
            console.log("Error loading page " + e)
          }
        }else{
          this();
        }

    },
    function(err, newVal){
        //cb results come here
        //var stats =
    },
    function(){
      //This is the end
      console.log("Finished them all.");
    })

    //var self = this;
    //
    ////Dynamically load .js files from the root folder.
    //require("fs").readdirSync(__dirname).forEach(function (file) {
    //
    //  if (path.extname(file) === ".js" && file != "index.js") {
    //    try {
    //      var operation = require(__dirname + "/" + file);
    //      var page = new operation();
    //      if (page && page.run) page.run(self.MULTI());
    //    }
    //    catch (e) {
    //      console.log("Error loading page " + e)
    //    }
    //  }
    //})
