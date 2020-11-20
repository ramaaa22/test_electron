

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import AsyncComputed from 'vue-async-computed';
import Animate from 'vue2-animate/dist/vue2-animate.min.css';


import Vue from 'vue';
import moment from 'moment';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/es';

import '@/styles/index.scss'; // global css

import App from './App';
import store from './store';
import router from './router';

import Logo from '@/components/Logo';

import '@/permission'; // permission control

moment.locale('es');

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
    const { mockXHR } = require('../mock')
    mockXHR()
}

Vue.use(AsyncComputed);
Vue.use(Animate);

// set ElementUI lang to ES
Vue.use(ElementUI, { locale });

Vue.config.productionTip = false

Vue.mixin({
    data: () => ({
        $spacing: 10
    }),

    computed: {
        user(){
            return this.$store.getters.user;
        }
    },
    methods: {
        $handleErrors(error) {
            const handleable_error = error.response && 
                error.response.data &&
                error.response.data.error;

            if (!handleable_error)
                return;

            let message = error.response.data.error.message;

            const its_an_object_message = typeof message === 'object';

            let message_params = {
                offset: 80,
                offset: 80,
                showClose: true,
                message,
                type: 'error'
            };

            if (its_an_object_message) {
                message_params.duration = 15000;

                let messages = [];

                for(let key in message) {
                    messages.push(message[key].join("\r\n"));
                }

                message_params.message = messages.join("\r\n");
                message_params.type = 'warning';
            }
            
            this.$backToTop();
            this.$message(message_params);
        },

        $backToTop() {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }
    },

    components: {
        Logo
    }
});

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
