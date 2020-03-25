import DggPlayer from './player';

// console.log('dgg player!!!');
//挂载全局
!function(window){
    if(window){
        window.DggPlayer=DggPlayer;
    }
}(window)

export default DggPlayer;