import { style } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  dataSource: any[];
  sizeChartOptions: any;
  validationChartOptions: any;
  sectorChartOptions: any;

  constructor(private companyService: CompanyService, private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.fetchCompanies();
  }

  fetchCompanies(): void {
    this.companyService.getCompanies().subscribe(
      (data) => {
        this.dataSource = data;
        console.log('Data:', this.dataSource);

        this.createSizeChart();
        this.createValidationChart();
        this.createSectorChart();

        const totalCompanies = this.dataSource.length;
        const usersCountElement = document.querySelector('.users-count');
        if (usersCountElement) {
          usersCountElement.textContent = totalCompanies.toString();
        }
      },
      (error) => {
        console.error('Error fetching companies:', error);
      }
    );
  }



  createSizeChart(): void {
    const categories: string[] = [];
    const sizes: number[] = [];

    this.dataSource.forEach(company => {
      categories.push(company.companyName);
      sizes.push(company.size);
    });

    this.sizeChartOptions = {
      series: [
        {
          name: 'Company Sizes',
          data: sizes
        }
      ],
      chart: {
        type: 'bar',
        height: 250,

      },
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: categories
      },
      yaxis: {
        labels: {
          formatter: (value: number) => {
            return value.toFixed(0);
          }
        }
      },
      colors: [ '#00095E']
    };
  }

  createValidationChart(): void {
    const validatedCount = this.dataSource.filter(item => item.validate).length;
    const invalidCount = this.dataSource.filter(item => !item.validate).length;

    this.validationChartOptions = {
      series: [validatedCount, invalidCount],
      chart: {
        type: 'pie'
      },
      labels: ['Validé', 'Non validé'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 350,
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ],
      colors: ['#00095E','#facc15' ]
    };
  }

  createSectorChart(): void {
    if (!this.dataSource || this.dataSource.length === 0) {
        console.error('No data available for sector chart.');
        return;
    }

    const sectorChartData: number[] = [];
    const sectorChartCategories: string[] = [];
    const sectorCounts: { [key: string]: number } = {};

    let totalCompanies = 0;

    this.dataSource.forEach(company => {
        const sector = company.sector;
        if (!sectorChartCategories.includes(sector)) {
            sectorChartCategories.push(sector);
        }
        if (sectorCounts[sector]) {
            sectorCounts[sector]++;
        } else {
            sectorCounts[sector] = 1;
        }
        totalCompanies++;
    });

    const sectorPercentages: number[] = [];
    sectorChartCategories.forEach(sector => {
        const percentage = (sectorCounts[sector] / totalCompanies) * 100;
        sectorPercentages.push(percentage);
    });

    sectorChartData.push(...sectorPercentages);

    this.sectorChartOptions = {
        series: [{
            name: 'Pourcentage du nombre d\'entreprises',
            data: sectorChartData
        }],
        chart: {
            height: 140,
            type: 'bar'
        },
        plotOptions: {
            bar: {
                horizontal: false,
                dataLabels: {
                    position: 'top'
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: (val: number) => {
                return val.toFixed(2) + '%';
            },
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ["#00095E"]
            }
        },
        xaxis: {
            categories: sectorChartCategories,
            position: 'top',
            labels: {
                offsetY: -18,
                style: {
                    fontSize: '12px',
                    colors: ["#00095E"]
                }
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            crosshairs: {
                fill: {
                    type: "gradient",
                    gradient: {
                        colorFrom: "#D8E3F0",
                        colorTo: "#BED1E6",
                        stops: [0, 100],
                        opacityFrom: 0.4,
                        opacityTo: 0.5
                    }
                }
            },
            tooltip: {
                enabled: true,
                offsetY: -35
            }
        },
        fill: {
            type: "gradient",
            gradient: {
                shade: "light",
                type: "horizontal",
                shadeIntensity: 0.25,
                gradientToColors: undefined,
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [50, 0, 100, 100]
            }
        },
        yaxis: {
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            labels: {
                show: false
            }
        },
        title: {
            text: "Secteurs des entreprises ",
            floating: 0,
            offsetY: 320,
            align: "center",
            style: {
                color: "#00095E",

            },
            margin:10
        },
        colors: ['#00095E']
    };
}




}




