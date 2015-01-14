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

module RaananW {

    export interface AsyncLoop {
        mutableIterations: number;
        executeNext: () => void;
        currentIndex: () => number;
        stop: () => void;
    }

    export class Tools {

        public static SyncToAsyncForLoop(iterations: number, syncedIterations: number, fn: (iteration: number) => void, callback: () => void, breakFunction?: () => boolean, increase: number = 1, timeout: number = 0) {
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