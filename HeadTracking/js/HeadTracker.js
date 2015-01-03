var RW;
(function (RW) {
    (function (BabylonHeadTracker) {
        var HeadTracker = (function () {
            function HeadTracker(_canvas, _videoInput, altVideos, debugOverlay) {
                var _this = this;
                this._canvas = _canvas;
                this._videoInput = _videoInput;
                this._headTrackerEventCallback = function (event) {
                    //var global = this._camera.viewport.toGlobal(this._camera.getEngine());
                    //var wh = this._screenSizeInCM * this._scale;
                    //var ww = wh * global.height / global.width;
                    //var xOffset = event.x > 0 ? 0 : -event.x * 2 * this._scale;
                    //var yOffset = event.y < 0 ? 0 : event.y * 2 * this._scale;
                    //this._camera.viewport = new BABYLON.Viewport(xOffset, yOffset, ww, wh);
                    //this._camera.fov = Math.atan((wh / 2 + Math.abs(event.y * this._scale * this._damping)) / (Math.abs(event.z * this._scale))) * 360 / Math.PI;
                    var fixPos = _this._currentPosition;
                    var newPos = new BABYLON.Vector3(fixPos.x + event.x * _this._scale * _this._damping, fixPos.y + event.y * _this._scale * _this._damping, fixPos.z + event.z * _this._scale);

                    if (_this._camera instanceof BABYLON.ArcRotateCamera) {
                        var cArc = _this._camera;
                        cArc.setPosition(newPos);
                    } else if (_this._camera instanceof BABYLON.FreeCamera) {
                        var cFree = _this._camera;
                        cFree.position = newPos;
                    }
                };
                var params = {
                    ui: true,
                    calcAngles: false,
                    headPositioning: true
                };
                if (altVideos) {
                    params['altVideo'] = altVideos;
                }
                if (debugOverlay) {
                    debugOverlay.style.position = "absolute";
                    debugOverlay.style.top = '0px';
                    debugOverlay.style.zIndex = '10';
                    debugOverlay.style.display = 'none';
                    params['debug'] = debugOverlay;
                }
                this._headTracker = new headtrackr.Tracker(params);
                this._headTracker.init(_videoInput, _canvas);
                this._headTracker.start();
            }
            HeadTracker.prototype.init = function (camera, scale, damping, screenSizeInCM) {
                if (typeof scale === "undefined") { scale = 0.05; }
                if (typeof damping === "undefined") { damping = 10; }
                if (typeof screenSizeInCM === "undefined") { screenSizeInCM = 20; }
                this._scale = scale;
                this._damping = damping;
                this._camera = camera;
                this._screenSizeInCM = screenSizeInCM;
                this._currentPosition = this._camera.position.clone();
            };

            HeadTracker.prototype.setTrackingState = function (started) {
                if (typeof started === "undefined") { started = true; }
                if (!this._camera) {
                    throw new Error("head tracker not initialized");
                }
                if (started) {
                    document.addEventListener("headtrackingEvent", this._headTrackerEventCallback);
                } else {
                    document.removeEventListener("headtrackingEvent", this._headTrackerEventCallback);
                }
            };
            return HeadTracker;
        })();
        BabylonHeadTracker.HeadTracker = HeadTracker;
    })(RW.BabylonHeadTracker || (RW.BabylonHeadTracker = {}));
    var BabylonHeadTracker = RW.BabylonHeadTracker;
})(RW || (RW = {}));
//# sourceMappingURL=HeadTracker.js.map
