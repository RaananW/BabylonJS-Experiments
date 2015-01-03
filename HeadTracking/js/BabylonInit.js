var RW;
(function (RW) {
    (function (BabylonHeadTracker) {
        (function (CameraType) {
            CameraType[CameraType["ARC_ROTATE"] = 0] = "ARC_ROTATE";
            CameraType[CameraType["FREE"] = 1] = "FREE";
        })(BabylonHeadTracker.CameraType || (BabylonHeadTracker.CameraType = {}));
        var CameraType = BabylonHeadTracker.CameraType;

        var BabylonInit = (function () {
            function BabylonInit(_canvas, _cameraType) {
                var _this = this;
                this._canvas = _canvas;
                this._cameraType = _cameraType;
                var engine = new BABYLON.Engine(this._canvas);
                this._scene = this._createScene(engine);
                engine.runRenderLoop(function () {
                    _this._scene.render();
                });

                window.addEventListener("resize", function () {
                    engine.resize();
                });
            }
            BabylonInit.prototype.attachCameraControl = function () {
                if (this._camera['attachControl']) {
                    this._camera.attachControl(this._canvas);
                }
            };

            BabylonInit.prototype.getCamera = function () {
                console.log(this._camera.viewport.toGlobal(this._scene.getEngine()));
                return this._camera;
            };

            BabylonInit.prototype._createScene = function (engine) {
                var scene = new BABYLON.Scene(engine);

                switch (this._cameraType) {
                    case 0 /* ARC_ROTATE */:
                        this._camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 10, BABYLON.Vector3.Zero(), scene);
                        break;
                    case 1 /* FREE */:
                        this._camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(30, 0, 10), scene);
                        this._camera.setTarget(BABYLON.Vector3.Zero());
                        break;
                }

                var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
                light.intensity = .5;

                var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
                sphere.position.y = 1;
                var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
                return scene;
            };
            return BabylonInit;
        })();
        BabylonHeadTracker.BabylonInit = BabylonInit;
    })(RW.BabylonHeadTracker || (RW.BabylonHeadTracker = {}));
    var BabylonHeadTracker = RW.BabylonHeadTracker;
})(RW || (RW = {}));
//# sourceMappingURL=BabylonInit.js.map
