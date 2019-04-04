<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Usuarios</v-toolbar-title>
          <v-divider
            class="mx-2"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <v-btn slot="activator" color="success" dark class="mb-2">Nuevo</v-btn>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
      
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6 md6>
                        <v-text-field v-model="usuario.nombre" label="Nombre"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md6>
                        <v-select v-model="usuario.idRol" :items="roles" label="Rol"></v-select>
                      </v-flex>
                      <v-flex xs12 sm6 md6>
                        <v-select v-model="usuario.tipo_Documento" :items="documentos" label="Tipo Documento"></v-select>
                      </v-flex>
                      <v-flex xs12 sm6 md6>
                        <v-text-field v-model="usuario.num_Documento" label="Número Documento"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md6>
                        <v-text-field v-model="usuario.direccion" label="Dirección"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md6>
                          <v-text-field v-model="usuario.telefono" label="Teléfono"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md6>
                          <v-text-field v-model="usuario.email" label="Email"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md6>
                          <v-text-field type="password" v-model="usuario.password" label="Password"></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
    
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="close">Cancelar</v-btn>
                    <v-btn color="blue darken-1" flat @click.native="guardar">Guardar</v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-dialog>
        </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="usuarios"
        :search="search"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td class="justify-center layout px-0">
            <v-icon
            small
            class="mr-2"
            color="warning"
            @click="editItem(props.item)"
            >
            edit
            </v-icon>
            <template v-if="props.item.condicion">
                <v-icon 
                  color="red"
                  small
                  @click="deleteItem(true, props.item)"
                >
                block
                </v-icon>
            </template>
            <template v-else>
              <v-icon color="success" small @click="deleteItem(false, props.item)">
                check
              </v-icon>
            </template>
          </td>
          <td>{{ props.item.nombre }}</td>
          <td>{{ props.item.rol }}</td>
          <td>{{ props.item.tipo_Documento }}</td>
          <td>{{ props.item.num_Documento }}</td>
          <td>{{ props.item.direccion }}</td>
          <td>{{ props.item.telefono }}</td>
          <td>{{ props.item.email }}</td>
          <td>
            <div v-if="props.item.condicion">
                <span class="blue--text">Activo</span>
            </div>
            <div v-else>
                <span class="red--text">Inactivo</span>
            </div>
          </td>
        </template>
        <template slot="no-data">
          <v-btn color="primary" @click="listar">Resetear</v-btn>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>
<script>
  import axios from 'axios';
  import { servicesUsuario, servicesRoles } from "../services";

  export default {
    data(){
      return {
        valid: true,              
        dialog: false,
        usuarios:[],  
        headers: [
          { text: 'Opciones', value: 'opciones', sortable: false },
          { text: 'Nombre', value: 'nombre' },
          { text: 'Rol', value: 'rol' },
          { text: 'Tipo Documento', value: 'tipo_documento' },
          { text: 'Número Documento', value: 'num_documento', sortable: false  },
          { text: 'Dirección', value: 'direccion', sortable: false  },
          { text: 'Teléfono', value: 'telefono', sortable: false  },
          { text: 'Email', value: 'email', sortable: false  },
          { text: 'Estado', value: 'condicion', sortable: false  }                
        ],
        search: '',
        editedIndex: -1,
        usuario: {
          idUsuario: 0,
          idRol: 0,
          rol: '',
          nombre:'',
          tipo_Documento: '',
          num_Documento: '',
          direccion: '',
          telefono: '',
          email: '',
          password:'',
          password_Hash: '',
          passwordAnt:'',
          actPassword:false  
        },
        roles:[],
        documentos: ['DNI','RUC','PASAPORTE','CEDULA'],
      }
    },
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo usuario' : 'Actualizar usuario'
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
      console.log('Aqui......')
      this.listar();
      this.select();     
    },

    methods:{
      listar(){
        servicesUsuario.getAll().then(res => {
          this.usuarios = res.data;
        }).catch(err => {
          console.log(err);
        });
      },
      select(){
        servicesRoles.getList().then(res => {
          this.roles = res.data.map(rol => {
            return { text: rol.nombre, value: rol.idRol };
          });
        }).catch(err => {
          console.log(err);
        });
      },
      editItem (item) {
        this.usuario = Object.assign({}, item);
        this.usuario.password = this.usuario.password_Hash;
        this.editedIndex = 1;
        this.dialog = true;
      },

      reset () {
        this.$refs.form.reset();
      },

      close () {
        this.dialog = false;
        this.reset();
        this.limpiar();
      },
      limpiar(){
        Object.assign(this.usuario, {});
        this.editedIndex = -1;
      },

      deleteItem (activate, item) {
        let accion = activate ? 'Desactivar' : 'Activar';
        let msg = `¿Estas seguro que quieres ${accion} el usuario ${item.nombre}?`; 
        let confirmar = confirm(msg);

        if (confirmar)
          servicesUsuario.putEstado(item.idUsuario).then(res => {
            this.listar();
          }).catch(err => {
            console.error('Ha ocurrido un error al intentar actualizar el estado. ', err);
          });
      },

      save () {
        servicesUsuario.post(this.usuario).then(res => {
          this.listar();
          this.close();
        }).catch(err => {
          console.error('Ha ocurrio un error al guardar.', err);
        });
      },

      update () {
        servicesUsuario.put(this.usuario).then(res => {
          this.close();
          this.listar();
        }).catch(err => {
          console.error('Ha ocurrio un error al guardar.', err);
        });
      },

      guardar () {
        if (!this.$refs.form.validate())
          return;

        if (this.editedIndex > -1) {
          if (this.usuario.password != this.usuario.passwordAnt)
            this.usuario.actPassword = true;

          this.update();
        } else {
          this.save();
        }
      }
      
    }        
  }
</script>