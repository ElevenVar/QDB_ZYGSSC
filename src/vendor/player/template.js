import Icons from './icons';
import tplPlayer from './template/player.art';

class Template {
    constructor (options) {
        this.container = options.container;
        this.options = options.options;
        this.init();
    }

    init () {
        this.container.innerHTML = tplPlayer({
            options: this.options,
            // audio:this.options.audio[0],
            icons: Icons,
            getObject: (obj) => obj
        });
        this.wrapper=this.container.querySelector('.dgg-player-wrapper');
        this.button = this.container.querySelector('.dgg-play-btn');
        this.backwardButton = this.container.querySelector('.dgg-player-backward');
        this.forwardButton = this.container.querySelector('.dgg-player-forward');
        this.timeInterval = this.container.querySelector('.time-interval');
        // this.barBg = this.container.querySelector('.dgg-player-bar-bg');
        this.barWrap = this.container.querySelector('.dgg-player-bar-bg');
        this.played = this.container.querySelector('.dgg-player-bar-played');
        this.loaded = this.container.querySelector('.dgg-player-bar-loaded');
        this.ptime = this.container.querySelector('.ptime');
        this.total_time = this.container.querySelector('.time-total');
        this.title=this.container.querySelector('.title');
    }
}

export default Template;
