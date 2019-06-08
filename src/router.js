import Vue from 'vue';
import Router from 'vue-router';
import store from './store';
import http from './http';
// import http from './http';
import Home from './views/Home.vue';
import Map from './views/Map.vue';
import Auth from './views/auth/Auth.vue';
import Login from './views/auth/Login.vue';
import SignUp from './views/auth/SignUp.vue';
import SignUpComplete from './views/auth/SignUpComplete.vue';
import RecoverPassword from './views/auth/RecoverPassword.vue';
import RecoverPasswordRequest from './views/auth/RecoverPasswordRequest.vue';
import NewInitiative from './views/initiatives/New.vue';
import ListInitiatives from './views/initiatives/List.vue';
import Initiative from './views/initiative/Initiative.vue';
import InitiativeAbout from './views/initiative/About.vue';
// Admin panel
import Admin from './views/admin/Admin.vue';
import AdminIndex from './views/admin/AdminIndex.vue';
import AdminConfigAdministrators from './views/admin/config/Administrators.vue';
import AdminInitiativesList from './views/admin/initiatives/List.vue';
import AdminInitiativesNew from './views/admin/initiatives/New.vue';
import AdminInitiativesListCities from './views/admin/initiatives/Cities.vue';
import AdminMapCitiesList from './views/admin/map/cities/List.vue';
import AdminMapCitiesNew from './views/admin/map/cities/New.vue';
import AdminMapCountriesList from './views/admin/map/countries/List.vue';
import AdminMapRegionsList from './views/admin/map/regions/List.vue';
// User panel
import User from './views/user/User.vue';
import UserIndex from './views/user/UserIndex.vue';
import UserAccountChangePassword from './views/user/account/ChangePassword.vue';

Vue.use(Router);

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {},
    },
    {
      path: '/map',
      name: 'map',
      component: Map,
      meta: {
        hideFooter: true,
      },
    },
    {
      path: '/initiatives/new',
      name: 'newInitiative',
      component: NewInitiative,
      meta: {
        hideFooter: true,
        requiresAuth: true,
      },
    },
    {
      path: '/initiatives',
      name: 'listInitiatives',
      component: ListInitiatives,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/initiative/:id',
      component: Initiative,
      props: true,
      redirect: {
        name: 'home',
      },
      children: [
        {
          path: '',
          name: 'Initiative',
          component: InitiativeAbout,
          props: true,
          meta: {},
        },
      ],
      beforeEnter: (to, from, next) => {
        console.log('First time entering, getting initiative...');
        http
          .get(`/v1/initiatives/${to.params.id}`)
          .then((response) => {
            store.commit('setInitiative', response.data.data);
            console.log('GET OK - Got initiative');
            next();
          })
          .catch((error) => {
            console.log('Fetching data failed.', error);
            next({ name: 'home' });
          });
      },
    },
    {
      path: '/auth',
      component: Auth,
      redirect: {
        name: 'home',
      },
      children: [
        {
          path: 'login',
          name: 'login',
          component: Login,
          meta: {
            hideNavbar: true,
            hideFooter: true,
            requiresAnon: true,
          },
        },
        {
          path: 'signup',
          name: 'signup',
          component: SignUp,
          meta: {
            hideNavbar: true,
            hideFooter: true,
            requiresAnon: true,
          },
        },
        {
          path: 'complete-signup/:token',
          name: 'completeSignUp',
          component: SignUpComplete,
          props: true,
          meta: {
            hideNavbar: true,
            hideFooter: true,
            requiresAnon: true,
          },
        },
        {
          path: 'recover/request',
          name: 'recoverRequest',
          component: RecoverPasswordRequest,
          meta: {
            hideNavbar: true,
            hideFooter: true,
            requiresAnon: true,
          },
        },
        {
          path: 'recover/:token',
          name: 'recoverPassword',
          component: RecoverPassword,
          props: true,
          meta: {
            hideNavbar: true,
            hideFooter: true,
            requiresAnon: true,
          },
        },
      ],
    },
    {
      path: '/admin',
      component: Admin,
      children: [
        {
          path: '',
          name: 'admin',
          component: AdminIndex,
          meta: {
            requiresAdmin: true,
          },
        },
        {
          path: 'map/config/administrators',
          name: 'adminConfigAdministrators',
          component: AdminConfigAdministrators,
          meta: {
            requiresAdmin: true,
          },
        },
        {
          path: 'map/initiatives/new',
          name: 'adminInitiativesNew',
          component: AdminInitiativesNew,
          meta: {
            requiresAdmin: true,
          },
        },
        {
          path: 'map/initiatives/list',
          name: 'adminInitiativesList',
          component: AdminInitiativesList,
          meta: {
            requiresAdmin: true,
          },
        },
        {
          path: 'map/initiatives/list/cities',
          name: 'adminInitiativesListCities',
          component: AdminInitiativesListCities,
          meta: {
            requiresAdmin: true,
          },
        },
        {
          path: 'map/cities/new',
          name: 'adminMapCitiesNew',
          component: AdminMapCitiesNew,
          meta: {
            requiresAdmin: true,
          },
        },
        {
          path: 'map/cities/list',
          name: 'adminMapCitiesList',
          component: AdminMapCitiesList,
          meta: {
            requiresAdmin: true,
          },
        },
        {
          path: 'map/countries/list',
          name: 'adminMapCountriesList',
          component: AdminMapCountriesList,
          meta: {
            requiresAdmin: true,
          },
        },
        {
          path: 'map/regions/list',
          name: 'adminMapRegionsList',
          component: AdminMapRegionsList,
          meta: {
            requiresAdmin: true,
          },
        },
      ],
    },
    {
      path: '/user',
      component: User,
      children: [
        {
          path: '',
          name: 'user',
          component: UserIndex,
          meta: {
            requiresAdmin: true,
          },
        },
        {
          path: 'account/change-password',
          name: 'userAccountChangePassword',
          component: UserAccountChangePassword,
          meta: {
            requiresAdmin: true,
          },
        },
      ],
    },
  ],
  // eslint-disable-next-line
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },

});

const isEmpty = obj => !obj || Object.keys(obj).length === 0;

router.beforeEach(async (to, from, next) => {
  // next();
  // if (to.meta.withNavbar) document.documentElement.classList.add('has-navbar-fixed-top');
  // else document.documentElement.classList.remove('has-navbar-fixed-top');
  const requiresAnon = to.matched.find(record => Object.prototype.hasOwnProperty.call(record.meta, 'requiresAnon'));
  const requiresAuth = to.matched.find(record => Object.prototype.hasOwnProperty.call(record.meta, 'requiresAuth'));
  const requiresAdmin = to.matched.find(record => Object.prototype.hasOwnProperty.call(record.meta, 'requiresAdmin'));
  console.log('requiresAnon', requiresAnon);
  console.log('requiresAuth', requiresAuth);
  console.log('requiresAdmin', requiresAdmin);
  if (requiresAnon) {
    console.log('- Requires anon');
    // Is anonymous
    const isAnon = isEmpty(store.getters.user);
    if (isAnon) {
      console.log('-- is anon, go on');
      next();
    } else {
      console.log('-- NOT ANON, kick to home');
      next({
        name: 'home',
      });
    }
  } else if (requiresAuth) {
    console.log('- Requires auth');
    const isAuth = store.state.isAuthenticated;
    if (!isAuth) {
      console.log('-/ Not logged in.. FORBIDDEN');
      next({
        name: 'forbidden',
      });
    }
    if (requiresAdmin) {
      console.log('-- Requires admin role');
      const isAdmin = store.getters.isAdmin || false;
      if (isAdmin) {
        console.log('--- is Admin! Go on');
        next();
      } else {
        console.log('--- NO ADMIN, GET OUT OF HERE');
        next({
          name: 'forbidden',
        });
      }
    }
    console.log('-- is logged, go on');
    next();
  } else {
    console.log('- All good, go on');
    next();
  }

  // if (requiresAnon) {
  //   console.log('- Requires anon');
  //   // Is anonymous
  //   const isAnon = isEmpty(store.state.user);
  //   if (isAnon) {
  //     console.log('-- is anon, go on');
  //     next();
  //   } else {
  //     console.log('-- NOT ANON, kick to home');
  //     next({
  //       name: 'home',
  //     });
  //   }
  // } else if (requiresAuth) {
  //   console.log('- Requires auth');
  //   const isAuth = store.state.isAuthenticated;
  //   if (!isAuth) {
  //     console.log('-/ Not logged in.. getting user info');
  //     try {
  //       await getUser();
  //       console.log('-// Got user');
  //     } catch {
  //       console.log('-// Not logged, FORBIDDEN');
  //       next({
  //         name: 'forbidden',
  //       });
  //     }
  //   }
  //   if (requiresAdmin) {
  //     console.log('-- Requires admin role');
  //     const isAdmin = store.state.user.isAdmin || false;
  //     if (isAdmin) {
  //       console.log('--- is Admin! Go on');
  //       next();
  //     } else {
  //       console.log('--- NO ADMIN, GET OUT OF HERE');
  //       next({
  //         name: 'forbidden',
  //       });
  //     }
  //   }
  //   console.log('-- is logged, go on');
  //   next();
  // } else {
  //   console.log('- All good, go on');
  //   next();
  // }

  // if (to.matched.some(record => record.meta.requiresAdmin)) {
  //   // console.log('requiresAdmin');
  //   // console.log(store.state.isAuthenticated);
  //   // this route requires auth, check if logged in
  //   // if not, redirect to login page.
  //   if (!store.getters.isAdmin && !store.state.isAuthenticated) {
  //     // console.log('to-login');
  //     next({
  //       path: '/forbidden',
  //       // query: { redirect: to.fullPath }
  //     });
  //   } else {
  //     next();
  //   }
  // }
  // if (to.matched.some(record => record.meta.requiresAuth)) {
  //   // console.log('requiresAuth');
  //   // console.log(store.state.isAuthenticated);
  //   // this route requires auth, check if logged in
  //   // if not, redirect to login page.
  //   if (!store.state.isAuthenticated) {
  //     // console.log('to-login');
  //     next({
  //       path: '/login',
  //       // query: { redirect: to.fullPath }
  //     });
  //   } else {
  //     next();
  //   }
  // }
  // if (to.matched.some(record => record.meta.requiresAnon)) {
  //   // this route requires auth, check if logged in
  //   console.log('requiresAnon');
  //   console.log(store.state.isAuthenticated);
  //   // if not, redirect to login page.
  //   if (store.state.isAuthenticated) {
  //     // console.log('to-home');
  //     next({
  //       path: '/',
  //     });
  //   } else {
  //     next();
  //   }
  // }
  // next();
});

export default router;
