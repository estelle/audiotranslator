var data = {
  'url': 'http://estelle.github.io/audiotranslator/data/rudolph.wav',
  'apikey': '7ed75927-9aa2-4a5f-a578-1c753fdc0b60',
  'request_url' : 'https://api.idolondemand.com/1/api/sync/recognizespeech/v1',
  'button' : $('#doThis').text(),
  'languages' : ['', 'fr', 'de', 'es', 'vi', 'ru', ''],
  'count' : 0
};



  var app = {

      init : function () {
          $('#doThis').on('click', function(){
          app.submitToHP();
          app.changeButton();
        });
      },

      // get the words from the original media file
      submitToHP : function () {
        data.url = $('#url').val() || data.url;
        var query = data.request_url + '?';
            query  += "&url=" + encodeURIComponent(data.url);
            query  += "&apikey=" + data.apikey;
            query += "&language=" + ($('#lang').value || "en-US");

        var request = $.ajax(query, function(e) {
                // successfully sent
              })
            .done(function(e) {
                // response received
                app.acceptResponse(e);
              })
            .fail(function(e) {
                // error
                console.dir(e);
                app.acceptResponse('Oops, something went wrong.')
                // TO: Error Messaging
              })
            .always(function(e) {
                // finished
                app.revertButton();
            });
      },

      acceptResponse : function (data) {
          var response;
          // get response
          response = data.document[0].content;
          // massage data

          // display response
          app.displayResults(response, 'response');
          app.translationsSetUp(response);

      },

      displayResults: function (result, el) {
          var container = document.getElementById(el);
          container.innerHTML = result;
      },

      changeButton: function () {
          var button = document.getElementById('doThis');
          button.innerHTML = '<span>|</span>';
      },

      revertButton: function () {
          var button = document.getElementById('doThis');
          button.innerHTML = data.button;
      },

      translationsSetUp: function (text) {
        data.languages[0] = $('#lang').val().substr(0,2); // assign originating language to array of languages
        data.languages[data.languages.length - 1] = $('#lang').val().substr(0,2);
        app.translateMultipleTimes(text);
        data.count = 0;
      },

      translateMultipleTimes: function (text){
        var googleUrl, to, from; // vars
        from = data.languages[data.count];
        data.count++;
        to = data.languages[data.count];
        googleUrl = app.translateUrl(text, to, from);

        app.handleTranslation(googleUrl);
      },

      translateUrl: function(text, to, from) {

          return "https://www.googleapis.com/language/translate/v2?key=" + "AIzaSyDZ02yQNcoPDtrOqqwBX-8FzOdtWKf6IB0" +
              "&source=" + from +
              "&target=" + to +
              "&q=" + encodeURIComponent(text);
      },

      handleTranslation: function (url) {
            var request = $.ajax(url, function(e) {
                // successfully sent
              })
            .done(function(e) {
                // response received
                global = e;
                if(data.count == (data.languages.length - 1)) { // last translation occurred
                  app.displayResults(e.data.translations[0].translatedText, 'translation');
                } else {
                  app.translateMultipleTimes(e.data.translations[0].translatedText);
                }
              })
            .fail(function(e) {
                // error
                console.log('Error: ');
                console.dir(e.statusText);
              })
            .always(function(e) {
                // finished
            });
      }

  }

  app.init();