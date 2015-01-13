
function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
    return null;
}


window.onload = () => {
    var babylonCanvas = <HTMLCanvasElement> document.getElementById("renderCanvas");
    //Init babylon
    var babylonInit = new RW.Babylon.BabylonInit(babylonCanvas, RW.Babylon.CameraType.ARC_ROTATE);
    babylonInit.attachCameraControl();
    babylonInit.getCamera()['setPosition'](new BABYLON.Vector3(-12, 30, 350));
    
    BABYLON.SceneLoader.ImportMesh("", "./", "test_out.babylon", babylonInit.getScene(), () => {
        var originalMesh = <BABYLON.Mesh> babylonInit.getScene().getMeshByID("52809131-6db1-4985-928f-27733e9ce896");
        var material = new BABYLON.StandardMaterial("mat", babylonInit.getScene());
        originalMesh.material = material;
        originalMesh.material.backFaceCulling = false;
        var parallel = getUrlParameter("parallel") == "true" ? true : false; 
        var levels = getUrlParameter("levels") ? parseInt(getUrlParameter("levels")) : 4;
        var distanceOffset = getUrlParameter("offset") ? parseInt(getUrlParameter("offset")) : 100;
        var offset = 1 / levels;
        babylonInit.getScene().debugLayer.show();
        if (parallel) {
            var levelsArray = [];
            for (var i = 1; i < levels; ++i) {
                levelsArray.push(1 - (i *offset));
            }
            levelsArray.forEach((rate) => {
                var decimation = new RaananW.Decimation.Decimator(originalMesh);
                decimation.reInit(() => {
                    decimation.runDecimation(rate, (mesh) => {
                        originalMesh.addLODLevel(distanceOffset / rate, mesh);
                        if (rate == levelsArray[levelsArray.length-1]) {
                            (<BABYLON.StandardMaterial>  originalMesh.material).diffuseColor = BABYLON.Color3.Green();
                        }
                    });
                });
            });
        } else {
            var decimation = new RaananW.Decimation.Decimator();

            var runDecimation = (rate, callback) => {
                decimation.initWithMesh(originalMesh, () => {
                    decimation.runDecimation(rate, (mesh) => {
                        originalMesh.addLODLevel(distanceOffset / rate, mesh);
                        callback();
                    });
                });
            }

            RaananW.Tools.AsyncLoop(levels, (loop) => {
                runDecimation(1 - (loop.currentIndex() * offset), () => {
                    loop.executeNext();
                });
            }, () => {
                (<BABYLON.StandardMaterial>  originalMesh.material).diffuseColor = BABYLON.Color3.Green();
            });
        }
    });
}