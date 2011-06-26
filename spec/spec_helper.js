var nextId = (function() {
  var id = 0;

  return (function() {
    id += 1;
    return "test" + id;
  });
})();

var testData = [
  { label: 'M', data: [['0-10', 20], ['10-20', 26], ['20-30', 45], ['30-40', 23],['40+', 10]] },
  { label: 'W', data: [['0-10', 21], ['10-20', 22], ['20-30', 20], ['30-40', 27],['40+', 30]], pyramid: { direction: 'L' } }
];

var testData2 = [
  { label: 'A', data: [['a', 10], ['b', 12], ['c', 5]], pyramid: { direction: 'L' } },
  { label: 'B', data: [['a', 6], ['b', 7], ['c', 9]] }
]

var testOptions = { series: { pyramid: { show: true } } };

var plot, options;
var labels = testData[0].data.map(function(e){return e[0]});
var testDataClone = $.extend(true, [], testData);

function plotData(data, plotOptions, container_id) {
  container_id = container_id || nextId();

  var container = $('<div id="' + container_id + '" style="width:600px;height:300px;"></div>')
  container.hide();
  $('body').append(container);

  plot = $.plot(container, data, plotOptions);
  options = plot.getOptions();

  return plot;
}
