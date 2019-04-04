<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Ingresos</v-toolbar-title>
          <v-divider
            class="mx-2"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-text-field v-if="!show_form_add" class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
          <v-spacer></v-spacer>
          <v-btn v-if="!show_form_add" color="success" dark class="mb-2" @click="show_form_add = true">Nuevo</v-btn>

          <app-articulos 
            :show="show_articles"
            text="Seleccione un articulo"
            :items="articulos"
            @closedialog="closedialog($event)"
            @add-article="addArtile($event)"
          >
          </app-articulos>

        </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="ingresos"
        :search="search"
        class="elevation-1"
        v-if="!show_form_add"
      >
        <template slot="items" slot-scope="props">
          <td class="justify-center layout px-0">
            <v-icon
            small
            class="mr-2"
            color="warning"
            @click="verDetalles(props.item)"
            >
            tab
            </v-icon>
            <template v-if="props.item.estado == 'Aceptado'">
                <v-icon 
                  color="red"
                  small
                  @click="anularItem(true, props.item)"
                >
                block
                </v-icon>
            </template>
          </td>
          <td>{{ props.item.usuario }}</td>
          <td>{{ props.item.proveedor }}</td>
          <td>{{ props.item.tipo_Comprobante }}</td>
          <td>{{ props.item.serie_Comprobante }}</td>
          <td>{{ props.item.num_Comprobante }}</td>
          <td>{{ props.item.fecha_Hora }}</td>
          <td>{{ props.item.impuesto }}</td>
          <td>{{ props.item.total }}</td>
          <td>
            <div v-if="props.item.estado == 'Aceptado'">
                <span class="blue--text">Aceptado</span>
            </div>
            <div v-else>
                <span class="red--text">{{ props.item.estado }}</span>
            </div>
          </td>
        </template>
        <template slot="no-data">
          <v-btn color="primary" @click="listar">Resetear</v-btn>
        </template>
      </v-data-table>
      <v-container v-if="show_form_add" grid-list-sm class="pa-4 white">
        <v-layout row wrap>
          <v-flex xs12 sm4 md4 xl4>
            <v-select 
              v-model="ingreso.tipo_comprobante"
              :items="comprobantes"
              label="Tipo Comprobante">
            </v-select>
          </v-flex>
          <v-flex xs12 sm4 md4 xl4>
            <v-text-field
              v-model="ingreso.serie_comprobante"
              label="Serie Comprobante">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm4 md4 xl4>
            <v-text-field
              v-model="ingreso.num_comprobante"
              label="Número Comprobante">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm8 md8 xl8>
            <v-select
              v-model="ingreso.IdProveedor"
              :items="proveedores"
              label="Proveedores"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm4 md4 xl4>
            <v-text-field
              type="number"
              v-model="ingreso.impuesto"
              label="Impuesto">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm8 md8 xl8>
            <v-text-field
              v-model="ingreso.codigo"
              label="Codigo"
              :error-messages="messages.exists"
              @keyup.enter="buscarCodigo">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm2 md2 xl2>
            <v-btn small fab  dark color="teal">
              <v-icon @click="show_articles = true">list</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm12 md12 xl12>
             <v-data-table
                :headers="headersDet"
                :items="detalles"
                hide-actions
                class="elevation-1"
              >
                <template slot="items" slot-scope="props">
                  <td class="justify-center layout px-0">
                    <v-icon
                    small
                    class="mr-2"
                    color="error"
                    @click="deleteDetail(props.index)"
                    >
                    delete
                    </v-icon>
                  </td>
                  <td>{{ props.item.articulo }}</td>
                  <td>
                    <v-text-field 
                      type="number" 
                      min="0" 
                      v-model="props.item.cantidad"
                    ></v-text-field></td>
                  <td>
                    <v-text-field
                      type="number"
                      min="0"
                      v-model="props.item.precio"
                    ></v-text-field>
                  </td>
                  <td>{{ props.item.precio * props.item.cantidad }}</td>
                </template>
                <template slot="no-data">
                  <h3>No hay articulos agregados al detalles.</h3>
                </template>
              </v-data-table>
              <v-flex class="text-xs-right">
                <strong>Total Parcial</strong> ${{ total }}
              </v-flex>
              <v-flex class="text-xs-right">
                <strong>Total Impuesto</strong> ${{ impuesto }}
              </v-flex>
              <v-flex class="text-xs-right">
                <strong>Total Neto</strong> ${{ neto }}
              </v-flex>
          </v-flex>
          <v-flex xs12 sm12 md12 xl12>
            <v-divider class="mt-3"></v-divider>
            <v-btn color="blue darken-1" flat @click="show_form_add = false, show_btn_save = true">Cancelar</v-btn>
            <v-btn color="success" v-show="show_btn_save" flat @click="save">Guardar</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>
<script>
  import axios from 'axios';
  import { serviceIngreso, servicePersona, serviceArticulo } from "../services";
  import Articulos from "./Articulos.vue";

  export default {
    components: {
      'app-articulos': Articulos
    },
    data(){     
      return {
        valid: true,              
        dialog: false,
        show_form_add: false,
        show_articles: false,
        show_btn_save: true,
        search: '',
        ingresos:[],
        comprobantes: ['FACTURA', 'BOLETA', 'TICKET', 'GUIA'],
        proveedores: [],
        detalles: [],
        articulos: [],
        headers: [
          { text: 'Opciones', value: 'opciones', sortable: false },
          { text: 'Usuario', value: 'usuario' },
          { text: 'Proveedor', value: 'proveedor' },
          { text: 'Tipo Comprobante', value: 'tipo_Comprobante' },
          { text: 'Serie Comprobante', value: 'serie_Comprobante', sortable: false  },
          { text: 'Numero Comprobante', value: 'num_Comprobante', sortable: false  },
          { text: 'Fecha', value: 'fecha_Hora', sortable: false  },
          { text: 'Impuesto', value: 'impuesto', sortable: false  },
          { text: 'Total', value: 'total', sortable: false  },
          { text: 'Estado', value: 'estado', sortable: false  }
        ],
        headersDet: [
          { text: 'Borrar', value: 'borrar', sortable: false },
          { text: 'Articulo', value: 'articulo', sortable: false },
          { text: 'Cantidad', value: 'cantidad', sortable: false  },
          { text: 'Precio', value: 'precio', sortable: false  },
          { text: 'SubTotal', value: 'subtotal', sortable: false  }
        ],
        messages: {
          exists: null
        },
        search: '',
        editedIndex: -1,
        ingreso: {
          IdProveedor: 0,
          IdUsuario: 0,
          tipo_comprobante: '',
          serie_comprobante: '',
          num_comprobante: '',
          total: 0,
          impuesto: 0,
          codigo: '',
          detalles: this.detalles
        },
        roles:[],
        documentos: ['DNI','RUC','PASAPORTE','CEDULA'],
      }
    },
    computed: {
      total: function () {
        return this.detalles.reduce((prev, obj) => {
          return prev + (obj.precio * obj.cantidad)
        }, 0);
      },
      impuesto: function () {
        return parseFloat(((this.total * 19.0) / 100.0).toFixed(2));
      },
      neto: function () {
        return parseFloat((this.total + this.impuesto).toFixed(2));
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
      console.log('Art...');
      
      this.obtenerProveedores()
      this.listar();
    },

    methods:{
      listar () {
        serviceIngreso.get().then(res => {
          this.ingresos = res.data;
        }).catch(err => {
          console.log(err);
        });
      },

      listarDetalles (IdIngreso) {
        serviceIngreso.getDetailById(IdIngreso).then(res => {
          this.detalles = res.data;
        }).catch(err => {
          console.log(err);
        });
      },

      verDetalles(item) {
        Object.assign(this.ingreso, item);
        this.listarDetalles(item.idIngreso);
        this.show_form_add = true;
        this.show_btn_save = false;
      },

      listarArticulos () {
        serviceArticulo.getLike(this.search).then(res => {
          this.articulos = res.data;
        }).catch(err => {
          console.log(err);
        })
      },

      buscarCodigo () {
        this.messages.exists = null;

        serviceArticulo.getByCodeEntry(this.ingreso.codigo).then(res => {
          let exists = this.detalles.some((value) => {
            return value.idArticulo == res.data.idArticulo
          })

          if (exists){
            this.messages.exists = 'El artiulo existe en los detalles.'
            return;
          }

          this.detalles.push({
            idArticulo: res.data.idArticulo,
            articulo: res.data.nombre,
            cantidad: 1,
            precio: res.data.precio_Venta
          });
        }).catch(err => {
          console.log(err);
          this.messages.exists = `No existe un articulo con el codigo ${this.ingreso.codigo}`;
        });
      },

      obtenerProveedores () {
        servicePersona.selectProveedor().then(res => {
          this.proveedores = res.data.map(p => {
            return { text: p.nombre, value: p.idPersona }
          });
        }).catch(err => {
          console.log(err)
        });
      },

      reset () {
        this.$refs.form.reset();
      },

      limpiar () {
        Object.assign(this.ingreso, {});
        this.show_btn_save = true;
        this.detalles = [];
        this.articulos = [];
      },

      deleteDetail (index) {
        this.detalles.splice(index, 1);
      },

      closedialog (data) {
        this.show_articles = data;
      },

      addArtile (data) {
        this.detalles.push({
          idArticulo: data.idArticulo,
          articulo: data.nombre,
          cantidad: 1,
          precio: data.precio_Venta
        });
      },
      
      save () {
        this.ingreso.detalles = this.detalles;
        this.ingreso.IdUsuario = this.$store.state.usuario.idusuario;

        serviceIngreso.post(this.ingreso).then(res => {
          this.show_form_add = false;
          this.listar();
          this.limpiar();
        }).catch(err => {
          console.log(err);
        })
      },

      anularItem (activate, item) {
      let msg = `¿Estas seguro que quieres anular el ingreso ${item.num_Comprobante}?`; 
      let confirmar = confirm(msg);

      if (confirmar)
        serviceIngreso.putAnular(item.idIngreso).then(res => {
          this.listar();
        }).catch(err => {
          console.error('Ha ocurrido un error al intentar actualizar el estado. ', err);
        });
    },
    }        
  }
</script>