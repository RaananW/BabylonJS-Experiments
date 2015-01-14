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
    var babylonInit = new RW.Babylon.BabylonInit(babylonCanvas, RW.Babylon.CameraType.FREE);
    
    //babylonInit.getCamera()['setPosition'](new BABYLON.Vector3(-12, 30, 350));

    var testData = {
        danceMoves: {
            filename: "DanceMoves.babylon",
            root: "./",
            meshIds: ["9e9bc052-054d-4cba-b5eb-1b14a494f39a"],
            initMaterial: false,
            skeleton: false,
            position: new BABYLON.Vector3(0, -100, 0)
        },
        fractal: {
            filename: "test_out.babylon",
            root: "./",
            meshIds: ["52809131-6db1-4985-928f-27733e9ce896"],
            initMaterial: true,
            skeleton: false,
            position: new BABYLON.Vector3(0, 0, 0)
        },
        dude: {
            filename: "Dude.babylon",
            root: "./",
            meshIds: ["0ef21059-94ce-4e79-ad67-48d8c05607e0", "76931662-ff06-4353-ae35-b62f3c93ed58", "92b91666-bf07-4061-9274-e1a3eb3d2f07", "50d37370-0ef8-445c-9908-bb7641b27d88", "34394963-f5e9-48c7-b8d0-3698f14251ec"],
            initMaterial: false,
            skeleton: true,
            position: new BABYLON.Vector3(0, -50, 0)
        },
        wcafe: {
            filename: "WCafe.babylon",
            root: "./Scenes/WCafe/",
            initMaterial: false,
            skeleton: false,
            fullScene:true
        }
    }


    var parallel = getUrlParameter("parallel") == "true" ? true : false;
    var levels = getUrlParameter("levels") ? parseInt(getUrlParameter("levels")) : 4;
    var distanceOffset = getUrlParameter("offset") ? parseInt(getUrlParameter("offset")) : 100;
    var offset = 1 / levels;

    var meshData = getUrlParameter("mesh") ? testData[getUrlParameter("mesh")] : testData['danceMoves'];

    babylonInit.getScene().debugLayer.show();

    var processMesh = (originalMesh: BABYLON.Mesh, successCallback: Function = () => { }) => {
        if(meshData.position)
            originalMesh.position = meshData.position;
        if (meshData.initMaterial) {
            var material = new BABYLON.StandardMaterial("mat", babylonInit.getScene());
            originalMesh.material = material;
            originalMesh.material.backFaceCulling = false;
        }

        //set minimum indices to process
        if (originalMesh.getIndices().length < 500 * 3) {
            successCallback();
            return;
        }

        if (parallel) {
            var levelsArray = [];
            for (var i = 1; i < levels; ++i) {
                levelsArray.push(1 - (i * offset));
            }
            levelsArray.forEach((rate) => {
                var decimation = new RaananW.Decimation.Decimator(originalMesh);
                decimation.reInit(() => {
                    decimation.runDecimation(rate, (mesh) => {
                        originalMesh.addLODLevel(distanceOffset / rate, mesh);
                        if (rate == levelsArray[levelsArray.length - 1]) {
                            successCallback();
                        }
                    });
                });
            });
        } else {
            var decimation = new RaananW.Decimation.Decimator();

            var runDecimation = (rate, callback) => {
                decimation.initWithMesh(originalMesh, () => {
                    decimation.runDecimation(rate, (mesh: BABYLON.Mesh) => {
                        originalMesh.addLODLevel(distanceOffset / rate, mesh);
                        callback();
                    });
                });
            }

                RaananW.Tools.AsyncLoop(levels, (loop) => {
                //skip the 100% quality
                if (loop.currentIndex() == 0) {
                    loop.executeNext();
                } else {
                    runDecimation(1 - ((loop.currentIndex()) * offset), () => {
                        loop.executeNext();
                    });
                }
                }, () => {
                        successCallback();
                });
        }
    }

    if (!meshData.fullScene) {
        BABYLON.SceneLoader.ImportMesh("", meshData.root, meshData.filename, babylonInit.getScene(), (newMeshes, particleSystems, skeletons) => {
            babylonInit.attachCameraControl();
            //iterate through all meshIds one by one
            if (meshData.meshIds) {
                meshData.meshIds.forEach((meshId) => {
                    var originalMesh = <BABYLON.Mesh> babylonInit.getScene().getMeshByID(meshId);
                    processMesh(originalMesh);
                });
            } else {
                RaananW.Tools.AsyncLoop(babylonInit.getScene().meshes.length, (loop: RaananW.AsyncLoop) => {
                    processMesh(<BABYLON.Mesh> babylonInit.getScene().meshes[loop.currentIndex()], () => {
                        loop.executeNext();
                    });
                }, () => {
                        //finished processing all
                    });
            }
        });
    } else {
        BABYLON.SceneLoader.Append(meshData.root, meshData.filename, babylonInit.getScene(), (scene) => {
            scene.activeCamera.attachControl(babylonCanvas);
            RaananW.Tools.AsyncLoop(scene.meshes.length, (loop: RaananW.AsyncLoop) => {
                processMesh(<BABYLON.Mesh> scene.meshes[loop.currentIndex()], () => {
                    loop.executeNext();
                });
            }, () => {
                    //finished processing all
                });
        });
    }
}