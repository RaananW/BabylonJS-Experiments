module RW.BabylonHeadTracker {
    export class HeadTracker {

        private _headTracker;
        private _scale: number;
        private _damping: number;
        private _screenSizeInCM: number;
        private _camera: BABYLON.Camera;
        private _currentPosition: BABYLON.Vector3;

        constructor(private _canvas: HTMLCanvasElement, private _videoInput: HTMLVideoElement, altVideos?, debugOverlay?: HTMLCanvasElement) {
            var params = {
                ui: true,
                calcAngles: false,
                headPositioning:true
            }
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

        public init(camera: BABYLON.Camera, scale: number = 0.05, damping: number = 10, screenSizeInCM:number = 20) {
            this._scale = scale;
            this._damping = damping;
            this._camera = camera;
            this._screenSizeInCM = screenSizeInCM;
            this._currentPosition = this._camera.position.clone();
            
        }

        public setTrackingState(started:boolean = true) {
            if (!this._camera) {
                throw new Error("head tracker not initialized");
            }
            if (started) {
                document.addEventListener("headtrackingEvent", this._headTrackerEventCallback);
            } else {
                document.removeEventListener("headtrackingEvent", this._headTrackerEventCallback);
            }
        }

        private _headTrackerEventCallback = (event) => {
            //var global = this._camera.viewport.toGlobal(this._camera.getEngine());
            //var wh = this._screenSizeInCM * this._scale;
            //var ww = wh * global.height / global.width;

            //var xOffset = event.x > 0 ? 0 : -event.x * 2 * this._scale;
            //var yOffset = event.y < 0 ? 0 : event.y * 2 * this._scale;
            //this._camera.viewport = new BABYLON.Viewport(xOffset, yOffset, ww, wh);
            //this._camera.fov = Math.atan((wh / 2 + Math.abs(event.y * this._scale * this._damping)) / (Math.abs(event.z * this._scale))) * 360 / Math.PI;

            var fixPos = this._currentPosition;
            var newPos = new BABYLON.Vector3(
                fixPos.x + event.x * this._scale * this._damping,
                fixPos.y + event.y * this._scale * this._damping,
                fixPos.z + event.z * this._scale
                );

            if (this._camera instanceof BABYLON.ArcRotateCamera) {
                var cArc: BABYLON.ArcRotateCamera = <BABYLON.ArcRotateCamera> this._camera;
                cArc.setPosition(newPos);
            } else if (this._camera instanceof BABYLON.FreeCamera) { 
                var cFree: BABYLON.FreeCamera = <BABYLON.FreeCamera> this._camera;
                cFree.position = newPos;
            }
        }
    }
} 