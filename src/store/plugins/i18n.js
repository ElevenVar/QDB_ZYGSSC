import Vue from 'vue'
import VueI18n from 'vue-i18n'

import * as types from '../types'

import enLocale from '../../lang/en'
import zhLocale from '../../lang/zh'

Vue.use(VueI18n)
const messages = {
    en: {
        ...enLocale,
    },
    zh: {
        ...zhLocale,
    },
}
export const i18n = new VueI18n({
    locale: 'en',
    messages: messages,
})


function i18nPlugin(store) {
    store.subscribe((mutation, state) => {
        if (mutation.type === types.SET_LANGUAGE) {
            i18n.locale = mutation.payload.toString()
        }
    })
}

export default i18nPlugin