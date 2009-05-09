(function($) {
  $.fn.scroller = function () {
    var list = this;
    list.items = [];
    
    list.push = function(items) {
      items.css('display', 'none').highlight('tulip time').highlight('tuliptime').highlight('tulip_time').highlight('tech embassy').highlight('techembassy');
      items.each(function() {
        list.items.push(this);
      })
    }
    
    list.cleanup = function() {
      if(list.children().length > 30) {
        list.children().slice(0, 15).remove()
      }
    }
    
    var process = function() {
      $(list.items.shift()).appendTo(list).slideDown(5000);
      list.cleanup();
    }
    
    setInterval(process, 5000);
    return list;
  }
  
  var query = encodeURIComponent('techembassy OR "tech embassy" OR ideafoundry OR Tulip_time OR "Tulip Time" -pella -iowa');
  
  $(function() {
    tweets = $('#tweets').scroller();
    flicks = $('#flickr').scroller();
    
    function fetchTweets() {
      if(tweets.items.length < 15) {
        // since_id
        var url = 'http://search.twitter.com/search.json?q=' + query + '&rpp=30&callback=?'; 
        $.getJSON(url, function(data) {
          $.each(data.results, function() {  
            tweets.push($('<li><img class="profile" src="' + this.profile_image_url + '"/><span class="from">' + this.from_user + ':</span> ' + inlinePics(this.text) + '</li>'))
           }); 
         });
      }
      setTimeout(fetchTweets, 5000);
    }
    
    jsonFlickrApi = function(data) {
      $.each(data.photos.photo, function(i,photo){
        //notice that "t.jpg" is where you change the
        //size of the image
        var t_url = "http://farm" + photo.farm + 
        ".static.flickr.com/" + photo.server + "/" + 
        photo.id + "_" + photo.secret + "_" + "m.jpg";

        var p_url = "http://www.flickr.com/photos/" + 
        photo.owner + "/" + photo.id;

        flicks.push($('<li><a href="' + p_url + '"><img src="' + t_url + '"/></a></li>'));
      });
    }
    function fetchFlicks() {
      if (flicks.items.length < 15) {
          $.getJSON("http://api.flickr.com/services/rest/?callback=?&format=json&method=flickr.photos.search&text=%22tulip%20time%22%20OR%20%22tech%20embassy%22&tag_mode=all&api_key=f9eed8709bd8c9663f988960cbdad53f&jsoncallback=jsonFlickrApi")
      }
      window.setTimeout(fetchFlicks, 120000);        
    }
         
    
    function inlinePics(text) {
      return text
        .replace(/http:\/\/twitpic\.com\/([\w\d]+)/, '<img src="http://twitpic.com/show/thumb/$1" class="twitpic">')
        .replace(/http:\/\/yfrog\.com\/([\w\d]+)/, '<img src="http://yfrog.com/$1.th.jpg" class="twitpic">')
        .replace(/http:\/\/pic\.im\/([\w\d]+)/, '<img src="http://pic.im/website/thumbnail/$1" class="twitpic">')
    }
            
    fetchTweets();
    fetchFlicks();
  });
  
})(jQuery)

    
    // window.setInterval(showNext, 7000, '#tweets')
    // window.setInterval(showNext, 4000, '#flickr')
    // function moveit(element) {
    //   var top = $(element).position().top - 100;
    //   $(element).animate({top: top + 'px'}, {duration:5000, easing:'linear',
    //     complete: function() { moveit(element) }});
    // }
    // moveit('#tweets');
