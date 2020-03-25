export default (options) => {

    // default options
    const defaultOption = {
        container: options.element || document.getElementById('dggplayer'),
        autoplay: false,
        //快进，快退的间隔
        forward_interval: 60000,
        backward_interval: 30000,
        //禁止快进和后退
        disalbed: false,
        audio: [],
        pause_cb: function () {
        },
        play_cb: function () {
        },
        forward_cb: function () {
        },
        backward_cb: function () {
        },
        dragend_cb: function () {
            // console.log('dragend')
        }
        // fixed: false,
        //互斥，阻止多个播放器同时播放，当前播放器播放时暂停其他播放器
        // mutex: true,
        //是否循环播放
        // loop: true,
        // volume: 0.7,
        // storageName: 'dggplayer-setting'
    };
    for (const defaultKey in defaultOption) {
        if (defaultOption.hasOwnProperty(defaultKey) && !options.hasOwnProperty(defaultKey)) {
            options[defaultKey] = defaultOption[defaultKey];
        }
    }


    if (Object.prototype.toString.call(options.audio) !== '[object Array]') {
        if (!options.audio.url) {
            console.warn('no url path!!!')
        }
        options.audio = [options.audio];
    }

    options.audio.map((item) => {
        // item.name = item.name || item.title || 'Audio name';
        // item.artist = item.artist || item.author || 'Audio artist';
        // item.type = item.type || 'normal';
        return item;
    });

    return options;
};
