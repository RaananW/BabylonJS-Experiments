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
