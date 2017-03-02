var UserAgentParser = require('ua-parser-js');
var Messages = require('./languages.json');

module.exports = function () {
    
    // Despite the docs, UA needs to be provided to constructor explicitly:
    // https://github.com/faisalman/ua-parser-js/issues/90
    var parsedUserAgent = new UserAgentParser(window.navigator.userAgent).getResult();

    var language = window.navigator.language || window.navigator.userLanguage; // Everyone else, IE

    var currentBrowser = parsedUserAgent.browser.name;

    var options = {
      containerId : 'outdated',
      supportedBrowsers: {
        'Chrome': 37,
        'IE': 10,
        'Safari': 7,
        'Firefox': 32
      },
      customClass: {
        button: 'btn ',
        closeButton: '',
        content: '',
      },
      browserLinks: {
        Opera: 'http://www.opera.com/',
        Chrome: 'https://www.google.com/chrome/',
        IE: 'https://www.microsoft.com/en-us/download/internet-explorer.aspx',
        Safari: 'https://support.apple.com/downloads/safari',
        Firefox: 'https://www.mozilla.org/en-US/firefox/new/',
      }
    };

    var checkBrowser = function () {
      
      var browserMajorVersion = parsedUserAgent.browser.major;
      if (options.supportedBrowsers[currentBrowser] && browserMajorVersion < options.supportedBrowsers[currentBrowser]) {
       return true;
      }
      return false;
    };

    var getTemplate = function() {
      
      var message = Messages[language] || Messages.en;

      var button = '<a href="'+ options.browserLinks[currentBrowser] +'" target="_blank" class="outdated-browser_button btn '+ options.customClass.button +'">'+ message.link +'</a>';

      var closeButton = '<a href="#" class="outdated-browser_close '+ options.customClass.closeButton +'" id="closeNotification"></a>';

      return '<div class="outdated-browser"><div class="outdated-browser_text '+ options.customClass.content +'">'+ message.text + '</div>'+ button + closeButton +'</div>'; 
    };

    var init = function() {

      if(checkBrowser()) {
        var container = document.getElementById(options.containerId);

        container.innerHTML = getTemplate(options);

        document.getElementById('closeNotification').addEventListener('click', function(event) {
          event.preventDefault();
          container.innerHTML = "";
        })
      }
    };

	// Load main when DOM ready.
  var oldOnload = window.onload;
  if (typeof window.onload !== 'function') {
    window.onload = init;
    init();
  } else {
    window.onload = function () {
      if (oldOnload) {
        oldOnload();
      }
      init();
    };
  }
};