import Events from './events';
import Icons from './icons';
import handleOption from './options';
import Controller from './controller';
import Template from './template';
import utils from './utils';
import Bar from './bar';
import Vue from 'vue'
let vm = new Vue();

//保存实例的数组
const instances = [];

class Player {
    constructor(options) {
        this.options = handleOption(options);
        this.container = this.options.container;
        this.events = new Events();
        this.paused = true;
        //初始化模板
        this.template = new Template({
            container: this.container,
            options: this.options
        });
        //有效时间
        this.validTime = 0;
        //初始化标签
        this.initAudio();
        //绑定事件
        this.bindEvents();
        //进度条
        this.bar = new Bar(this.template);
        this.controller = new Controller(this);
        //先默认传第一条
        this.setAudio(this.options.audio[0]);
        // autoplay
        if (this.options.autoplay) {
            this.play();
        }
        instances.push(this);
    }
    initAudio() {
        this.audio = document.createElement('audio');
        // document.body.appendChild(this.audio)
        // this.audio.type="audio/mpeg";
        for (let i = 0; i < this.events.audioEvents.length; i++) {
            this.audio.addEventListener(this.events.audioEvents[i], (e) => {
                this.events.trigger(this.events.audioEvents[i], e);
            });
        }
    }
    /**
    * bind events
    */
    on(name, callback) {
        this.events.on(name, callback);
    }
    bindEvents() {
        this.on('play', () => {
            if (this.paused) {
                this.setUIPlaying();
            }
        })
        this.on('pause', () => {
            if (!this.paused) {
                this.setUIPaused();
            }
        });

        this.on('timeupdate', () => {
            //如果是播放中拖动加有效时间
            if ((!this.disableTimeupdate && !this.isDrag) || !this.paused) {
                //单位秒，计算有效时间估算
                this.validTime += 0.25;
                //如果大于总时长，则等于总时长
                if (this.audio && (this.validTime > this.audio.duration)) {
                    this.validTime = this.audio.duration
                }
            }
            if (!this.disableTimeupdate) {
                this.bar.set('played', this.audio.currentTime / this.duration, 'width');
                const currentTime = utils.secondToTime(this.audio.currentTime);
                if (this.template.ptime.innerHTML !== currentTime) {
                    this.template.ptime.innerHTML = currentTime;
                }
            }
        });

        this.on('canplaythrough', () => {
            //该事件表示能在不停下来进行缓冲直接播放
            // this.bar.set('loaded', 1, 'width');
        })
        this.on('loadeddata', () => {
            // show audio loaded bar: to inform interested parties of progress downloading the media
            this.on('progress', () => {
                let buffered, percent;
                this.audio.readyState == 4 && (buffered = this.audio.buffered.end(0));
                this.audio.readyState == 4 && (percent = Math.round(buffered / this.duration));
                this.bar.set('loaded', percent, 'width');
            });
        })
        this.on('canplay', () => {
            this.template.total_time.innerHTML = utils.secondToTime(this.audio.duration);
        })


        this.on('error', () => {
            this.pause();
            // alert('播放错误')
        })
    }
    //切换并播放
    switchAudio(audio) {
        //重置有效时间
        this.validTime = 0;
        //不存在名称和地址时
        if (!audio.name && !audio.url) {
            this.pause();
            this.seek(0);
            this.audio.src = '';
            this.template.title.innerHTML = '';
            this.template.total_time.innerHTML = '0.00';
            return
        }
        //不存在名称时，切换歌曲，并重头开始播放
        else if (!audio.name) {
            // this.bar.set('played', 0, 'width');
            this.seek(0);
            this.audio.src = audio.url;
            this.template.title.innerHTML = '';
            this.template.total_time.innerHTML = '0.00';
            this.play();
            return
        }
        //不存在url时，切换url，名称
        else if (!audio.url) {
            this.seek(0);
            this.pause();
            this.audio.src = '';
            this.template.title.innerHTML = audio.name;
            this.template.total_time.innerHTML = '0.00';
            //提示
            return
        }
        this.seek(0);
        this.template.title.innerHTML = audio.name;
        this.audio.src = audio.url;
        this.play();
    }
    //切换不播放
    setAudio(audio) {
        //重置有效时间
        this.validTime = 0;
        //不存在名称和地址时
        if (!audio.name && !audio.url) {
            this.pause();
            this.seek(0);
            this.audio.src = '';
            this.template.title.innerHTML = '';
            this.template.total_time.innerHTML = '0.00';
            return
        }
        //不存在名称时，切换歌曲，并重头开始播放
        else if (!audio.name) {
            // this.bar.set('played', 0, 'width');
            this.seek(0);
            this.audio.src = audio.url;
            this.template.title.innerHTML = '';
            this.template.total_time.innerHTML = '0.00';
            return
        }
        //不存在url时，切换url，名称
        else if (!audio.url) {
            this.seek(0);
            this.pause();
            this.audio.src = '';
            this.template.title.innerHTML = audio.name;
            this.template.total_time.innerHTML = '0.00';
            //提示
            return
        }
        if (!this.paused) {
            this.pause();
        }
        this.seek(0);
        this.template.title.innerHTML = audio.name;
        this.audio.src = audio.url;
    }
    setUIPlaying() {
        if (this.paused) {
            this.paused = false;
            this.template.button.classList.remove('player-play');
            this.template.button.classList.add('player-pause');
            this.template.button.innerHTML = '';
            let pauseImg = document.createElement('img');
            pauseImg.src = Icons.pause;
            this.template.button.appendChild(pauseImg);
        }
    }

    play() {
        //是否在拖动
        this.isDrag = false;
        this.setUIPlaying();
        const playPromise = this.audio.play();
        if (playPromise) {
            playPromise.catch((e) => {
                console.warn(e.name);
                if (e.name == 'AbortError') {
                    // vm.$message({
                    //     message: '请不要点击太快',
                    //     type: 'error'
                    // })
                }
                if (e.name == 'NotSupportedError') {
                    vm.$message({
                        message: '通话时长为0，无法找到录音文件！',
                        type: 'error'
                    })
                    this.setUIPaused();
                }
            });
        }
        //回调
        this.options.play_cb();
    }

    setUIPaused() {
        if (!this.paused) {
            this.paused = true;
            this.template.button.classList.remove('player-pause');
            this.template.button.classList.add('player-play');
            this.template.button.innerHTML = '';
            let playImg = document.createElement('img');
            playImg.src = Icons.play;
            // setTimeout(() => {
            this.template.button.appendChild(playImg);
            // }, 100);
        }

        // this.container.classList.remove('player-loading');
        // this.timer.disable('loading');
    }

    get duration() {
        return isNaN(this.audio.duration) ? 0 : this.audio.duration;
    }

    pause() {
        //是否在拖动
        this.isDrag = false;
        this.setUIPaused();
        this.audio.pause();
        //回调
        this.options.pause_cb();
    }

    toggle() {
        if (this.template.button.classList.contains('player-play')) {
            this.play();
        }
        else if (this.template.button.classList.contains('player-pause')) {
            this.pause();
        }
    }
    seek(time) {
        time = Math.max(time, 0);
        time = Math.min(time, this.duration);
        this.audio.currentTime = time;
        this.bar.set('played', (time / this.duration) || 0, 'width');
        this.template.ptime.innerHTML = utils.secondToTime(time);
    }
    skipBack() {
        if (this.options.disalbed === true) {
            return
        }
        let interval = parseFloat(this.options.backward_interval / 1000);
        let time = this.audio.currentTime - interval;
        time = Math.max(time, 0);
        time = Math.min(time, this.duration);
        this.audio.currentTime = time;
        // this.template.timeInterval.innerHTML = '-' + utils.secondToTime(interval);
        this.options.backward_cb();
    }

    skipForward() {
        if (this.options.disalbed === true) {
            return
        }
        let interval = parseFloat(this.options.forward_interval / 1000);
        let time = this.audio.currentTime + interval;
        time = Math.max(time, 0);
        time = Math.min(time, this.duration);
        // console.log(this.audio.currentTime)
        // console.log(time)
        this.audio.currentTime = time;
        // this.template.timeInterval.innerHTML = '+' + utils.secondToTime(interval);
        this.options.forward_cb();
    }

    destroy() {
        instances.splice(instances.indexOf(this), 1);
        this.pause();
        this.template.container.innerHTML = '';
        this.audio.src = '';
        this.events.trigger('destroy');
        // document.body.removeChild(this.audio)
    }
}
export default Player