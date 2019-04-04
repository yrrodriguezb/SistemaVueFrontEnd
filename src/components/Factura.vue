<template>
  <v-layout row justify-center>
    <v-dialog v-model="show_dialog" persistent max-width="1000px">
      <v-card>
        <v-card-text>
          <v-btn @click="crearPDF">
            <v-icon>print</v-icon>
          </v-btn>
          <v-btn  @click="close" class="text--white" >
            Cancelar
          </v-btn>
           <div id="factura">
              <header>
                <div id="logo">
                  <img 
                    src="data:image/png;base64,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" 
                    id="imagen"
                  />
                </div>
                <div id="datos">
                  <p id="encabezado">
                    <b>IncanatoIT</b><br>José Gálvez 1368, Chongoyape - Chiclayo, Perú<br>Telefono:(+51)931742904<br>Email:jcarlos.ad7@gmail.com
                  </p>
                </div>
                <div id="fact">
                  <p> 
                    {{ dataBill.num_Comprobante }}<br> 
                    {{ dataBill.serie_Comprobante }}<br>
                    {{ dataBill.fecha_Hora }}    
                  </p>
                </div>
              </header>
              <br>
              <section>
                <div>
                  <table id="facliente">
                    <tbody>
                      <tr>
                        <td id="cliente">
                          <strong>Sr(a). {{ dataBill.cliente }} </strong><br>
                          <strong>Documento:</strong> {{ dataBill.num_Documento }}<br>
                          <strong>Dirección:</strong> {{ dataBill.direccion }}<br>
                          <strong>Teléfono:</strong> {{ dataBill.telefono }}<br>
                          <strong>Email:</strong> {{ dataBill.email }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
              <br>
              <section>
                <div>
                  <table id="facarticulo">
                    <thead>
                      <tr id="fa">
                        <th>CANT</th>
                        <th>DESCRIPCION</th>
                        <th>PRECIO UNIT</th>
                        <th>DESC.</th>
                        <th>PRECIO TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="det in dataBill.detalles" :key="det.idDetalles_Venta" >
                        <td style="text-align:center;">{{ det.cantidad }}</td>
                        <td>{{ det.articulo }}</td>
                        <td style="text-align:right;">{{ det.precio.toFixed(2) }}</td>
                        <td style="text-align:right;">{{ det.descuento.toFixed(2) }}</td>
                        <td style="text-align:right;">{{ (det.precio - det.descuento).toFixed(2) }}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th style="text-align:right;">SubTotal</th>
                        <th style="text-align:right;">$ {{ subTotal }}</th>
                      </tr>
                      <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th style="text-align:right;">Iva {{ dataBill.impuesto }}%</th>
                        <th style="text-align:right;">$ {{ totalImpuesto }}</th>
                      </tr>
                      <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th style="text-align:right;">Total</th>
                        <th style="text-align:right;">$ {{ total }}</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </section>
              <br>
              <br>
              <footer>
                <div id="gracias">
                  <p><b>Gracias por su compra!</b></p>
                </div>
              </footer>
            </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default {
  name: 'app-factura',

  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    bill: {
      type: Object,
      required: false
    }
  },

  data () {
    return {
      show_bill: false,
      data_bill: {}
    }
  },


  computed: {
    show_dialog: {
      get: function () {
        return this.show;
      },
      set: function (value) {
        this.show_bill = value;
      }
    },
    dataBill: {
      get: function () {
        return this.bill;
      },
      set: function (value) {
        this.data_bill = value;
      }
    },
    subTotal: function () {
      if (!this.dataBill.detalles)
        return 0;

      return this.dataBill.detalles.reduce((ant, obj) => {
        return ant + obj.precio;
      }, 0);
    },
    totalImpuesto: function () {
      if (!this.dataBill.impuesto)
        return 0;

      return  parseFloat(((this.subTotal * this.dataBill.impuesto) / 100).toFixed(2))
    },
    total: function () {
      return this.subTotal + this.totalImpuesto;
    }
  },

  methods: {
    crearPDF () {
      let elem = document.getElementById('factura');

      html2canvas(elem).then((canvas) => {
        let img = canvas.toDataURL('image/png');
        let imgWidth = 210;
        let pageHeight = 295;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let doc = new jsPDF('p', 'mm', 'a4');
        let position = 0;

        doc.addImage(img, 'png', 0, position, imgWidth, imgHeight);
        doc.save('Comprobante Venta.pdf');
      });
    },

    close () {
      this.show_dialog = false;
      this.dataBill = {};
      this.$emit('closeDialogBill', {
        show: this.show_bill,
        bill: this.data_bill
      });
    }
  }
}
</script>
<style scoped>
 
  header {
    display: flex;
    justify-content: space-between;
  }

  #factura {
    padding: 20px;
    font-family: Arial, sans-serif;
    font-size: 16px ;
  }
;
  #logo {
    float: left;
    margin-left: 2%;
    margin-right: 2%;
  }
  #imagen {
    width: 100px;
  }

  #fact {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }   

  #datos {
    float: left;
    margin-top: 0%;
    margin-left: 2%;
    margin-right: 2%;
    /*text-align: justify;*/
  }

  #encabezado {
    text-align: center;
    margin-left: 10px;
    margin-right: 10px;
    font-size: 16px;
  }

  section {
    clear: left;
  }

  #cliente {
    text-align: left;
  }

  #facliente {
    width: 40%;
    border-collapse: collapse;
    border-spacing: 0;
    margin-bottom: 15px;
  }

  #fa {
    color: #FFFFFF;
    font-size: 14px;
  }

  #facarticulo {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    padding: 20px;
    margin-bottom: 15px;
  }

  #facarticulo thead {
    padding: 20px;
    background: #2183E3;
    text-align: center;
    border-bottom: 1px solid #FFFFFF;
  }

  #gracias {
    text-align: center;
  }
</style>
