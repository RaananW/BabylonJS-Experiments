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

window.onload = function () {
    var babylonCanvas = document.getElementById("renderCanvas");

    //Init babylon
    var babylonInit = new RW.Babylon.BabylonInit(babylonCanvas, 0 /* ARC_ROTATE */);
    babylonInit.attachCameraControl();
    babylonInit.getCamera().setPosition(new BABYLON.Vector3(-12, 30, 350));

    BABYLON.SceneLoader.ImportMesh("", "./", "test_out.babylon", babylonInit.getScene(), function () {
        var knot = babylonInit.getScene().getMeshByID("52809131-6db1-4985-928f-27733e9ce896");
        var material = new BABYLON.StandardMaterial("mat", babylonInit.getScene());
        knot.material = material;

        //knot.material.wireframe = true;
        knot.material.backFaceCulling = false;
        var decimation = new RaananW.Decimation.Decimator(knot);
        var rate = getUrlParameter("rate") ? parseFloat(getUrlParameter("rate")) : 0.5;
        decimation.runDecimation(rate);
        var mesh = decimation.reconstructMesh();

        [mesh, knot].forEach(function (m) {
            m.actionManager = new BABYLON.ActionManager(babylonInit.getScene());
            m.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (evt) {
                console.log(babylonInit.getCamera());
                babylonInit.getCamera().target = (m.position);
            }));
        });

        knot.position.x -= 200;
        mesh.position.x += 100;
        console.log(knot.getTotalIndices() / 3, mesh.getTotalIndices() / 3);
    });
};
//# sourceMappingURL=Main.js.map
