<script lang="ts">
  import dataset from '../data/youtube-trending-enriched.json';

  type MetricKey = 'views' | 'likes' | 'dislikes' | 'comment_count';
  type Video = {
    title: string;
    channel_title: string;
    views: number;
    likes: number;
    dislikes: number;
    comment_count: number;
    video_url: string;
    channel_url: string;
  };
  type ChartMetric = { key: MetricKey; label: string; shortLabel: string; color: string; description: string };
  type Point = { rank: number; value: number; x: number; y: number };

  const videos = dataset as Video[];
  const chartMetrics: ChartMetric[] = [
    { key: 'views', label: 'Views', shortLabel: 'views', color: '#1e66f5', description: 'total plays' },
    { key: 'likes', label: 'Likes', shortLabel: 'likes', color: '#40a02b', description: 'positive reactions' },
    { key: 'dislikes', label: 'Dislikes', shortLabel: 'dislikes', color: '#d20f39', description: 'negative reactions' },
    { key: 'comment_count', label: 'Comments', shortLabel: 'comments', color: '#df8e1d', description: 'conversation starters' },
  ];
  const scopes = [
    { value: 10, label: 'Top 10' },
    { value: 100, label: 'Top 100' },
    { value: 1000, label: 'Top 1,000' },
    { value: 5000, label: 'Top 5,000' },
  ];
  const ranked: Record<MetricKey, Video[]> = {
    views: [...videos].sort((a, b) => b.views - a.views),
    likes: [...videos].sort((a, b) => b.likes - a.likes),
    dislikes: [...videos].sort((a, b) => b.dislikes - a.dislikes),
    comment_count: [...videos].sort((a, b) => b.comment_count - a.comment_count),
  };
  const chartWidth = 800;
  const chartHeight = 270;
  const plot = { left: 54, right: 18, top: 20, bottom: 37 };
  const plotWidth = chartWidth - plot.left - plot.right;
  const plotHeight = chartHeight - plot.top - plot.bottom;

  let selectedScope = $state(100);
  let logScale = $state(true);
  let focusRank = $state(1);
  let hoveredRank = $state<number | null>(null);
  let hoveredMetric = $state<MetricKey | null>(null);
  let selectedMetric = $state<MetricKey>('views');

  let activeRank = $derived(hoveredRank ?? focusRank);
  let activeMetric = $derived(hoveredMetric ?? selectedMetric);
  let activeChartMetric = $derived(chartMetrics.find((metric) => metric.key === activeMetric) ?? chartMetrics[0]);
  let activeVideo = $derived(ranked[activeMetric][Math.min(activeRank, selectedScope) - 1]);

  function formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
  }

  function fullNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  function metricValue(video: Video, metric: MetricKey): number {
    return video[metric];
  }

  function xForRank(rank: number, scope = selectedScope): number {
    const normalized = logScale
      ? Math.log10(Math.max(rank, 1)) / Math.log10(Math.max(scope, 1))
      : (rank - 1) / Math.max(scope - 1, 1);
    return plot.left + normalized * plotWidth;
  }

  function xTicks(): { value: number; x: number; label: string }[] {
    if (!logScale) {
      return [1, selectedScope].map((value) => ({ value, x: xForRank(value), label: value.toLocaleString('en-US') }));
    }

    const values = [1];
    for (let power = 10; power < selectedScope; power *= 10) values.push(power);
    if (values.at(-1) !== selectedScope) values.push(selectedScope);
    return values.map((value) => ({ value, x: xForRank(value), label: value.toLocaleString('en-US') }));
  }

  function positiveMinimum(metric: MetricKey): number {
    const limit = Math.min(selectedScope, ranked[metric].length);
    const positiveValues = ranked[metric].slice(0, limit).map((video) => metricValue(video, metric)).filter((value) => value > 0);
    return positiveValues.length > 0 ? Math.min(...positiveValues) : 1;
  }

  function yForValue(value: number, metric: MetricKey): number {
    const max = metricValue(ranked[metric][0], metric);
    const minimum = positiveMinimum(metric);
    const normalized = logScale
      ? (Math.log10(Math.max(value, minimum)) - Math.log10(minimum)) / (Math.log10(Math.max(max, minimum)) - Math.log10(minimum) || 1)
      : value / max;
    return plot.top + (1 - normalized) * plotHeight;
  }

  function yTicks(metric: MetricKey): { value: number; y: number; label: string }[] {
    const max = metricValue(ranked[metric][0], metric);
    if (!logScale) {
      return [0, .25, .5, .75, 1].map((fraction) => ({
        value: max * fraction,
        y: plot.top + (1 - fraction) * plotHeight,
        label: formatNumber(max * fraction),
      }));
    }

    const minimum = positiveMinimum(metric);
    const values = [minimum];
    for (let power = 10 ** Math.ceil(Math.log10(minimum)); power < max; power *= 10) {
      if (power > minimum) values.push(power);
    }
    if (values.at(-1) !== max) values.push(max);
    return values.reverse().map((value) => ({ value, y: yForValue(value, metric), label: formatNumber(value) }));
  }

  function sampledPoints(metric: MetricKey): Point[] {
    const limit = Math.min(selectedScope, ranked[metric].length);
    const step = Math.max(1, Math.ceil(limit / 180));
    const points: Point[] = [];
    for (let index = 0; index < limit; index += step) {
      const rank = index + 1;
      const value = metricValue(ranked[metric][index], metric);
      points.push({ rank, value, x: xForRank(rank), y: yForValue(value, metric) });
    }
    if (points.at(-1)?.rank !== limit) {
      const value = metricValue(ranked[metric][limit - 1], metric);
      points.push({ rank: limit, value, x: xForRank(limit), y: yForValue(value, metric) });
    }
    return points;
  }

  function inspect(metric: MetricKey, event: PointerEvent) {
    const svg = event.currentTarget as SVGElement;
    const bounds = svg.getBoundingClientRect();
    // Convert the cursor to viewBox coordinates first, then measure against the
    // plot area rather than the SVG's y-axis gutter.
    const viewBoxX = ((event.clientX - bounds.left) / bounds.width) * chartWidth;
    const ratio = Math.max(0, Math.min(1, (viewBoxX - plot.left) / plotWidth));
    const rank = logScale
      ? 10 ** (ratio * Math.log10(Math.max(selectedScope, 1)))
      : ratio * (selectedScope - 1) + 1;
    hoveredRank = Math.max(1, Math.min(selectedScope, Math.round(rank)));
    hoveredMetric = metric;
  }

  function setScope(value: number) {
    selectedScope = value;
    focusRank = Math.min(focusRank, value);
    hoveredRank = null;
    hoveredMetric = null;
  }

  function chooseMetric(metric: MetricKey) {
    selectedMetric = metric;
    hoveredMetric = null;
  }

  function metricStats(metric: MetricKey) {
    const rows = ranked[metric].slice(0, selectedScope);
    const total = rows.reduce((sum, row) => sum + metricValue(row, metric), 0);
    return { total, average: total / rows.length, leader: rows[0] };
  }
</script>

<svelte:head>
  <title>USTU-092 · Milestone 1 | Luke Henderson</title>
  <meta name="description" content="Interactive exploration of engagement metrics in trending YouTube videos." />
</svelte:head>

<main class="milestone-page">
  <header class="hero">
    <div class="eyebrow"><span class="eyebrow-dot"></span> USTU-092 / MILESTONE 1</div>
  </header>

  <section class="control-panel" aria-label="Chart controls">
    <div class="control-group metric-control">
      <p class="control-label">Graph</p>
      <div class="metric-controls" role="group" aria-label="Select graph">
        {#each chartMetrics as metric}
          <button class:active={selectedMetric === metric.key} style={`--metric-color: ${metric.color}`} type="button" onclick={() => chooseMetric(metric.key)}>{metric.label}</button>
        {/each}
      </div>
    </div>
    <div class="control-group scope-control">
      <p class="control-label">Ranking scope</p>
      <div class="scope-controls" role="group" aria-label="Select ranking scope">
        {#each scopes as scope}
          <button class:active={selectedScope === scope.value} type="button" onclick={() => setScope(scope.value)}>{scope.label}</button>
        {/each}
      </div>
    </div>
    <div class="scale-control">
      <p class="control-label">Scale</p>
      <button class="scale-toggle" class:active={logScale} type="button" onclick={() => logScale = !logScale} aria-pressed={logScale}>
        <span class="toggle-track"><span></span></span>
        {logScale ? 'Log-log' : 'Linear'} scale
      </button>
    </div>
  </section>

  <section class="chart-grid" aria-label={`${activeChartMetric.label} chart`}>
    <article class="chart-card selected-card" style={`--chart-color: ${activeChartMetric.color}`}>
      <div class="chart-heading">
        <span class="chart-icon" aria-hidden="true"><span></span><span></span><span></span></span>
        <span><span class="chart-label">{activeChartMetric.label}</span><span class="chart-description">{activeChartMetric.description} · ranked high → low</span></span>
        <span class="leader-value">{formatNumber(metricStats(activeChartMetric.key).leader[activeChartMetric.key])}</span>
      </div>
      <div class="chart-wrap">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label={`${activeChartMetric.label} by video rank`} onpointermove={(event) => inspect(activeChartMetric.key, event)} onpointerleave={() => { hoveredRank = null; hoveredMetric = null; }}>
          <defs>
            <linearGradient id={`fill-${activeChartMetric.key}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color={activeChartMetric.color} stop-opacity=".18" />
              <stop offset="100%" stop-color={activeChartMetric.color} stop-opacity="0" />
            </linearGradient>
          </defs>
          {#each yTicks(activeChartMetric.key) as tick}
            <line class="grid-line" x1={plot.left} x2={chartWidth - plot.right} y1={tick.y} y2={tick.y} />
            <text class="axis-label" x={plot.left - 9} y={tick.y + 4} text-anchor="end">{tick.label}</text>
          {/each}
          {#each xTicks() as tick}
            <line class="x-grid-line" x1={tick.x} x2={tick.x} y1={plot.top} y2={chartHeight - plot.bottom} />
            <text class="axis-label" x={tick.x} y={chartHeight - 10} text-anchor={tick.value === 1 ? 'start' : 'end'}>{tick.label}</text>
          {/each}
          <line class="axis-spine" x1={plot.left} x2={plot.left} y1={plot.top} y2={chartHeight - plot.bottom} />
          <line class="axis-line" x1={plot.left} x2={chartWidth - plot.right} y1={chartHeight - plot.bottom} y2={chartHeight - plot.bottom} />
          {#if logScale}
            <path class="axis-break" d={`M ${plot.left - 5} ${chartHeight - plot.bottom - 8} l 7 6 M ${plot.left - 5} ${chartHeight - plot.bottom - 1} l 7 6`} />
            <text class="break-label" x={plot.left - 9} y={chartHeight - plot.bottom + 27} text-anchor="end">0 / 1</text>
          {/if}
          <polygon class="area-fill" fill={`url(#fill-${activeChartMetric.key})`} points={`${plot.left},${chartHeight - plot.bottom} ${sampledPoints(activeChartMetric.key).map((point) => `${point.x},${point.y}`).join(' ')} ${chartWidth - plot.right},${chartHeight - plot.bottom}`} />
          <polyline class="data-line" stroke={activeChartMetric.color} points={sampledPoints(activeChartMetric.key).map((point) => `${point.x},${point.y}`).join(' ')} />
          {#if selectedScope > 1}
            <line class="focus-line" x1={xForRank(activeRank)} x2={xForRank(activeRank)} y1={plot.top} y2={chartHeight - plot.bottom} />
            <circle class="focus-dot" fill={activeChartMetric.color} cx={xForRank(activeRank)} cy={yForValue(metricValue(ranked[activeChartMetric.key][Math.min(activeRank, selectedScope) - 1], activeChartMetric.key), activeChartMetric.key)} r="5" />
          {/if}
        </svg>
        <div class="chart-tooltip" aria-live="polite">
          <span class="tooltip-rank">#{activeRank.toLocaleString('en-US')}</span>
          <span class="tooltip-title" title={ranked[activeChartMetric.key][Math.min(activeRank, selectedScope) - 1].title}>{ranked[activeChartMetric.key][Math.min(activeRank, selectedScope) - 1].title}</span>
          <strong>{fullNumber(metricValue(ranked[activeChartMetric.key][Math.min(activeRank, selectedScope) - 1], activeChartMetric.key))}</strong>
        </div>
      </div>
      <footer class="chart-footer"><span>Rank <strong>#{activeRank.toLocaleString('en-US')}</strong></span><span>Average <strong>{formatNumber(metricStats(activeChartMetric.key).average)}</strong></span><span>Drag across chart to inspect</span></footer>
    </article>
  </section>

  <section class="inspector" aria-label="Video inspector">
    <div class="inspector-kicker"><span class="eyebrow-dot"></span> INSPECTING RANK #{activeRank.toLocaleString('en-US')}</div>
    <div class="inspector-content">
      <div class="inspector-title"><p class="selected-metric" style={`color: ${chartMetrics.find((metric) => metric.key === activeMetric)?.color}`}>{chartMetrics.find((metric) => metric.key === activeMetric)?.label}</p><h2 title={activeVideo.title}><a href={activeVideo.video_url} target="_blank" rel="noopener noreferrer">{activeVideo.title}</a></h2><p class="channel"><a href={activeVideo.channel_url} target="_blank" rel="noopener noreferrer">{activeVideo.channel_title}</a></p></div>
      <div class="inspector-stats">
        {#each chartMetrics as metric}
          <button type="button" class:chosen={activeMetric === metric.key} style={`--stat-color: ${metric.color}`} onclick={() => chooseMetric(metric.key)}><span>{metric.label}</span><strong>{formatNumber(activeVideo[metric.key])}</strong></button>
        {/each}
      </div>
    </div>
  </section>

</main>

<style>
  .milestone-page { max-width: 1180px; margin: 0 auto; padding: 70px 32px 90px; color: var(--foreground); }
  .hero { max-width: 820px; margin: 0 auto 56px; text-align: center; }
  .eyebrow, .inspector-kicker { display: flex; align-items: center; gap: 9px; color: var(--muted-foreground); font-size: 11px; font-weight: 800; letter-spacing: .16em; }
  .eyebrow { justify-content: center; margin-bottom: 22px; }
  .eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; background: var(--accent); box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 15%, transparent); }
  h1 { margin: 0; font-size: clamp(42px, 7vw, 78px); letter-spacing: -.07em; line-height: .96; font-weight: 900; color: var(--foreground); }
  h1 em { color: var(--accent); font-style: normal; }
  .intro { max-width: 660px; margin: 27px auto 25px; color: var(--muted-foreground); font-size: 17px; line-height: 1.65; }
  .hero-meta { display: flex; gap: 12px; justify-content: center; align-items: center; color: var(--muted-foreground); font-size: 11px; text-transform: uppercase; letter-spacing: .09em; }
  .hero-meta strong { color: var(--foreground); }
  .meta-divider { opacity: .35; }
  .control-panel { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: end; gap: 18px 28px; padding: 20px 22px; margin-bottom: 18px; background: var(--card); border: 1px solid var(--border); border-radius: 14px; box-shadow: 0 8px 24px color-mix(in srgb, var(--foreground) 5%, transparent); }
  .control-label { margin: 0 0 9px; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: .13em; font-size: 10px; font-weight: 800; }
  .scope-controls, .metric-controls { display: flex; flex-wrap: wrap; gap: 6px; }
  button { font: inherit; color: inherit; cursor: pointer; }
  .scope-controls button, .metric-controls button { border: 1px solid var(--border); background: transparent; border-radius: 7px; padding: 8px 13px; color: var(--muted-foreground); font-size: 13px; transition: background .2s, color .2s, border-color .2s; }
  .scope-controls button:hover, .scope-controls button.active, .metric-controls button:hover, .metric-controls button.active { color: var(--foreground); background: var(--muted); border-color: var(--accent); }
  .metric-controls button.active { border-color: var(--metric-color); }
  .scale-control { text-align: right; }
  .scale-toggle { width: 160px; min-width: 160px; white-space: nowrap; display: inline-flex; align-items: center; justify-content: flex-start; gap: 9px; padding: 0; border: 0; background: transparent; color: var(--foreground); font-size: 13px; }
  .toggle-track { width: 29px; height: 17px; flex: 0 0 29px; box-sizing: border-box; overflow: hidden; padding: 2px; display: inline-flex; align-items: center; border-radius: 20px; background: var(--border); transition: background .2s; }
  .toggle-track span { width: 13px; height: 13px; flex: 0 0 13px; border-radius: 50%; background: var(--card); transition: transform .2s; }
  .scale-toggle.active .toggle-track { background: var(--accent); }
  .scale-toggle.active .toggle-track span { transform: translateX(12px); }
  .chart-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 18px; }
  .chart-card { min-width: 0; overflow: hidden; background: var(--card); border: 1px solid var(--border); border-radius: 14px; transition: border-color .2s, transform .2s, box-shadow .2s; }
  .chart-card:hover, .chart-card.selected-card { border-color: color-mix(in srgb, var(--chart-color) 60%, var(--border)); box-shadow: 0 10px 30px color-mix(in srgb, var(--chart-color) 8%, transparent); }
  .chart-heading { width: 100%; display: flex; align-items: center; gap: 11px; padding: 20px 20px 8px; text-align: left; background: transparent; border: 0; }
  .chart-icon { width: 25px; height: 25px; display: flex; align-items: end; gap: 3px; padding: 4px; background: color-mix(in srgb, var(--chart-color) 11%, transparent); border-radius: 6px; }
  .chart-icon span { width: 4px; background: var(--chart-color); border-radius: 2px; }
  .chart-icon span:nth-child(1) { height: 7px; opacity: .55; }.chart-icon span:nth-child(2) { height: 12px; opacity: .75; }.chart-icon span:nth-child(3) { height: 17px; }
  .chart-label { display: block; font-size: 17px; font-weight: 800; }.chart-description { display: block; margin-top: 2px; color: var(--muted-foreground); font-size: 11px; }
  .leader-value { margin-left: auto; color: var(--chart-color); font-size: 17px; font-weight: 800; letter-spacing: -.03em; }
  .chart-wrap { position: relative; padding: 0 10px; }
  svg { display: block; width: 100%; height: auto; overflow: visible; touch-action: none; cursor: crosshair; }
  .grid-line { stroke: var(--border); stroke-width: 1; stroke-dasharray: 2 5; opacity: .65; }.axis-line, .axis-spine { stroke: var(--border); stroke-width: 1; }.axis-label, .break-label { fill: var(--muted-foreground); font-size: 10px; }.axis-break { fill: none; stroke: var(--foreground); stroke-width: 2; stroke-linecap: round; opacity: .8; }
  .area-fill { stroke: none; }.data-line { fill: none; stroke-width: 2.5; stroke-linejoin: round; stroke-linecap: round; }.focus-line { stroke: var(--foreground); stroke-width: 1; stroke-dasharray: 3 4; opacity: .42; }.focus-dot { stroke: var(--card); stroke-width: 3; }
  .chart-tooltip { position: relative; pointer-events: none; left: auto; right: auto; bottom: auto; min-height: 26px; margin: 0 12px 0 65px; display: flex; align-items: center; gap: 8px; font-size: 11px; overflow: hidden; }
  .chart-tooltip > * { min-width: 0; }
  .tooltip-rank { color: var(--chart-color); font-weight: 800; white-space: nowrap; }.tooltip-title { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--muted-foreground); }.chart-tooltip strong { white-space: nowrap; font-size: 12px; }
  .chart-footer { display: flex; gap: 12px; padding: 10px 20px 17px; color: var(--muted-foreground); font-size: 10px; }.chart-footer span:nth-child(2) { margin-left: auto; }.chart-footer span:last-child { display: none; }.chart-footer strong { color: var(--foreground); }
  .inspector { margin-top: 26px; padding: 24px 26px 26px; background: var(--muted); border: 1px solid var(--border); border-radius: 14px; }.inspector-kicker { margin-bottom: 21px; }.inspector-content { display: flex; gap: 30px; align-items: center; }.inspector-title { min-width: 0; flex: 1; }.inspector-title a { color: inherit; text-decoration: none; }.inspector-title h2 a:hover { text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 4px; }.inspector-title .channel a { color: var(--accent); }.selected-metric { margin: 0 0 7px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .12em; }.inspector h2 { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0; font-size: clamp(19px, 3vw, 28px); letter-spacing: -.04em; }.channel { margin: 7px 0 0; color: var(--muted-foreground); font-size: 13px; }.inspector-stats { display: grid; grid-template-columns: repeat(4, minmax(90px, 1fr)); flex: 1.2; gap: 8px; }.inspector-stats button { padding: 11px 12px; background: var(--card); border: 1px solid var(--border); border-radius: 8px; text-align: left; }.inspector-stats button:hover, .inspector-stats button.chosen { border-color: var(--stat-color); }.inspector-stats span { display: block; color: var(--muted-foreground); font-size: 10px; }.inspector-stats strong { display: block; margin-top: 5px; font-size: 15px; }
  @media (max-width: 760px) { .milestone-page { padding: 45px 16px 65px; }.hero { margin-bottom: 38px; }.intro { font-size: 15px; }.hero-meta { flex-wrap: wrap; gap: 7px; font-size: 9px; }.control-panel { align-items: start; flex-direction: column; gap: 18px; }.scale-control { text-align: left; }.chart-grid { grid-template-columns: 1fr; }.inspector-content { align-items: stretch; flex-direction: column; gap: 18px; }.inspector-stats { flex: initial; }.chart-footer span:last-child { display: block; margin-left: auto; }.chart-footer span:nth-child(2) { margin-left: 0; }.chart-footer { gap: 8px; } }
  @media (max-width: 460px) { .inspector-stats { grid-template-columns: repeat(2, 1fr); }.chart-footer { flex-wrap: wrap; }.chart-footer span:last-child { width: 100%; margin-left: 0; }.meta-divider { display: none; } }
</style>
