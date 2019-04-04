<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title class="blue--text">Categorias</v-toolbar-title>
        <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>

        <v-spacer></v-spacer>
        
        <v-text-field
          class="text-xs-center"
          v-model="search"
          append-icon="search"
          label="Búsqueda"
          single-line
          hide-details> 
        </v-text-field>

        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <v-btn slot="activator" color="success" dark class="mb-2">Agregar</v-btn>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
  
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                    <v-text-field v-model="categoria.nombre" label="Nombre" :rules="reglas.vacio" clearable></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field v-model="categoria.descripcion" label="Descripción" :rules="reglas.vacio" clearable></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
  
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="close">Canclear</v-btn>
              <v-btn color="blue darken-1" flat :disabled="!valid" @click="guardar">Guardar</v-btn>
            </v-card-actions>
          </v-card>
          </v-form>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="categorias"
        :search="search"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td class="layout px-10 ">
            <v-icon
              color="warning"
              small
              class="mr-2"
              @click="editItem(props.item)"
            >
              edit
            </v-icon>
            <template v-if="props.item.condicion">
              <v-icon
                color="error"
                small
                @click="deleteItem(true, props.item)"
              >
                block
              </v-icon>
            </template>
            <template v-else>
              <v-icon
                color="success"
                small
                @click="deleteItem(false, props.item)"
              >
                check
              </v-icon>
            </template>
          </td>
          <td>{{ props.item.nombre }}</td>
          <td>{{ props.item.descripcion }}</td>
          <td>
            <div v-if="props.item.condicion"><span class="blue--text">Activo</span></div>
            <div v-else><span class="red--text">Inactivo</span></div>
          </td>
        </template>
        <template slot="no-data">
          <v-btn color="primary" >Resetear</v-btn>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";
import { serviceCategoria } from "../services";

export default {
  data(){
    return {
      dialog: false,
      valid: true,
      categorias: [],
      headers: [
        { text: 'Acción', value: 'opciones', sortable: false },
        { text: 'Nombre', value: 'nombre', },
        { text: 'Descripcion', value: 'descripcion', sortable: false },
        { text: 'Estado', value: 'condicion', sortable: true }
      ],
      search: '',
      editedIndex: -1,
      categoria: {
        idCategoria: 0,
        nombre: '',
        descripcion: ''
      },
      reglas: {
        vacio: [
          v => !!v || 'Este campo es obligatorio',
          v => v && !(v.length < 3 || v.length > 50 ) || 'la longuitud debe ser mayor a 3 y menor de 50.'
        ]
      }
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Nueva Categoria' : 'Editar Categoria'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  created () {
    console.log(this.$store.state.token)
    this.listar()
  },
  methods: {
    listar () {
      serviceCategoria.getAll().then(res => {
        this.categorias = res.data;
      }).catch(err => {
        console.error('Ha ocurrido un error. Detalles: ', err);
      });
    },

    editItem (item) {
      this.categoria = Object.assign({}, item);
      this.editedIndex = 1;
      this.dialog = true;
    },

    deleteItem (activate, item) {
      let accion = activate ? 'Desactivar' : 'Activar';
      let msg = `¿Esta seguro que quieres ${accion} la categoria ${item.nombre}?`; 
      let confirmar = confirm(msg);

      if (confirmar)
        serviceCategoria.putEstado(item.idCategoria).then(res => {
          this.listar();
        }).catch(err => {
          console.error('Ha ocurrido un error al intentar actualizar el estado. ', err);
        });
    },

    close () {
      this.dialog = false;
      this.reset();
      this.limpiar();
    },

    reset () {
      this.$refs.form.reset();
    },

    limpiar () {
      Object.assign(this.categoria, {});
      this.editedIndex = -1;
    },

    save () {
      serviceCategoria.post({
        nombre: this.categoria.nombre,
        descripcion: this.categoria.descripcion
      }).then(res => {
        this.listar();
        this.close();
      }).catch(err => {
        console.error('Ha ocurrio un error al guardar.', err);
      });
    },

    update () {
      serviceCategoria.put(this.categoria).then(res => {
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
        this.update();
      } else {
        this.save();
      }
    }
  }
}
</script>
