var pyramid = (function(){
  var yaxisTicks = [],
      xaxisMin = 10,
      xaxisMax = 90;

  function computeTicks(data) {
    var i, len;
    for(i = 0, len = data.length; i < len; i += 1) {
      yaxisTicks.push([i, data[i][0]]);
    }
  }

  function allTicksPresent(data) {
    var i, len, labels, expected_labels;

    expected_labels = $.map(yaxisTicks, function(e) { return e[1] });
    labels = $.map(data, function(e) { return e[0] });

    for (i = 0, len = labels.length; i < len; i += 1) {
      if (expected_labels[i] != labels[i]) {
        return false;
      }
    }

    return true;
  }

  function sameTicksLength(data) {
    return yaxisTicks.length == data.length;
  }

  function checkTicks(data) {
    if (!sameTicksLength(data) || !allTicksPresent(data)) {
      throw('flot.pyramid: Invalid series for pyramid plot! The supplied data must have exactly the same labels!');
    }
  }

  function rewriteTicks(data) {
    var i = 0;

    for (var d in data) {
      data[d][0] = i;
      i += 1;
    }
  }

  function fixTicks(data) {
    if (yaxisTicks.length == 0) {
      computeTicks(data);
    } else {
      checkTicks(data);
    }

    rewriteTicks(data);
  }

  function xaxisTickFormatter(oldFormatter) {

    return function(val, axis) {
      var n = val < 0 ? -val: val;
      return oldFormatter ? oldFormatter(val, axis) : val;
    }
  }

  function formatSeries(series) {
    var tmp = [], arr = series.data, direction = series.pyramid.direction || 'R', mult;

    if (direction === 'R') {
      mult = 1;
    } else if (direction === 'L') {
      mult = -1;
    } else {
      throw("flot.pyramid: Invalid direction specified for pyramid series. Use 'L' for left or 'R' for right (default is 'R')");
    }

    for (var i=0, len = arr.length; i < len; i += 1) {
      tmp.push([arr[i][1] * mult, arr[i][0]]);
    }
    return tmp;
  }

  function fixXaxis(options, data) {
    var max,
        currentMax = options.xaxes[0].max || 0;

    function reduce(data, f) {
      return data.reduce(function(prev, current, index, array) {
        return f(prev, current);
      });
    }

    values = data.map(function(d){return d[1]});
    max = reduce(values, Math.max);

    options.xaxes[0].max = Math.max(max, currentMax);
    options.xaxes[0].min = -options.xaxes[0].max;
  }

  function processRawData(plot, series, datapoints) {
    fixTicks(series.data);
    fixXaxis(plot.getOptions(), series.data);

    series.data = formatSeries(series);
  }

  function processOptions(plot, options) {
    if (options.series.pyramid && options.series.pyramid.show) {
      $.extend(options.series.bars, {
        show: true,
        horizontal: true,
        barWidth: 0.3,
        align: 'center'
      });

      $.extend(options.xaxes[options.series.xaxis - 1 || 0], {
        tickFormatter: xaxisTickFormatter(options.xaxes[0].tickFormatter)
      });

      $.extend(options.yaxes[options.series.yaxis - 1 || 0], {
        ticks: yaxisTicks
      });

      plot.hooks.processRawData.push(processRawData);
    }
  }

  function init(plot) {
    plot.hooks.processOptions.push(processOptions);
  }

  return {
    init: init
  }
}());

(function ($) {
  $.plot.plugins.push({
      init: pyramid.init,
      name: "pyramid",
      version: "0.1"
  });
})(jQuery);
