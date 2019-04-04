<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Ventas</v-toolbar-title>
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
            @add-article="addDetailSale($event)"
          >
          </app-articulos>

          <app-factura
            :show="show_bill"
            :bill="bill"
            @closeDialogBill="closeDialogBill($event)"
          ></app-factura> 
        </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="ventas"
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
            <v-icon
              small
              class="mr-2"
              color="success"
              @click="verComprobante(props.item)"
            >
              print
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
          <td>{{ props.item.cliente }}</td>
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
              v-model="venta.tipo_comprobante"
              :items="comprobantes"
              label="Tipo Comprobante">
            </v-select>
          </v-flex>
          <v-flex xs12 sm4 md4 xl4>
            <v-text-field
              v-model="venta.serie_comprobante"
              label="Serie Comprobante">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm4 md4 xl4>
            <v-text-field
              v-model="venta.num_comprobante"
              label="Número Comprobante">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm8 md8 xl8>
            <v-select
              v-model="venta.IdCliente"
              :items="clientes"
              label="Clientes"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm4 md4 xl4>
            <v-text-field
              type="number"
              v-model="venta.impuesto"
              label="Impuesto">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm8 md8 xl8>
            <v-text-field
              v-model="venta.codigo"
              label="Codigo"
              :error-messages="messages.exists"
              @keyup.enter="buscarCodigoVenta">
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
                  <td>
                    <v-text-field
                      type="number"
                      min="0"
                      v-model="props.item.descuento"
                    ></v-text-field>
                  </td>
                  <td>{{ props.item.precio * props.item.cantidad - props.item.descuento }}</td>
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
  import jsPDF from "jspdf";
  import { servicePersona, serviceArticulo, serviceVenta } from "../services";
  import Articulos from "./Articulos.vue";
  import Factura from "./Factura.vue";

  export default {
    components: {
      'app-articulos': Articulos,
      'app-factura': Factura
    },
    data(){     
      return {
        valid: true,              
        dialog: false,
        show_form_add: false,
        show_articles: false,
        show_btn_save: true,
        show_bill: false,
        search: '',
        ventas:[],
        comprobantes: ['FACTURA', 'BOLETA', 'TICKET', 'GUIA'],
        clientes: [],
        detalles: [],
        articulos: [],
        bill: {},
        headers: [
          { text: 'Opciones', value: 'opciones', sortable: false },
          { text: 'Usuario', value: 'usuario' },
          { text: 'Cliente', value: 'cliente' },
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
          { text: 'Descuento', value: 'descuento', sortable: false  },
          { text: 'SubTotal', value: 'subtotal', sortable: false  }
        ],
        messages: {
          exists: null
        },
        search: '',
        editedIndex: -1,
        venta: {
          IdCliente: 0,
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
          return prev + ( (obj.precio * obj.cantidad) - obj.descuento )
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
      this.obtenerProveedores()
      this.listar();
    },

    methods:{
      listar () {
        serviceVenta.get().then(res => {
          this.ventas = res.data;
        }).catch(err => {
          console.log(err);
        });
      },

      listarDetalles (IdVenta) {
        serviceVenta.getDetailById(IdVenta).then(res => {
          this.detalles = res.data;
        }).catch(err => {
          console.log(err);
        });
      },

      verDetalles(item) {
        Object.assign(this.venta, item);
        this.listarDetalles(item.idVenta);
        this.show_form_add = true;
        this.show_btn_save = false;
      },

      listarVentas () {
        serviceArticulo.getLikeSale(this.search).then(res => {
          this.articulos = res.data;
        }).catch(err => {
          console.log(err);
        })
      },

      buscarCodigoVenta () {
        this.messages.exists = null;

        serviceArticulo.getByCodeSale(this.venta.codigo).then(res => {
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
          this.messages.exists = `No existe un articulo con el codigo ${this.venta.codigo}`;
        });
      },

      obtenerProveedores () {
        servicePersona.selectCliente().then(res => {
          this.clientes = res.data.map(p => {
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
        Object.assign(this.venta, {});
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

      closeDialogBill (data) {
        this.show_bill = data.show;
        this.bill = data.bill;
      },

      addDetailSale (data) {
        this.detalles.push({
          idArticulo: data.idArticulo,
          articulo: data.nombre,
          cantidad: 1,
          precio: data.precio_Venta,
          descuento: 0
        });
      },
      
      save () {
        this.venta.detalles = this.detalles;
        this.venta.IdUsuario = this.$store.state.usuario.idusuario;

        serviceVenta.post(this.venta).then(res => {
          this.show_form_add = false;
          this.listar();
          this.limpiar();
        }).catch(err => {
          console.log(err);
        })
      },

      anularItem (activate, item) {
        let msg = `¿Estas seguro que quieres anular el venta ${item.num_Comprobante}?`; 
        let confirmar = confirm(msg);

        if (confirmar) {
          serviceVenta.putAnular(item.idVenta).then(res => {
            this.listar();
          }).catch(err => {
            console.error('Ha ocurrido un error al intentar actualizar el estado. ', err);
          });
        }
      },

      verComprobante (item) {
        this.listarDetalles(item.idVenta);
        this.bill = item;
        this.bill.detalles = this.detalles;
        this.show_bill = true;
      }
    }        
  }
</script>