window.onload = function () {
    var babylonCanvas = document.getElementById("renderCanvas");

    var headtrackrVideo = document.getElementById('inputVideo');
    var headtrackrCanvas = document.getElementById('inputCanvas');
    var canvasOverlay = document.getElementById('overlay');

    //Init babylon
    var babylonInit = new RW.BabylonHeadTracker.BabylonInit(babylonCanvas, 0 /* ARC_ROTATE */);

    //init the headtracker
    var headtracker = new RW.BabylonHeadTracker.HeadTracker(headtrackrCanvas, headtrackrVideo, { ogv: "./media/capture5.ogv", mp4: "./media/capture5.mp4" }, canvasOverlay);
    headtracker.init(babylonInit.getCamera());
    headtracker.setTrackingState(true);
};
//# sourceMappingURL=Main.js.map
