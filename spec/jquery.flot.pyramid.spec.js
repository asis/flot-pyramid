describe("flot.pyramid", function() {

  it("should register itself as a flot plugin", function() {
    var plugin = jQuery.plot.plugins[0];
    expect(plugin.name).toMatch('pyramid');
    expect(plugin.init).toBe(pyramid.init);
    expect(plugin.version).toBeDefined();
  });

  describe("when plotting a pyramid chart", function() {
    var testData = [
        {
          label: 'H',
          data: [['0-10', 20], ['10-20', 26], ['20-30', 45], ['30-40', 23],['40+', 10]]
        },
        {
          label: 'M',
          data: [['0-10', 21], ['10-20', 22], ['20-30', 20], ['30-40', 27],['40+', 30]],
          pyramid: {
            direction: 'L'
          }
        }
      ];

    var testOptions = {
      series: {
        pyramid: {
          show: true
        }
      }
    };

    var labels = testData[0].data.map(function(e){return e[0]});

    var plot, options;

    function plotData(data, plotOptions) {
      if (!plot) {
        var container = $('<div id="test" style="width:600px;height:300px;"></div>')
        container.hide();
        $('body').append(container);

        plot = $.plot(container, testData, testOptions);
        options = plot.getOptions();
      }
    }

    beforeEach(function() {
      plotData(testData, testOptions);

      this.addMatchers({
        toBeTheSameArrayAs: function(expected) {

          if (expected.length !== this.actual.length) return false;

          for(var i = 0, len = expected.length; i < len; i += 1) {
            if (expected[i] !== this.actual[i]) return false;
          }
          return true;
        }
      });
    });

    it("should add bars config to the global plot options if pyramid.show is true", function() {
      expect(options.series.bars).toBeDefined();
      expect(options.series.bars.horizontal).toBeTruthy();
      expect(options.series.bars.align).toMatch('center');
    });

    it("should add xaxis config to the global plot options", function() {
      expect(options.xaxes[0]).toBeDefined();
    });

    it("should define a custom tickFormatter for the xaxis", function() {
      var formatter = options.xaxes[0].tickFormatter;
      expect(formatter).toBeDefined();
      expect(formatter(1)).toBe(1);
      expect(formatter(0)).toBe(0);
      expect(formatter(-1)).toBe(1);
    });

    it("should add yaxis config to the global plot options", function() {
      expect(options.yaxes[0]).toBeDefined();
    });

    it("should define a custom tick array for the yaxis", function() {
      var ticks = plot.getYAxes()[0].options.ticks.map(function(e){return e[1];});

      expect(ticks).toBeDefined();
      expect(ticks).toBeTheSameArrayAs(labels);
    });
  });

});

