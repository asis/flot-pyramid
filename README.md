flot.pyramid
============

This is a pugin for drawing [population pyramids](http://en.wikipedia.org/wiki/Population_pyramid) with [flot](http://code.google.com/p/flot/).

This is a very simple (too simple, I fear) approach to population pyramid plotting, but it works for me. It uses horizontal bars and does some data preprocessing in order to extract the Y axis labels and flip one of the series, so it is drawn in the negative region of the X axis. The labels in the X axis are formatted so we do not get negative values.

**WARNING** the plugin has some basic tests which test (yeah, that is redundant) that the minimum requirements are met (i.e. to plot a horizontal, side-by-side bar graph, with the right X and Y axis tick labels), but the integration with other flot plugins and/or with some of the generic flot options **still has to be tested**. Cuidadín, pues.

Step by step explanation
------------------------

Supose you want to plot the two following (fictional and meaningless) data using a population pyramid wich shows the men data against the women data:

<table>
  <thead>
    <tr>
      <th>Age group</th><th>Men</th><th>Women</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0-20</th><td>1000</td><td>900</td>
    </tr>
    <tr>
      <th>20-40</th><td>300</td><td>1150</td>
    </tr>
    <tr>
      <th>40+</th><td>200</td><td>1000</td>
    </tr>
  </tbody>
</table>

The `flot.pyramid` plugin will process the data as follows (given we want to plot the bars representing women values to the left):

1.  Extract the data labels (`0-20`, `20-40`, and `40+`) and use them as
    the Y axis tick labels
2.  Add a custom X axis formatter, so the negative values are shown as
    positive
3.  Flip the women related data, so `flot` is actually plotting `-900`,
    `-1150`, and `-1000`. The original series data is left untouched.
    The "flip" only affects the datapoints used internally by `flot`.

And that's it!

Usage instructions
------------------

In order to use the plugin you need to download `src/jquery.flot.pyramid.js` and add a script tag to your page loading that file (remember that this is a `flot` plugin, so you will also need to add `jquery` and `flot` itself). The following code is extracted from the `example.html` file in this project:

    <script language="javascript" type="text/javascript" src="lib/jquery.min.js"></script>
    <script language="javascript" type="text/javascript" src="lib/flot/jquery.flot.js"></script>
    <script language="javascript" type="text/javascript" src="src/jquery.flot.pyramid.js"></script>

### Plot configuration options

You can pass flot the following configuration options when using the `pyramid` plugin:

* `series.pyramid`
  * `show`: when set to `true` it will activate the plugin... so do not forget it!
  * `barsWidth`: the width of each bar in the pyramid. Default is 0.6

In order to draw a population pyramid chart, call `plot` with the following configuration object:

    var flot_options = {
      series: {
        pyramid: {
          show: true,
          barsWidth: 0.5 // defaults to 0.1 if omitted
        }
      }
    };

    var series = { ... } // see below for info on series definition and configuration

    $.plot($('#pyramid_container'), series, flot_options);

### Data series configuration

#### Number of series

Currently, you can only plot two data series in the same graph. Plotting more than two series has not even been tested :P

#### Data groups labeling

You can use textual labels representing each of the groups the data is split in, providing an array of `label`, `value` pairs as the series data (see example below).

#### Bars direction

The plotting direction can be specified for each series. You can use `L`
or `W` for left (the "negative part of the X axis) and `R` or `E` for
right (the positive part. This is the default when you do not specify a direction).

#### Series configuration example

This code shows an example series data object:

    var flot_options = { ... } // see above for info on plot configuration options

    var series = [
      {
        label: 'Men', // the series label
        data: [ ['0-4',1302329], ['5-9',2328460], ['10-14',1090872], ['15-19',1158983], ... ]
      },
      {
        label: 'Women', // the series label
        data: [ ['0-4',1224757], ['5-9',1129454], ['10-14',1030163], ['15-19',1084773], ... ],
        pyramid: {
          direction: 'L' // Women bars will grow towards the left
        }
      }
    ];

    $.plot($('#pyramid_container'), series, flot_options);
