<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-btn @click="crearPDF">
          <v-icon>print</v-icon>
        </v-btn>
        <v-toolbar-title class="blue--text">Articulos</v-toolbar-title>
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
                    <v-flex xs6 sm6 md6>
                      <v-text-field v-model="articulo.codigo" label="Codigo" :rules="reglas.vacio" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                      <v-select v-model="articulo.idCategoria" :items="categorias" label="Categoria" :rules="reglas.numero_mayor_a_cero"></v-select>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                      <v-text-field type="number" min="0" v-model="articulo.stock" label="Stock" :rules="reglas.numero_mayor_a_cero" ></v-text-field>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                      <v-text-field type="number" min="0" v-model="articulo.precio_Venta" label="Precio Venta" :rules="reglas.numero_mayor_a_cero" ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                      <v-text-field v-model="articulo.nombre" label="Nombre" :rules="reglas.vacio" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                      <v-text-field v-model="articulo.descripcion" label="Descripción" :rules="reglas.vacio" clearable></v-text-field>
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
        :items="articulos"
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
          <td>{{ props.item.codigo }}</td>
          <td>{{ props.item.nombre }}</td>
          <td>{{ props.item.categoria }}</td>
          <td>{{ props.item.stock }}</td>
          <td>{{ props.item.precio_Venta }}</td>
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
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { serviceArticulo, serviceCategoria } from "../services";

export default {
  data(){
    return {
      dialog: false,
      valid: true,
      articulos: [],
      categorias: [],
      headers: [
        { text: 'Acción', value: 'opciones', sortable: false },
        { text: 'Código', value: 'codigo', },
        { text: 'Nombre', value: 'nombre', },
        { text: 'Categoria', value: 'categoria' },
        { text: 'Stock', value: 'stock', sortable: false },
        { text: 'Precio Venta', value: 'precio_Venta', sortable: false },
        { text: 'Descripcion', value: 'descripcion', sortable: false },
        { text: 'Estado', value: 'condicion', sortable: true }
      ],
      search: '',
      editedIndex: -1,
      articulo: {
        idArticulo: 0,
        idCategoria: 0,
        codigo: '',
        nombre: '',
        descripcion: '',
        stock: 0,
        precio_Venta: 0
      },
      reglas: {
        vacio: [
          v => !!v || 'Este campo es obligatorio',
          v => v && !(v.length < 3 || v.length > 50 ) || 'la longuitud debe ser mayor a 3 y menor de 50.'
        ],
        numero_mayor_a_cero: [
          v => v && v > 0 || 'Este campo debe ser mayor a  cero (0) y entero..',
        ]
      }
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Nueva Articulo' : 'Editar Articulo'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  created () {
    this.listar();
    this.listar_datos_select();
  },
  methods: {
    listar () {
      serviceArticulo.getAll().then(res => {
        this.articulos = res.data;
      }).catch(err => {
        console.err('Ha ocurrido un error. Detalles: ', err);
      });
    },

    listar_datos_select () {
      serviceCategoria.get().then(res => {
        this.categorias = res.data.map(c => { 
          return { text: c.nombre, value: c.idCategoria }
         });
      }).catch(err => {
        console.err('Ha ocurrido un error. Detalles: ', err);
      });
    },

    editItem (item) {
      this.articulo = Object.assign({}, item);
      this.editedIndex = 1;
      this.dialog = true;
    },

    deleteItem (activate, item) {
      let accion = activate ? 'Desactivar' : 'Activar';
      let msg = `¿Estas seguro que quieres ${accion} el articulo ${item.nombre}?`; 
      let confirmar = confirm(msg);

      if (confirmar)
        serviceArticulo.putEstado(item.idArticulo).then(res => {
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
      Object.assign(this.articulo, {});
      this.editedIndex = -1;
    },

    save () {
      serviceArticulo.post(this.articulo).then(res => {
        this.listar();
        this.close();
      }).catch(err => {
        console.error('Ha ocurrio un error al guardar.', err);
      });
    },

    update () {
      serviceArticulo.put(this.articulo).then(res => {
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
    },

    crearPDF () {
      console.log("aqui");
      

      var columns = [
        { title: 'Nombre', dataKey: 'nombre' },
        { title: 'Codigo', dataKey: 'codigo' },
        { title: 'Categoría', dataKey: 'categoria' },
        { title: 'Stock', dataKey: 'stock' },
        { title: 'Precio de Venta', dataKey: 'precio_Venta' }
      ];

      var rows = this.articulos.map((x) => {
        return { 
          nombre: x.nombre,
          codigo: x.codigo,
          categoria: x.categoria,
          stock: x.stock,
          precio_Venta: x.precio_Venta
         }
      });

      var doc = new jsPDF('p', 'pt')

      doc.autoTable(columns, rows, {
        margin: { top: 60 },
        addPageContent: function (data) {
          doc.text('Listado de Articulos', 40, 20)
        }
      });

      doc.save('Articulos.pdf');
    }
  }
}
</script>
