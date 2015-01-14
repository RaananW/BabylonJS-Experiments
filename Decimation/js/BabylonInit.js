/* MIT License
Copyright (c) 2014-2015 Raanan Weber (raananw@gmail.com)
Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in the
Software without restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
and to permit persons to whom the Software is furnished to do so, subject to the
following conditions:
The above copyright notice and this permission notice shall be included in all copies
or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var RW;
(function (RW) {
    (function (Babylon) {
        (function (CameraType) {
            CameraType[CameraType["ARC_ROTATE"] = 0] = "ARC_ROTATE";
            CameraType[CameraType["FREE"] = 1] = "FREE";
        })(Babylon.CameraType || (Babylon.CameraType = {}));
        var CameraType = Babylon.CameraType;

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
                return this._camera;
            };

            BabylonInit.prototype.getMeshes = function () {
                return this._scene.meshes;
            };

            BabylonInit.prototype.getScene = function () {
                return this._scene;
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

                /*var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
                sphere.position.y = 1;
                var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
                
                var knot = BABYLON.Mesh.CreateTorusKnot("knot", 2, 0.5, 128, 64, 2, 3, scene);
                knot.position.x = 5;
                
                var box = BABYLON.Mesh.CreateBox("box", 2, scene);
                box.position.x = -5;
                */
                return scene;
            };
            return BabylonInit;
        })();
        Babylon.BabylonInit = BabylonInit;
    })(RW.Babylon || (RW.Babylon = {}));
    var Babylon = RW.Babylon;
})(RW || (RW = {}));
//# sourceMappingURL=BabylonInit.js.map
