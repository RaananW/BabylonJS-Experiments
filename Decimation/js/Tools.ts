module RaananW {

    export interface AsyncLoop {
        mutableIterations: number;
        executeNext: () => void;
        currentIndex: () => number;
        stop: () => void;
    }

    export class Tools {

        public static SyncToAsyncForLoop(iterations: number, syncedIterations: number, fn: (iteration: number) => void, callback: () => void, breakFunction?: () => boolean, increase:number = 1, timeout:number = 0) {
            RaananW.Tools.AsyncLoop(Math.ceil(iterations/syncedIterations), (loop:AsyncLoop) => {
                if (breakFunction && breakFunction()) loop.stop();
                else {
                    setTimeout(() => {
                        for (var i = 0; i < syncedIterations; ++i) {
                            var iteration = (loop.currentIndex() * syncedIterations) + i;
                            if (iteration >= iterations) break;
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
        }

        public static AsyncLoop(iterations: number, func: (loop:AsyncLoop) => void, successCallback: () => void) :AsyncLoop {
            var index = 0;
            var done = false;
            var loop = <AsyncLoop> {
                mutableIterations : iterations,
                executeNext: function () {
                    if (done)  return;

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
        }   
    }
} 