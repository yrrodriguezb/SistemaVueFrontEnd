<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>
          Consulta Ventas
        </v-toolbar-title>

        <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>

        <v-spacer></v-spacer>
        
        <label >Desde</label>

        <v-text-field
          type="date"
          class="text-xs-center"
          v-model="FechaInicial" 
          label="Fecha Inicial" 
          single-line 
          hide-details
          hint="Fecha Inicial, Formato dd/mm/yyyy"
          persistent-hint
          >
        </v-text-field>

        <label>Hasta</label>

        <v-text-field
          type="date"
          class="text-xs-center"
          v-model="FechaFinal" 
          label="Fecha Final" 
          single-line 
          hide-details
          hint="Fecha Final, Formato dd/mm/yyyy"
          persistent-hint
        >
        </v-text-field>

        <v-btn @click="listar" color="primary">
          <v-icon>search</v-icon>
        </v-btn>

      </v-toolbar>

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

      <v-data-table
        :headers="headers"
        :items="ventas"
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
        FechaInicial: '',
        FechaFinal: '',
        show_form_add: false,
        show_articles: false,
        show_btn_save: true,
        show_bill: false,
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
        if (!this.FechaInicial || !this.FechaFinal){
          serviceVenta.get().then(res => {
            this.ventas = res.data;
          }).catch(err => {
            console.log(err);
          });
        } else {
          serviceVenta.getDate(this.FechaInicial, this.FechaFinal).then(res => {
            this.ventas = res.data;
          }).catch(err => {
            console.log(err);
          });
        }
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

      verComprobante (item) {
        this.listarDetalles(item.idVenta);
        this.bill = item;
        this.bill.detalles = this.detalles;
        this.show_bill = true;
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
      }
    }        
  }
</script>