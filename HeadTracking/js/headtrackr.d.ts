/**
 * A quick declaration file for headtrackr (NOT including all of its functions) to make it play nice with typescript.
 */
declare module headtrackr {
    class Tracker {
        constructor(params);
        public init(videoInput: HTMLVideoElement, canvasInput: HTMLCanvasElement) : void;
        public start(): void;

    } 
} 