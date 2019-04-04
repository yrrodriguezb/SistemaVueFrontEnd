<template>
  <v-dialog v-model="show_articles" max-width="1000px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">Seleccione un articulo</span>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12 md12 lg12>
                <v-text-field
                  append-icon="search"
                  class="text-xs-center"
                  v-model="search"
                  :label="text"
                  @keyup.enter="listar"
                >
                </v-text-field>
                <template>
                  <v-data-table
                    :headers="headers"
                    :items="items"
                    class="elevation-1"
                  >
                    <template slot="items" slot-scope="props">
                      <td class="justify-center layout px-0">
                        <v-icon
                        small
                        class="mr-2"
                        color="success"
                        @click="addDetail(props.item)"
                        >
                        add
                        </v-icon>
                      </td>
                      <td>{{ props.item.nombre }}</td>
                      <td>{{ props.item.categoria }}<td>
                      <td>{{ props.item.descripcion }}</td>
                      <td>{{ props.item.stock }}</td>
                      <td>{{ props.item.precio_Venta }}</td>
                    </template>
                    <template slot="no-data">
                      <h3>No hay articulos para mostar.</h3>
                    </template>
                  </v-data-table>
                </template>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken" flat @click="close">Cancelar</v-btn>
        </v-card-actions>
      </v-card-title>
    </v-card>
  </v-dialog>
</template>
<script>
import { serviceArticulo } from "../services";

export default {
  name: 'articulos',

  props: {
    show: {
      default: false,
      type: Boolean,
      required: true,
      validator: function (value) {
        return typeof true == typeof value || 'error'
      }
    },
    text: {
      default: '',
      type: String,
      validator: function (value) {
        return typeof "" == typeof value;
      }
    }
  },

  computed: {
    show_articles: {
      get: function () {
        return this.show;
      },
      set: function (value) {
        this.show = value;
      }
    }
  },

  data () {
    return {
      search: '',
      items: [],
      headers: [
        { text: 'seleccionar', value: 'seleccionar', sortable: false },
        { text: 'Articulo', value: 'articulo' },
        { text: 'Categoria', value: 'categoria' },
        { text: 'Descripción', value: 'descripcion', sortable: false },
        { text: 'Stock', value: 'stock', sortable: false },
        { text: 'Precio Venta', value: 'precio_Venta', sortable: false },
      ]
    }
  },

  methods:{
    listar () {
      let str = this.search.trim();
      if (str == "") 
        return;

      serviceArticulo.getLike(this.search).then(res => {
        this.items = res.data;
      }).catch(err => {
        console.log(err);
      })
    },

    close () {
      this.show = false;
      this.$emit('closedialog', this.show_articles);
    },

    addDetail (item) {
      this.$emit('add-article', item);
    }
  }
}
</script>
