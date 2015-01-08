module RW.Babylon {

    export enum CameraType {
        ARC_ROTATE,
        FREE
    }

    export class BabylonInit {
        private _scene: BABYLON.Scene;
        private _camera: BABYLON.Camera;

        constructor(private _canvas: HTMLCanvasElement, private _cameraType:CameraType) {
            var engine = new BABYLON.Engine(this._canvas);
            this._scene = this._createScene(engine);
            engine.runRenderLoop(() => {
                this._scene.render();
            });

            window.addEventListener("resize", function () {
                engine.resize();
            });
        }

        public attachCameraControl() {
            if (this._camera['attachControl']) {
                this._camera.attachControl(this._canvas);
            }
        }

        public getCamera() {
            return this._camera;
        }

        public getMeshes() {
            return this._scene.meshes;
        }

        public getScene() {
            return this._scene;
        }

        private _createScene(engine: BABYLON.Engine) {

            var scene = new BABYLON.Scene(engine);

            switch (this._cameraType) {
                case CameraType.ARC_ROTATE:
                    this._camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 10, BABYLON.Vector3.Zero(), scene);
                    break;
                case CameraType.FREE:
                    this._camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(30, 0, 10), scene);
                    (<BABYLON.FreeCamera> this._camera).setTarget(BABYLON.Vector3.Zero());
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
        }
    }
} 