import { setToken, removeToken } from '@/utils/auth';
import { resetRouter } from '@/router';
import axios from '@/utils/request';

const getDefaultState = () => ({
    user: null
});

const state = getDefaultState();

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState());
    },
    SET_USER: (state, user) => {
        state.user = user
    }
}

const actions = {
    async login({ commit }, credentials) {
        const { data } = await axios.post('/auth/signin', credentials, {
            api: 'users'
        });
        const token = data.access_token;
        
        setToken('users', token);
    },

    async loginRevision({commit}){
        const request = new FormData();

        request.append('grant_type', 'client_credentials');
        request.append('scope', '*');
        request.append('client_id', process.env.VUE_APP_REVISION_CLIENT_ID);
        request.append('client_secret', process.env.VUE_APP_REVISION_CLIENT_SECRET);

        const { data } = await axios.post('/oauth/token', request,
        {
            api: 'revision'
        });

        setToken('revision', data.access_token);

    },
    
    async retrieveUser({ commit }) {
        try {
            const { data } = await axios.get('/auth/user', {
                api: 'users',
                oauth: true
            });
            const user = data.resource;

            commit('SET_USER', user);
        }
        catch(error) {
            await this.$store.dispatch('user/resetToken');
            
            this.$message({
                offset: 40,
                showClose: true,
                duration: 5000,
                message: 'La credenciales expiraron. Por favor ingrese nuevamente.',
                type: 'info'
            });

            this.$router.push({ name: 'auth.login', params: { 
                redirect: this.$route.name,
                redirect_params: this.$route.params
            }});
        }
     },

    // user logout
    logout({ commit, state }) {
        removeToken('users'); // must remove  token  first
        window.location.reload();
        resetRouter();
        commit('RESET_STATE');
    },

    // remove token
    async resetToken({ commit }) {
        removeToken('users') // must remove  token  first
        commit('RESET_STATE');
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

