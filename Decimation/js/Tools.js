var RaananW;
(function (RaananW) {
    var Tools = (function () {
        function Tools() {
        }
        Tools.SyncToAsyncForLoop = function (iterations, syncedIterations, fn, callback, breakFunction, increase, timeout) {
            if (typeof increase === "undefined") { increase = 1; }
            if (typeof timeout === "undefined") { timeout = 0; }
            RaananW.Tools.AsyncLoop(Math.ceil(iterations / syncedIterations), function (loop) {
                if (breakFunction && breakFunction())
                    loop.stop();
                else {
                    setTimeout(function () {
                        for (var i = 0; i < syncedIterations; ++i) {
                            var iteration = (loop.currentIndex() * syncedIterations) + i;
                            if (iteration >= iterations)
                                break;
                            fn(iteration);
                            if (breakFunction && breakFunction()) {
                                loop.stop();
                                break;
                            }
                        }
                        loop.executeNext();
                    }, timeout);
                }
            }, callback);
        };

        Tools.AsyncLoop = function (iterations, func, successCallback) {
            var index = 0;
            var done = false;
            var loop = {
                mutableIterations: iterations,
                executeNext: function () {
                    if (done)
                        return;

                    if (index < this.mutableIterations) {
                        ++index;
                        func(loop);
                    } else {
                        done = true;
                        successCallback();
                    }
                },
                currentIndex: function () {
                    return index - 1;
                },
                stop: function () {
                    done = true;
                    successCallback();
                }
            };
            loop.executeNext();
            return loop;
        };
        return Tools;
    })();
    RaananW.Tools = Tools;
})(RaananW || (RaananW = {}));
//# sourceMappingURL=Tools.js.map
