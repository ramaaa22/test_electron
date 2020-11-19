import router from './router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken } from '@/utils/auth'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';

NProgress.configure({
    showSpinner: false
}); // NProgress Configuration

router.beforeEach(async (to, from, next) => {
    const require_auth = to.matched.some(record => record.meta.require_auth);
    const require_not_auth = to.matched.some(record => record.meta.require_not_auth);

    // start progress bar
    NProgress.start()

    // set page title
    document.title = getPageTitle(to.meta.title);

    document.body.id = to.name.replace(/\./g, '_');

    // determine whether the user has logged in
    const has_token = getToken('users');

    if (require_auth && !has_token) {
        next({ 
            name: 'auth.login',
            params: { 
                needs_to_login: true,
                redirect: to.name,
                redirect_params: to.params
            }
        });
        NProgress.done();
    }
    else if (require_not_auth && has_token) {
        next({ name: 'Creación' });
        NProgress.done();
    }
    else 
        next(); // make sure to always call next()!
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})
