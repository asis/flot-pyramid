describe("flot.pyramid", function() {
  var testData = [
    { label: 'M', data: [['0-10', 20], ['10-20', 26], ['20-30', 45], ['30-40', 23],['40+', 10]] },
    { label: 'W', data: [['0-10', 21], ['10-20', 22], ['20-30', 20], ['30-40', 27],['40+', 30]], pyramid: { direction: 'L' } }
  ];

  var testOptions = { series: { pyramid: { show: true } } };

  var plot, options;
  var labels = testData[0].data.map(function(e){return e[0]});
  var testDataClone = $.extend(true, [], testData);

  function plotData(data, plotOptions, container_id) {
    container_id = container_id || 'test';

    var container = $('<div id="' + container_id + '" style="width:600px;height:300px;"></div>')
    container.hide();
    $('body').append(container);

    plot = $.plot(container, data, plotOptions);
    options = plot.getOptions();

    return plot;
  }

  it("should register itself as a flot plugin", function() {
    var plugin = jQuery.plot.plugins[0];
    expect(plugin.name).toMatch('pyramid');
    expect(plugin.init).toBe(FlotPyramid.init);
    expect(plugin.version).toBeDefined();
  });

  describe("when plotting a pyramid chart", function() {
    beforeEach(function() {
      plotData(testData, testOptions);
    });

    it("should add bars config to the global plot options", function() {
      expect(options.series.bars).toBeDefined();
      expect(options.series.bars.horizontal).toBeTruthy();
      expect(options.series.bars.align).toMatch('center');
    });

    it("should add xaxis config to the global plot options", function() {
      expect(plot.getXAxes()[0]).toBeDefined();
    });

    it("should draw the plot without altering the original data", function() {
      expect($.param(testData)).toBe($.param(testDataClone));
    });

    it("should define a custom tickFormatter for the xaxis", function() {
      var formatter = plot.getXAxes()[0].tickFormatter;
      expect(formatter).toBeDefined();
      expect(formatter(1)).toBe('1');
      expect(formatter(0)).toBe('0');
      expect(formatter(-1)).toBe('1');
    });

    it("should add yaxis config to the global plot options", function() {
      expect(options.yaxes[0]).toBeDefined();
    });

    it("should define a custom tick array for the yaxis using the data labels", function() {
      var ticks = plot.getYAxes()[0].options.ticks.map(function(e){return e[1];});

      expect(ticks).toBeDefined();
      expect(ticks.toString()).toBe(labels.toString());
    });
  });

  it("should fail when plotting series with a different number of values", function() {
    var wrongTestData = $.extend(true, [], testData);
    wrongTestData[0].data.pop();

    expect(wrongTestData[0].data.length).toBeLessThan(wrongTestData[1].data.length);
    expect(function() { plotData(wrongTestData, testOptions, 'fail1') }).toThrow(FlotPyramid.InvalidData);
  });

  it("should fail when plotting series with a wrong direction specification", function() {
    var wrongTestData = $.extend(true, [], testData);
    wrongTestData[1].pyramid.direction = 'F';

    expect(function() { plotData(wrongTestData, testOptions, 'fail2') }).toThrow(FlotPyramid.InvalidDirection);
  });

  it("should preserve user defined bars width", function() {
    var customBarOptions = $.extend(true, { series: { pyramid: { barWidth: 0.1 } } }, testOptions);

    var plot = plotData(testData, customBarOptions, 'bars');
    var options =  plot.getOptions();
    expect(options.series.bars.barWidth).toBe(0.1);
  });

  it("should preserve user defined xaxis formatter", function() {
    var formatter = {
      format: function(v, axis) {
      }
    };
    spyOn(formatter, 'format').andCallThrough();

    var customBarOptions = $.extend(true, { xaxis: { tickFormatter: formatter.format } }, testOptions);
    plotData(testData, customBarOptions, 'bars');
    expect(formatter.format).toHaveBeenCalled();
  });
});

