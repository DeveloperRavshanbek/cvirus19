const select = document.querySelector('#select')
const chartArea = document.querySelector('#chart')
const BASE_URL = 'https://covid19.mathdro.id/api';

getData(BASE_URL, '', displayCases);
getData(BASE_URL, 'countries', displayCountries);

function getData(url = '', query = '', callback) {
    return fetch(`${url}/${query}`)
        .then(res => res.json())
        .then(data => {
            callback(data);
        })
}


select.addEventListener('change', function () {
    if (this.value === 'all') {
        getData(BASE_URL, '', displayCases);
    } else {
        getData(BASE_URL, `countries/${this.value}`,
            displayCases)
    }
})

function displayCountries(data) {
    data.countries.forEach(function (item) {
        const option = document.createElement('option');
        option.value = item.iso3;
        option.innerHTML = item.name;
        select.appendChild(option)
    })
}


function displayCases(data) {
    const cards = document.querySelectorAll('.cards .card');

    const { confirmed = 0, deaths = 0, recovered = 0 } = data;
    const time = (new Date).toLocaleDateString();

    new counterUp({
        selector: '.card:nth-child(1) h1',
        duration: 5000,
        start: 0,
        end: confirmed.value,
        append: '',
        prepend: '',
        intvalues: true
    }).start();

    new counterUp({
        selector: '.card:nth-child(2) h1',
        duration: 5000,
        start: 0,
        end: recovered.value,
        append: '',
        prepend: '',
        intvalues: true
    }).start();


    new counterUp({
        selector: '.card:nth-child(3) h1',
        duration: 5000,
        start: 0,
        end: deaths.value,
        append: '',
        prepend: '',
        intvalues: true
    }).start();

    cards.forEach(function (el) {
        el.querySelector('h2 span').innerHTML = time;
    })
    if (Object.keys(data).length) {
        displayChart(data)
    }
}

function displayChart(data) {
    var options = {
        series: [{
            name: 'Confirmed',
            data: [data.confirmed.value]
        }, {
            name: 'Recorved',
            data: [data.recovered.value]
        }, {
            name: 'Deaths',
            data: [data.deaths.value]
        }],
        chart: {
            type: 'bar',
            height: 500
        },
        plotoOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ["transparent"]
        },
        xaxis: {
            categories: ['Coronavirus Info'],
            color: ['#333']
        },
        yaxis: {
            title: {
                enabled: false,
                text: 'CoronaVirus Info'
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return '$ ' + val + ' thousand'
                }
            }
        }
    };
    chartArea.innerHTML = '';
    var chart = new ApexCharts(chartArea, options);
    chart.render();
}