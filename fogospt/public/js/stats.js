$(document).ready(function () {
    const messaging = firebase.messaging();

    messaging.onMessage(function(payload) {
        toastr.warning(payload.notification.body);
    });


    plot();
    plotWeekStats();
    plotStats8hours();
    plotStats8hoursYesterday();
    plotStatsYesterdayDistricts();
    plotStatsLastNight();
    plotStatsDistricts();

    plotStatsTotal();

    if (getParameterByName('phantom')) {
        $('.phantom-hide').hide();
    }
});

var dColors = {
    'Aveiro': '#e53935',
    'Beja': '#6200ea',
    'Braga': '#283593',
    'Bragança': '#2979ff',
    'Castelo Branco': '#29b6f6',
    'Coimbra': '#00bcd4',
    'Évora': '#00897b',
    'Faro': '#43a047',
    'Guarda': '#7cb342',
    'Leiria': '#eeff41',
    'Lisboa': '#ffd600',
    'Portalegre': '#ffab00',
    'Porto': '#ff9100',
    'Santarém': '#ff5722',
    'Setúbal': '#3e2723',
    'Viana do Castelo': '#424242',
    'Vila Real': '#455a64',
    'Viseu': '#90a4ae',
};

function plot() {
    var url = 'https://api-lb.fogos.pt/v1/now/data';
    $.ajax({
        url: url,
        method: 'GET',
        success: function (data) {
            data = JSON.parse(data);
            if (data.success && data.data.length) {
                labels = [];
                var man = [];
                var terrain = [];
                var aerial = [];
                var total = [];
                for (d in data.data) {
                    labels.push(data.data[d].label);
                    man.push(data.data[d].man);
                    terrain.push(data.data[d].cars);
                    aerial.push(data.data[d].aerial);
                    total.push(data.data[d].total);
                }

                var ctx = document.getElementById("myChart");
                var myLineChart = new Chart(ctx, {
                    type: 'line',
                    omitXLabels: true,
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Humanos',
                            data: man,
                            fill: false,
                            backgroundColor: '#EFC800',
                            borderColor: '#EFC800'
                        },
                            {
                                label: 'Terrestres',
                                data: terrain,
                                fill: false,
                                backgroundColor: '#6D720B',
                                borderColor: '#6D720B'
                            },
                            {
                                label: 'Aéreos',
                                data: aerial,
                                fill: false,
                                backgroundColor: '#4E88B2',
                                borderColor: '#4E88B2'
                            },
                            {
                                label: 'Incêndios ativos',
                                data: total,
                                fill: false,
                                backgroundColor: '#ff512f',
                                borderColor: '#ff512f'
                            }]
                    },
                    options: {
                        elements: {
                            line: {
                                tension: 0, // disables bezier curves
                                showXLabels: 5,
                            }
                        },
                        scales: {
                            xAxes: [{
                                ticks: {
                                    stepSize: 20
                                }
                            }]
                        }
                    }
                });
            } else {
                $('#info').find('canvas').remove();
                $('#info').append('<p>Não há dados disponiveis</p> ');
            }
        }
    });
}

function plotWeekStats() {
    var url = 'https://api-lb.fogos.pt/v1/stats/week';
    $.ajax({
        url: url,
        method: 'GET',
        success: function (data) {
            data = JSON.parse(data);
            if (data.success && data.data.length) {
                labels = [];
                var total = [];
                var falseFires = [];
                for (d in data.data) {
                    labels.push(data.data[d].label);
                    falseFires.push(data.data[d].false);
                    total.push(data.data[d].total);
                }

                var ctx = document.getElementById("myChartStatsWeek");
                var myLineChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Total',
                            data: total,
                            fill: false,
                            backgroundColor: '#f67e23',
                            borderColor: '#f67e23'
                        },
                            {
                                label: 'Falsos Alarmes',
                                data: falseFires,
                                fill: false,
                                backgroundColor: '#000000',
                                borderColor: '#000000'
                            },
                        ]
                    },
                    options: {
                        elements: {
                            line: {
                                tension: 0, // disables bezier curves
                                showXLabels: 5,
                            }
                        },
                        responsive: true,
                        scales: {
                            xAxes: [{
                                stacked: true,
                            }],
                            yAxes: [{
                                stacked: true
                            }]
                        }
                    }
                });
            } else {
                $('#info').find('canvas').remove();
                $('#info').append('<p>Não há dados disponiveis</p> ');
            }
        }
    });
}

function plotStats8hours() {
    var url = 'https://api-lb.fogos.pt/v1/stats/8hours';
    $.ajax({
        url: url,
        method: 'GET',
        success: function (data) {
            data = JSON.parse(data);
            if (data.success && data.data) {
                var labels = [];
                var total = [];

                for (d in data.data) {
                    labels.push(d);
                    total.push(data.data[d].total);
                }

                var ctx = document.getElementById("myChartStats8hours");
                var myLineChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Total',
                            data: total,
                            fill: false,
                            backgroundColor: '#f67e23',
                            borderColor: '#f67e23'
                        },
                        ]
                    },
                    options: {
                        elements: {
                            line: {
                                tension: 0, // disables bezier curves
                                showXLabels: 5,
                            }
                        },
                        responsive: true,
                        scales: {
                            xAxes: [{
                                stacked: true,
                            }],
                            yAxes: [{
                                stacked: true
                            }]
                        }
                    }
                });
            } else {
                $('#info').find('canvas').remove();
                $('#info').append('<p>Não há dados disponiveis</p> ');
            }
        }
    });
}

function plotStatsLastNight() {
    var url = 'https://api-lb.fogos.pt/v1/stats/last-night';

    $.ajax({
        url: url,
        method: 'GET',
        success: function (data) {
            data = JSON.parse(data);
            if (data.success && data.data) {
                var labels = [];
                var total = [];
                var colors = [];

                for (d in data.data.distritos) {
                    labels.push(d);
                    total.push(data.data.distritos[d]);
                    colors.push(dcolors[d]);
                }

                var ctx = document.getElementById("myChartStatsLastNight");
                var myLineChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Incêndios',
                            data: total,
                            backgroundColor: colors,
                        },
                        ]
                    },
                });

            } else {
                $('#info').find('canvas').remove();
                $('#info').append('<p>Não há dados disponiveis</p> ');
            }
        }
    });
}

function plotStats8hoursYesterday() {
    var url = 'https://api-lb.fogos.pt/v1/stats/8hours/yesterday';
    $.ajax({
        url: url,
        method: 'GET',
        success: function (data) {
            data = JSON.parse(data);
            if (data.success && data.data) {
                var labels = [];
                var total = [];

                for (d in data.data) {
                    labels.push(d);
                    total.push(data.data[d].total);
                }

                var ctx = document.getElementById("myChartStats8hoursYesterday");
                var myLineChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Total',
                            data: total,
                            fill: false,
                            backgroundColor: '#f67e23',
                            borderColor: '#f67e23'
                        },
                        ]
                    },
                    options: {
                        elements: {
                            line: {
                                tension: 0, // disables bezier curves
                                showXLabels: 5,
                            }
                        },
                        responsive: true,
                        scales: {
                            xAxes: [{
                                stacked: true,
                            }],
                            yAxes: [{
                                stacked: true
                            }]
                        }
                    }
                });
            } else {
                $('#info').find('canvas').remove();
                $('#info').append('<p>Não há dados disponiveis</p> ');
            }
        }
    });
}



function plotStatsTotal() {

    var values;

    var url = 'https://api-lb.fogos.pt/v1/stats/today';
    $.ajax({
        url: url,
        method: 'GET',
        success: function (data) {
            data = JSON.parse(data);
            if (data.success && data.data) {

                // control that shows state info on hover
                var info = L.control();

                info.onAdd = function(map) {
                    this._div = L.DomUtil.create('div', 'info');
                    this.update();
                    return this._div;
                };


                info.update = function(props, incendios) {
                        this._div.innerHTML = '<h6>Incêndios totais</h6>' + (props ?
                            '<b>' + props.name + '</b><br />' + incendios + ' incêndios</sup>' :
                            'Clique num distrito');
                };



                info.addTo(map);


                function getColor(d) {
                    return d > 40 ? '#BD0026' :
                        d > 20 ? '#E31A1C' :
                        d > 10 ? '#FC4E2A' :
                        d > 5 ? '#FD8D3C' :
                        d > 0 ? '#FEB24C' :
                        '#99ff66';
                }

                function style(feature) {


                    var incendios = '0';

                    if(data.data.distritos[feature.properties.name] != null){
                        incendios = data.data.distritos[feature.properties.name];
                    }


                    return {
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7,
                        fillColor: getColor(incendios)
                    };
                }

                function highlightFeature(e) {
                    var layer = e.target;

                    layer.setStyle({
                        weight: 5,
                        color: '#666',
                        dashArray: '',
                        fillOpacity: 0.7
                    });

                    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                        layer.bringToFront();
                    }


                    var incendios = '0';

                    if(data.data.distritos[layer.feature.properties.name] != null){
                        incendios = data.data.distritos[layer.feature.properties.name];
                    }

                    info.update(layer.feature.properties,incendios);
                }




                var geojson;

                function resetHighlight(e) {
                    geojson.resetStyle(e.target);
                    info.update();
                }


                function zoomToFeature(e) {
                    map.fitBounds(e.target.getBounds());
                }

                function onEachFeature(feature, layer) {
                    layer.on({
                        mouseover: highlightFeature,
                        mouseout: resetHighlight,
                        click: zoomToFeature
                    });
                }

                geojson = L.geoJson(distritos, {
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(map);




                var legend = L.control({
                    position: 'bottomright'
                });

                legend.onAdd = function(map) {

                    var div = L.DomUtil.create('div', 'info legend'),
                        grades = [0, 1, 5, 10, 20, 40],
                        labels = [],
                        from, to;

                    labels.push(
                            '<i style="background:' + getColor(from + 1) + '"></i> ' +
                            '0');
                    for (var i = 1; i < grades.length; i++) {
                        from = grades[i];
                        to = grades[i + 1];

                        labels.push(
                            '<i style="background:' + getColor(from + 1) + '"></i> ' +
                            from + (to ? '&ndash;' + to : '+'));
                    }

                    div.innerHTML = labels.join('<br>');
                    return div;
                };

                legend.addTo(map);



              }
            }
    });



    var map = L.map('mapid').setView([39.6, -7.9], 7);
    var normalLayer = L.tileLayer('https://api.mapbox.com/styles/v1/fogospt/cjgppvcdp00aa2spjclz9sjst/tiles/256/{z}/{x}/{y}@2x?access_token='+window.mapboxKey, {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: window.mapboxKey
    }).addTo(map)






}



function plotStatsYesterdayDistricts() {
    var url = 'https://api-lb.fogos.pt/v1/stats/yesterday';

    $.ajax({
        url: url,
        method: 'GET',
        success: function (data) {
            data = JSON.parse(data);
            if (data.success && data.data) {
                var labels = [];
                var total = [];
                var colors = [];

                for (d in data.data.distritos) {
                    labels.push(d);
                    total.push(data.data.distritos[d]);
                    colors.push(dcolors[d]);
                }

                var ctx = document.getElementById("myChartStatsYesterday");
                var myLineChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Total',
                            data: total,
                            backgroundColor: colors,
                        },
                        ]
                    },
                });

            } else {
                $('#info').find('canvas').remove();
                $('#info').append('<p>Não há dados disponiveis</p> ');
            }
        }
    });
}

function plotStatsDistricts() {
    var url = 'https://api-lb.fogos.pt/v1/stats/today';

    $.ajax({
        url: url,
        method: 'GET',
        success: function (data) {
            data = JSON.parse(data);
            if (data.success && data.data) {
                var labels = [];
                var total = [];
                var colors = [];

                for (d in data.data.distritos) {
                    labels.push(d);
                    total.push(data.data.distritos[d]);
                    colors.push(dcolors[d]);
                }

                var ctx = document.getElementById("myChartStatsToday");
                var myLineChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Total',
                            data: total,
                            backgroundColor: colors,
                        },
                        ]
                    },
                });

            } else {
                $('#info').find('canvas').remove();
                $('#info').append('<p>Não há dados disponiveis</p> ');
            }
        }
    });
}




function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
