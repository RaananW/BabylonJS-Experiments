
window.onload = () => {
    var babylonCanvas = <HTMLCanvasElement> document.getElementById("renderCanvas");

    var headtrackrVideo = <HTMLVideoElement> document.getElementById('inputVideo');
    var headtrackrCanvas = <HTMLCanvasElement> document.getElementById('inputCanvas');
    var canvasOverlay = <HTMLCanvasElement> document.getElementById('overlay');

    //Init babylon
    var babylonInit = new RW.BabylonHeadTracker.BabylonInit(babylonCanvas, RW.BabylonHeadTracker.CameraType.ARC_ROTATE);

    //init the headtracker
    var headtracker = new RW.BabylonHeadTracker.HeadTracker(headtrackrCanvas, headtrackrVideo, { ogv: "./media/capture5.ogv", mp4: "./media/capture5.mp4" }, canvasOverlay);
    headtracker.init(babylonInit.getCamera());
    headtracker.setTrackingState(true);

}