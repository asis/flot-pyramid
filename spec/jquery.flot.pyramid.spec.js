describe("flot.pyramid", function() {

  it("should register itself as a flot plugin", function() {
    var plugin = jQuery.plot.plugins[0];
    expect(plugin.name).toMatch('pyramid');
    expect(plugin.init).toBe(FlotPyramid.init);
    expect(plugin.version).toBeDefined();
  });

  describe("when plotting a pyramid chart", function() {
    beforeEach(function() {
      this.addMatchers({
        toBeNegativeOrZero: function() {
          return this.actual.every(function(v) { return v <= 0; });
        }
      });

      plotData(testData, testOptions);
    });

    it("should not fail when plotting two different data sets", function() {
      var testData2 = [
        { label: 'L1', data: [['A', 10], ['B', 20]] },
        { label: 'L2', data: [['A', 20], ['B', 30]], pyramid: { direction: 'L' } }
      ];
      plotData(testData2, testOptions);
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

    it("should preserve user defined xaxis formatter", function() {
      var formatter = {
        format: function(v, axis) {
          return v + "!";
        }
      };
      spyOn(formatter, 'format').andCallThrough();

      var customBarOptions = $.extend(true, { xaxis: { tickFormatter: formatter.format } }, testOptions);
      plotData(testData, customBarOptions, 'bars');
      expect(formatter.format).toHaveBeenCalled();
    });

    it("should preserve user defined bars width", function() {
      var customBarOptions = $.extend(true, { series: { pyramid: { barWidth: 0.1 } } }, testOptions);

      var plot = plotData(testData, customBarOptions, 'bars');
      var options =  plot.getOptions();
      expect(options.series.bars.barWidth).toBe(0.1);
    });

    it("should throw FlotPyramid.InvalidData when series have a different number of values", function() {
      var wrongTestData = $.extend(true, [], testData);
      wrongTestData[0].data.pop();

      expect(wrongTestData[0].data.length).toBeLessThan(wrongTestData[1].data.length);
      expect(function() { plotData(wrongTestData, testOptions) }).toThrow(FlotPyramid.InvalidData);
    });

    it("should throw FlotPyramid.InvalidDirection when series have a wrong direction specification", function() {
      var wrongTestData = $.extend(true, [], testData);
      wrongTestData[1].pyramid.direction = 'F';

      expect(function() { plotData(wrongTestData, testOptions) }).toThrow(FlotPyramid.InvalidDirection);
    });

    it("should flip the data series marked with L or W", function() {
      var data = plot.getData();

      expect(data[1].pyramid.direction).toBe('L');

      // extract the datapoints relevant data OMG
      var datapoints = data[1].datapoints.points,
          size = data[1].datapoints.pointsize;
      var xDatapoints = [];

      for (var i = 0, len = datapoints.length; i < len; i += size) {
        xDatapoints.push(datapoints[i]);
      }

      expect(xDatapoints).toBeNegativeOrZero();
    });
  });
});

