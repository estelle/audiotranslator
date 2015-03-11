var data = {
  'url': 'http://estelle.github.io/audiotranslator/data/rudolph.wav',
  'apikey': '7ed75927-9aa2-4a5f-a578-1c753fdc0b60',
  'request_url' : 'https://api.idolondemand.com/1/api/sync/recognizespeech/v1',
  'button' : $('#doThis').text()
};



  var app = {

      init : function () {
          $('#doThis').on('click', function(){
          app.submitToHP();
          app.changeButton();
        });
      },

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
          app.translate(response);

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

      translate: function(text, reverse) {
          var from = $('#language').val().substr(0,2);
          var to = $('#tolanguage').val().substr(0,2);
          if (from == to) {
            to = "cz";
          }
          if(reverse) {
            var temp = from;
                from = to;
                to = temp;
          }
          var translation = "https://www.googleapis.com/language/translate/v2?key=" + "AIzaSyDZ02yQNcoPDtrOqqwBX-8FzOdtWKf6IB0" +
              "&source=" + from +
              "&target=" + to +
              "&q=" + encodeURIComponent(text);
          app.handleTranslation(translation, reverse);
      },

      handleTranslation: function (url, reverse) {
            var request = $.ajax(url, function(e) {
                // successfully sent
              })
            .done(function(e) {
                // response received
                console.dir(e);
                global = e;
                if(reverse) {
                  app.displayResults(e.data.translations[0].translatedText, 'reversetranslation');
                } else {
                  app.displayResults(e.data.translations[0].translatedText, 'translation');
                }
              })
            .fail(function(e) {
                // error
                console.log('Error: ' + e);
              })
            .always(function(e) {
                if(!reverse) {
                  app.translate(e.data.translations[0].translatedText, true);
                }
                // finished
            });
      }

  }

  app.init();