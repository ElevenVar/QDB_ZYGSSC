import utils from './utils';
// import Icons from './icons';

class Controller {
    constructor(player) {
        this.player = player;
        this.initPlayButton();
        this.initSkipButton();
        this.initPlayBar();
        // if (!utils.isMobile) {
        // }
    }

    initPlayButton() {
        this.player.template.button.addEventListener('click', () => {
            this.player.toggle();
        });
    }
    initSkipButton() {
        document.onkeydown = (e) => {
            if (e.keyCode === 37) {
                this.player.skipBack();
            } else if (e.keyCode === 39) {
                this.player.skipForward();
            } else {
                return
            }
        }
        this.player.template.backwardButton.addEventListener('click', () => {
            this.player.skipBack();
        });
        this.player.template.forwardButton.addEventListener('click', () => {
            this.player.skipForward();
        });
    }
    initPlayBar() {
        if (this.player.options.disalbed === true) {
            return
        }
        let interval=0;
        let starttime=0;
        let endtime=0;
        const thumbMove = (e) => {
                  //添加一个缓动效果
                  endtime=new Date();
                  interval=endtime-starttime;
                  if(interval<300){
                      this.player.template.played.style.transition='width 0.2s';
                  }
                  else{
                      this.player.template.played.style.transition='none';
                  }
                  //添加一个缓动效果结束
            let percentage = ((e.clientX || e.changedTouches[0].clientX) - this.player.template.barWrap.getBoundingClientRect().left) / this.player.template.barWrap.clientWidth;
            percentage = Math.max(percentage, 0);
            percentage = Math.min(percentage, 1);
            this.player.bar.set('played', percentage, 'width');
            this.player.lrc && this.player.lrc.update(percentage * this.player.duration);
            this.player.template.ptime.innerHTML = utils.secondToTime(percentage * this.player.duration);
        };

        const thumbUp = (e) => {
            //添加一个缓动效果
            endtime=new Date();
            interval=endtime-starttime;
            if(interval<300){
                this.player.template.played.style.transition='width 0.2s';
            }
            else{
                this.player.template.played.style.transition='none';
            }
            document.removeEventListener(utils.nameMap.dragEnd, thumbUp);
            document.removeEventListener(utils.nameMap.dragMove, thumbMove);
            let percentage = ((e.clientX || e.changedTouches[0].clientX) - this.player.template.barWrap.getBoundingClientRect().left) / this.player.template.barWrap.clientWidth;
            percentage = Math.max(percentage, 0);
            percentage = Math.min(percentage, 1);
            this.player.seek(percentage * this.player.duration);
            this.player.bar.set('played', percentage, 'width');
            this.player.disableTimeupdate = false;
            //是否在拖动
            this.player.isDrag = true;
            //回调
            this.player.options.dragend_cb();
        };

        this.player.template.barWrap.addEventListener(utils.nameMap.dragStart, () => {
            starttime=new Date();
            this.player.template.played.style.transition='none';
            this.player.disableTimeupdate = true;
            document.addEventListener(utils.nameMap.dragMove, thumbMove);
            document.addEventListener(utils.nameMap.dragEnd, thumbUp);
        });
    }
}

export default Controller;