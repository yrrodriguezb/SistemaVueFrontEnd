<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md6 lg5 x14>
      <v-form>
        <v-card>
          <v-card-title primary-title class="text-md-center">
            <div >
              <h3 class="text--blue darken-3">Ingreso al Sistema</h3>
            </div>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text>
            <v-text-field
              autofocus
              v-model="usuario.email"
              label="E-mail"
              data-vv-name="email"
              required
              :error-messages="errores.email"
            ></v-text-field>

            <v-text-field
              type="password"
              v-model="usuario.password"
              :counter="10"
              label="Password"
              data-vv-name="name"
              required
              :error-messages="errores.password"
            ></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-flex text-xs-right>
              <v-btn 
                color="primary" 
                flat
                @click="login">Iniciar Sesión
              </v-btn>
            </v-flex>
          </v-card-actions>

        </v-card>
      </v-form>
    </v-flex>
  </v-layout>
</template>
<script>
import { servicesUsuario } from "../services";

export default {
  data() {
    return {
      usuario: {
        email: '',
        password: ''
      },
      errores: {
        email: [],
        password: []
      }
    }
  },

  methods: {
    login () {
      console.log('aqui');
      
      this.errores.email = [];
      this.errores.password = []

      servicesUsuario.login(this.usuario).then(res => {
        return res.data;
      }).then(data => {
        this.$store.dispatch("guardarToken", data.token);
        this.$router.push({ name: 'home' });
      }).catch(err => {
        let status = err.response.status;
        if (status == 400)
          this.errores.email.push('El email no es valido o no esta registrado en el sistema');
        else if (status == 404)
          this.errores.password.push('No existe el usuario o los datos son incorrectos')
        else
          this.errores.password.push('Ha ocurrio un error al intentar ingresr al sistema.')
      })
    }
  }
}
</script>

