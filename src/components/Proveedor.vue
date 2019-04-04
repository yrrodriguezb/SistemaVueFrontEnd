<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title class="blue--text">Proveedores</v-toolbar-title>
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
                    <v-text-field v-model="proveedor.nombre" label="Nombre"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-select v-model="proveedor.tipo_Documento" :items="documentos" label="Tipo Documento"></v-select>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="proveedor.num_Documento" label="Número Documento"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field v-model="proveedor.direccion" label="Dirección"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                      <v-text-field v-model="proveedor.telefono" label="Teléfono"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                      <v-text-field v-model="proveedor.email" label="Email"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
  
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
              <v-btn color="blue darken-1" flat :disabled="!valid" @click="guardar">Guardar</v-btn>
            </v-card-actions>
          </v-card>
          </v-form>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="proveedores"
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
          </td>
          <td>{{ props.item.nombre }}</td>
          <td>{{ props.item.tipo_Persona }}</td>
          <td>{{ props.item.tipo_Documento }}</td>
          <td>{{ props.item.num_Documento }}</td>
          <td>{{ props.item.direccion }}</td>
          <td>{{ props.item.telefono }}</td>
          <td>{{ props.item.email }}</td>
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
import { servicePersona } from "../services";

export default {
  data(){
    return {
      dialog: false,
      valid: true,
      proveedores: [],
      headers: [
        { text: 'Opciones', value: 'opciones', sortable: false },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Tipo Persona', value: 'tipo_persona' },
        { text: 'Tipo Documento', value: 'tipo_documento' },
        { text: 'Número Documento', value: 'num_documento', sortable: false  },
        { text: 'Dirección', value: 'direccion', sortable: false  },
        { text: 'Teléfono', value: 'telefono', sortable: false  },
        { text: 'Email', value: 'email', sortable: false  }
      ],
      search: '',
      editedIndex: -1,
      proveedor: {
        idPersona: 0,
        nombre:'',
        tipo_Documento: '',
        num_Documento: '',
        tipo_Persona: '',
        direccion: '',
        telefono: '',
        email: ''
      },
      documentos: ['DNI','RUC','PASAPORTE','CEDULA'],
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
      return this.editedIndex === -1 ? 'Nuevo Proveedor' : 'Editar Proveedor'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  created () {
    this.listar()
  },
  methods: {
    listar () {
      servicePersona.getProveedores().then(res => {
        this.proveedores = res.data;
      }).catch(err => {
        console.error('Ha ocurrido un error. Detalles: ', err);
      });
    },

    editItem (item) {
      this.proveedor = Object.assign({}, item);
      this.editedIndex = 1;
      this.dialog = true;
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
      Object.assign(this.proveedor, {});
      this.editedIndex = -1;
    },

    save () {
      this.proveedor.tipo_Persona = 'Proveedor';
      servicePersona.post(this.proveedor).then(res => {
        this.listar();
        this.close();
      }).catch(err => {
        console.error('Ha ocurrio un error al guardar.', err);
      });
    },

    update () {
      servicePersona.put(this.proveedor).then(res => {
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
