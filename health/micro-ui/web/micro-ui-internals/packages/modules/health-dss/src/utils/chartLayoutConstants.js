// Shared fixed legend footer height (px) so bar charts and donut charts sitting
// side by side in the same dashboard row reserve identical vertical space for
// their legend, regardless of how many legend entries or how long their labels
// are. Keeping this identical across chart types is what keeps the plot area,
// gridlines/0-baseline and Brush aligned across mixed-chart-type rows.
export const CHART_LEGEND_HEIGHT = 46;
export const CHART_LEGEND_HEIGHT_DOWNLOAD = 86;

// Bar charts render at a fixed plot-area height. Donut charts register this same
// value into the "chart-plot-area" sync slot (via a hidden marker, since a bar
// chart's real height is already fixed and not worth measuring) so that when a
// donut and bar chart share a row, the donut centers within a matching height —
// but when a donut renders alone, no sibling registers this slot, so it keeps
// its own natural/auto height instead of reserving unused space.
export const CHART_PLOT_AREA_HEIGHT = 500;
