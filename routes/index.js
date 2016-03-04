
var mongoose = require('mongoose');
var SearchHistory = mongoose.model('SearchHistory');
var Bing = require('node-bing-api')({ accKey: require('../config/config').acckey });
module.exports = function(app) {
  app.get('/:keyword',function (req,res,next) {
      var offset = 0;
      if(req.query!=null){
      var query = req.query;
      for(var i in query){
          if(i=='offset'){
              offset = query[i];
          }
      }
    }
    var keyword = req.keyword;
    Bing.images(keyword, {top: 10,skip: offset}, function(error,response, body){
        var searchResults= [];
        for (var i in body.d.results){
            var result = {
                url:body.d.results[i].MediaUrl,
                snippet:body.d.results[i].Title,
                thumbnail:body.d.results[i].Thumbnail.MediaUrl,
                context:body.d.results[i].SourceUrl
            }
            searchResults.push(result);
        }
        res.send(searchResults);
     });
    var history = new SearchHistory({
        term:req.keyword
    });
    history.save(function(err){
        if(err)
          next(err);
    });
  });
  
  
  app.param('keyword',function (req,res,next,keyword) {
      req.keyword = keyword;
      next();
  });
  
  
  app.get('/',function (req,res,next) {
      res.render('index',{
          title:'Hello'
      })
  });
  
  
  app.get('/latest/searchResult',function (req,res,next) {
      SearchHistory.find({},'-_id when term').sort('-when').limit(10).exec(function(err,histories){
            res.json(histories);
    });
  });
};
