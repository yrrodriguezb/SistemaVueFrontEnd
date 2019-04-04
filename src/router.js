import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Categoria from "./components/Categoria";
import Articulo from "./components/Articulo";
import Rol from "./components/Rol";
import Usuario from "./components/Usuario";
import Cliente from "./components/Cliente";
import Proveedor from "./components/Proveedor";
import Login from "./components/Login";
import Ingreso from "./components/Ingreso";
import Venta from "./components/Venta";
import ConsultaVenta from "./components/ConsultaVenta.vue";
import store from "./store";

Vue.use(Router)

var router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        admin: true,
        almacenero: true,
        vendedor: true
      }
    },
    {
      path: '/categorias',
      name: 'categorias',
      component: Categoria,
      meta: {
        admin: true,
        almacenero: true
      }
    },
    {
      path: '/articulos',
      name: 'articulos',
      component: Articulo,
      meta: {
        admin: true,
        almacenero: true
      }
    },
    {
      path: '/ingresos',
      name: 'ingresos',
      component: Ingreso,
      meta: {
        admin: true,
        almacenero: true
      }
    },
    {
      path: '/roles',
      name: 'roles',
      component: Rol,
      meta: {
        admin: true
      }
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: Usuario,
      meta: {
        admin: true
      }
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: Cliente,
      meta: {
        admin: true,
        vendedor: true
      }
    },
    {
      path: '/ventas',
      name: 'ventas',
      component: Venta,
      meta: {
        admin: true,
        vendedor: true
      }
    },
    {
      path: '/consultaventas',
      name: 'consultaventas',
      component: ConsultaVenta,
      meta: {
        admin: true
      }
    },
    {
      path: '/proveedores',
      name: 'proveedores',
      component: Proveedor,
      meta: {
        admin: true,
        almacenero: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        all: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.all)){
    next();
  } else if (store.state.usuario && store.state.usuario.rol == "Administrador"){
    if (to.matched.some(record => record.meta.admin)){
      next();
    }
  } else if (store.state.usuario && store.state.usuario.rol == "Almacenero"){
    if (to.matched.some(record => record.meta.almacenero)){
      next();
    }
  } else if (store.state.usuario && store.state.usuario.rol == "Vendedor"){
    if (to.matched.some(record => record.meta.vendedor)){
      next();
    }
  } else {
    next({ name: 'login' });
  }
});

export default router;
