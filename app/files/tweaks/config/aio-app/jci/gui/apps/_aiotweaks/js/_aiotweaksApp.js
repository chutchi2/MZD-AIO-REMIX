/*
Copyright 2017 Trez
 __________________________________________________________________________

 Filename: _aiotweaksApp.js
 __________________________________________________________________________
 */
/* jshint -W117 */
log.addSrcFile("_aiotweaksApp.js", "_aiotweaks");

function _aiotweaksApp(uiaId)
{
    log.debug("Constructor called.");

    // Base application functionality is provided in a common location via this call to baseApp.init().
    // See framework/js/BaseApp.js for details.
    baseApp.init(this, uiaId);
}


/*********************************
 * App Init is standard function *
 * called by framework           *
 *********************************/

/*
 * Called just after the app is instantiated by framework.
 * All variables local to this app should be declared in this function
 */
_aiotweaksApp.prototype.appInit = function()
{
    log.debug("_aiotweaksApp appInit  called...");

    //Context table
    //@formatter:off
    this._contextTable = {
        "Start": { // initial context must be called "Start"
            "sbName": "AIO Tweaks",
            "template": "AIOTweaksTmplt",
            "templatePath": "apps/_aiotweaks/templates/AIOTweaks", //only needed for app-specific templates
            "readyFunction": this._StartContextReady.bind(this),
            "contextOutFunction" : this._StartContextOut.bind(this)
        } // end of "AIOTweaks"
    }; // end of this.contextTable object
    //@formatter:on

    //@formatter:off
    this._messageTable =
    {
      //Speed Handlers
      "Global.AtSpeed" : this._AtSpeedMsgHandler.bind(this),
      "Global.NoSpeed" : this._NoSpeedMsgHandler.bind(this),
      "TimedSbn_CurrentSong": this._TimedSbn_CurrentSongMsgHandler.bind(this)
    };
};

/**
 * =========================
 * CONTEXT CALLBACKS
 * =========================
 */
_aiotweaksApp.prototype._AtSpeedMsgHandler = function (msg) {
  log.info("AIO Tweaks App Received AtSpeedMsg" + msg);
}
_aiotweaksApp.prototype._NoSpeedMsgHandler = function (msg) {
  log.info("AIO Tweaks App Received NoSpeedMsg" + msg);
}
// from usbaudioApp - test to see if this works
_aiotweaksApp.prototype._TimedSbn_CurrentSongMsgHandler = function (msg) {
    framework.common.startTimedSbn(this.uiaId, 'TimedSbn_UsbAudio_CurrentSong', 'typeE', {
        sbnStyle : 'Style02',
        imagePath1 : 'IcnSbnEnt.png',
        text1 : "USB",
        text2 : msg.params.payload.title,
    });
};
_aiotweaksApp.prototype._StartContextReady = function ()
{
  framework.common.setSbDomainIcon("apps/_aiotweaks/app.png");
};

_aiotweaksApp.prototype._StartContextOut = function ()
{
  var currTwks = document.getElementsByTagName("body")[0].className;
  if(currTwks.length > 0) {
    localStorage.setItem("aio.tweaks",currTwks);
  }
};
/**
 * =========================
 * Framework register
 * Tell framework this .js file has finished loading
 * =========================
 */
framework.registerAppLoaded("_aiotweaks", null, false);
