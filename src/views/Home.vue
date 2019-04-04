<template>
  <v-container grid-list-md>
    <v-layout wrap>
      <v-flex xs12 sm12 md12>
        <div>
          <canvas id="myChart"></canvas>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import Chart from "chart.js";
  import { serviceVenta } from "../services";

  export default {

    data () {
      return {
        ventas: [],
        meses: [],
        total: []
      }
    },

    methods: {
      inicializar () {

        this.meses = this.ventas.map((v) => {
          return v.Etiqueta
        })

        this.total = this.ventas.map((v) => {
          return v.Valor
        })

        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: this.meses,
            datasets: [
              {
                label: '# of Votes',
                data: this.total,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
              }
            ]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });
      },

      getData () {
        serviceVenta.getSalesLast12Month().then(res => {
          this.ventas = res.data;
          this.inicializar();
        }).catch(err => {
          console.log(err);
        })
      }
    },

    mounted () {
      this.getData();
    }

  }
</script>
