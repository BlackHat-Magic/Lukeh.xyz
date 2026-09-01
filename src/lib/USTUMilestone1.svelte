<script lang="ts">
  import dataset from '../data/youtube-trending-deduplicated.json';

  type MetricKey = 'views' | 'likes' | 'dislikes' | 'comment_count';
  type Video = {
    title: string;
    channel_title: string;
    views: number;
    likes: number;
    dislikes: number;
    comment_count: number;
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
    { value: 10000, label: 'Top 10,000' },
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
    return plot.left + ((rank - 1) / Math.max(scope - 1, 1)) * plotWidth;
  }

  function yForValue(value: number, metric: MetricKey): number {
    const max = metricValue(ranked[metric][0], metric);
    const normalized = logScale ? Math.log10(Math.max(value, 1)) / Math.log10(Math.max(max, 10)) : value / max;
    return plot.top + (1 - normalized) * plotHeight;
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

  function tickLabel(metric: MetricKey, fraction: number): string {
    const max = metricValue(ranked[metric][0], metric);
    const value = logScale ? Math.pow(Math.max(max, 10), fraction) : max * fraction;
    return formatNumber(value);
  }

  function inspect(metric: MetricKey, event: PointerEvent) {
    const svg = event.currentTarget as SVGElement;
    const bounds = svg.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    hoveredRank = Math.max(1, Math.min(selectedScope, Math.round(ratio * (selectedScope - 1)) + 1));
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
    <h1>What makes a video<br /><em>trend?</em></h1>
    <p class="intro">An interactive look at the videos that rose to the top of YouTube. Explore how views, reactions, and conversation change as we widen the lens from the top 10 to the full dataset.</p>
    <div class="hero-meta">
      <span><strong>{videos.length.toLocaleString('en-US')}</strong> unique records</span>
      <span class="meta-divider">/</span>
      <span>four engagement signals</span>
      <span class="meta-divider">/</span>
      <span>ranked high → low</span>
    </div>
  </header>

  <section class="control-panel" aria-label="Chart controls">
    <div>
      <p class="control-label">Show me</p>
      <div class="scope-controls" role="group" aria-label="Select ranking scope">
        {#each scopes as scope}
          <button class:active={selectedScope === scope.value} type="button" onclick={() => setScope(scope.value)}>{scope.label}</button>
        {/each}
      </div>
    </div>
    <div class="scale-control">
      <p class="control-label">Y axis</p>
      <button class="scale-toggle" class:active={logScale} type="button" onclick={() => logScale = !logScale} aria-pressed={logScale}>
        <span class="toggle-track"><span></span></span>
        {logScale ? 'Logarithmic' : 'Linear'} scale
      </button>
    </div>
  </section>

  <section class="chart-grid" aria-label="Engagement charts">
    {#each chartMetrics as metric}
      {@const stats = metricStats(metric.key)}
      {@const points = sampledPoints(metric.key)}
      {@const selected = ranked[metric.key][Math.min(activeRank, selectedScope) - 1]}
      <article class="chart-card" class:selected-card={activeMetric === metric.key} style={`--chart-color: ${metric.color}`}>
        <button class="chart-heading" type="button" onclick={() => chooseMetric(metric.key)} aria-label={`Inspect ${metric.label}`}>
          <span class="chart-icon" aria-hidden="true"><span></span><span></span><span></span></span>
          <span><span class="chart-label">{metric.label}</span><span class="chart-description">{metric.description}</span></span>
          <span class="leader-value">{formatNumber(stats.leader[metric.key])}</span>
        </button>
        <div class="chart-wrap">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label={`${metric.label} by video rank`} onpointermove={(event) => inspect(metric.key, event)} onpointerleave={() => { hoveredRank = null; hoveredMetric = null; }}>
            <defs>
              <linearGradient id={`fill-${metric.key}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color={metric.color} stop-opacity=".18" />
                <stop offset="100%" stop-color={metric.color} stop-opacity="0" />
              </linearGradient>
            </defs>
            {#each [0, .25, .5, .75, 1] as tick}
              <line class="grid-line" x1={plot.left} x2={chartWidth - plot.right} y1={plot.top + tick * plotHeight} y2={plot.top + tick * plotHeight} />
              <text class="axis-label" x={plot.left - 9} y={plot.top + tick * plotHeight + 4} text-anchor="end">{tickLabel(metric.key, 1 - tick)}</text>
            {/each}
            <line class="axis-line" x1={plot.left} x2={chartWidth - plot.right} y1={chartHeight - plot.bottom} y2={chartHeight - plot.bottom} />
            <text class="axis-label" x={plot.left} y={chartHeight - 10}>1</text>
            <text class="axis-label" x={chartWidth - plot.right} y={chartHeight - 10} text-anchor="end">{selectedScope.toLocaleString('en-US')}</text>
            <polygon class="area-fill" fill={`url(#fill-${metric.key})`} points={`${plot.left},${chartHeight - plot.bottom} ${points.map((point) => `${point.x},${point.y}`).join(' ')} ${chartWidth - plot.right},${chartHeight - plot.bottom}`} />
            <polyline class="data-line" stroke={metric.color} points={points.map((point) => `${point.x},${point.y}`).join(' ')} />
            {#if selectedScope > 1}
              <line class="focus-line" x1={xForRank(activeRank)} x2={xForRank(activeRank)} y1={plot.top} y2={chartHeight - plot.bottom} />
              <circle class="focus-dot" fill={metric.color} cx={xForRank(activeRank)} cy={yForValue(metricValue(selected, metric.key), metric.key)} r="5" />
            {/if}
          </svg>
          <div class="chart-tooltip" aria-live="polite">
            <span class="tooltip-rank">#{activeRank.toLocaleString('en-US')}</span>
            <span class="tooltip-title" title={selected.title}>{selected.title}</span>
            <strong>{fullNumber(metricValue(selected, metric.key))}</strong>
          </div>
        </div>
        <footer class="chart-footer"><span>Rank <strong>#{activeRank.toLocaleString('en-US')}</strong></span><span>Average <strong>{formatNumber(stats.average)}</strong></span><span>Drag across chart to inspect</span></footer>
      </article>
    {/each}
  </section>

  <section class="inspector" aria-label="Video inspector">
    <div class="inspector-kicker"><span class="eyebrow-dot"></span> INSPECTING RANK #{activeRank.toLocaleString('en-US')}</div>
    <div class="inspector-content">
      <div class="inspector-title"><p class="selected-metric" style={`color: ${chartMetrics.find((metric) => metric.key === activeMetric)?.color}`}>{chartMetrics.find((metric) => metric.key === activeMetric)?.label}</p><h2 title={activeVideo.title}>{activeVideo.title}</h2><p class="channel">{activeVideo.channel_title}</p></div>
      <div class="inspector-stats">
        {#each chartMetrics as metric}
          <button type="button" class:chosen={activeMetric === metric.key} style={`--stat-color: ${metric.color}`} onclick={() => chooseMetric(metric.key)}><span>{metric.label}</span><strong>{formatNumber(activeVideo[metric.key])}</strong></button>
        {/each}
      </div>
    </div>
  </section>

  <footer class="methodology">
    <div><span class="eyebrow-dot"></span><span>METHOD</span></div>
    <p>The four supplied CSV exports were merged into one dataset and exact duplicate rows were removed before ranking. Rows with the same title and channel but different count snapshots remain distinct. The source contains 6,351 records, so “Top 10,000” represents every available record. A logarithmic scale is on by default to make the long tail readable.</p>
    <p class="source-note">Source: supplied trending YouTube CSV exports · Built for USTU-092 Milestone 1</p>
  </footer>
</main>

<style>
  .milestone-page { max-width: 1180px; margin: 0 auto; padding: 70px 32px 90px; color: var(--foreground); }
  .hero { max-width: 820px; margin: 0 auto 56px; text-align: center; }
  .eyebrow, .inspector-kicker, .methodology > div { display: flex; align-items: center; gap: 9px; color: var(--muted-foreground); font-size: 11px; font-weight: 800; letter-spacing: .16em; }
  .eyebrow { justify-content: center; margin-bottom: 22px; }
  .eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; background: var(--accent); box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 15%, transparent); }
  h1 { margin: 0; font-size: clamp(42px, 7vw, 78px); letter-spacing: -.07em; line-height: .96; font-weight: 900; color: var(--foreground); }
  h1 em { color: var(--accent); font-style: normal; }
  .intro { max-width: 660px; margin: 27px auto 25px; color: var(--muted-foreground); font-size: 17px; line-height: 1.65; }
  .hero-meta { display: flex; gap: 12px; justify-content: center; align-items: center; color: var(--muted-foreground); font-size: 11px; text-transform: uppercase; letter-spacing: .09em; }
  .hero-meta strong { color: var(--foreground); }
  .meta-divider { opacity: .35; }
  .control-panel { display: flex; justify-content: space-between; align-items: end; padding: 20px 22px; margin-bottom: 18px; background: var(--card); border: 1px solid var(--border); border-radius: 14px; box-shadow: 0 8px 24px color-mix(in srgb, var(--foreground) 5%, transparent); }
  .control-label { margin: 0 0 9px; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: .13em; font-size: 10px; font-weight: 800; }
  .scope-controls { display: flex; flex-wrap: wrap; gap: 6px; }
  button { font: inherit; color: inherit; cursor: pointer; }
  .scope-controls button { border: 1px solid var(--border); background: transparent; border-radius: 7px; padding: 8px 13px; color: var(--muted-foreground); font-size: 13px; transition: background .2s, color .2s, border-color .2s; }
  .scope-controls button:hover, .scope-controls button.active { color: var(--foreground); background: var(--muted); border-color: var(--accent); }
  .scale-control { text-align: right; }
  .scale-toggle { display: inline-flex; align-items: center; gap: 9px; padding: 0; border: 0; background: transparent; color: var(--foreground); font-size: 13px; }
  .toggle-track { width: 29px; height: 17px; padding: 2px; display: inline-flex; align-items: center; border-radius: 20px; background: var(--border); transition: background .2s; }
  .toggle-track span { width: 13px; height: 13px; border-radius: 50%; background: var(--card); transition: transform .2s; }
  .scale-toggle.active .toggle-track { background: var(--accent); }
  .scale-toggle.active .toggle-track span { transform: translateX(12px); }
  .chart-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
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
  .grid-line { stroke: var(--border); stroke-width: 1; stroke-dasharray: 2 5; opacity: .65; }.axis-line { stroke: var(--border); stroke-width: 1; }.axis-label { fill: var(--muted-foreground); font-size: 10px; }
  .area-fill { stroke: none; }.data-line { fill: none; stroke-width: 2.5; stroke-linejoin: round; stroke-linecap: round; }.focus-line { stroke: var(--foreground); stroke-width: 1; stroke-dasharray: 3 4; opacity: .42; }.focus-dot { stroke: var(--card); stroke-width: 3; }
  .chart-tooltip { position: absolute; pointer-events: none; left: 65px; right: 22px; bottom: 9px; display: flex; align-items: center; gap: 8px; font-size: 11px; overflow: hidden; }
  .tooltip-rank { color: var(--chart-color); font-weight: 800; white-space: nowrap; }.tooltip-title { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--muted-foreground); }.chart-tooltip strong { white-space: nowrap; font-size: 12px; }
  .chart-footer { display: flex; gap: 12px; padding: 10px 20px 17px; color: var(--muted-foreground); font-size: 10px; }.chart-footer span:nth-child(2) { margin-left: auto; }.chart-footer span:last-child { display: none; }.chart-footer strong { color: var(--foreground); }
  .inspector { margin-top: 26px; padding: 24px 26px 26px; background: var(--muted); border: 1px solid var(--border); border-radius: 14px; }.inspector-kicker { margin-bottom: 21px; }.inspector-content { display: flex; gap: 30px; align-items: center; }.inspector-title { min-width: 0; flex: 1; }.selected-metric { margin: 0 0 7px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .12em; }.inspector h2 { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0; font-size: clamp(19px, 3vw, 28px); letter-spacing: -.04em; }.channel { margin: 7px 0 0; color: var(--muted-foreground); font-size: 13px; }.inspector-stats { display: grid; grid-template-columns: repeat(4, minmax(90px, 1fr)); flex: 1.2; gap: 8px; }.inspector-stats button { padding: 11px 12px; background: var(--card); border: 1px solid var(--border); border-radius: 8px; text-align: left; }.inspector-stats button:hover, .inspector-stats button.chosen { border-color: var(--stat-color); }.inspector-stats span { display: block; color: var(--muted-foreground); font-size: 10px; }.inspector-stats strong { display: block; margin-top: 5px; font-size: 15px; }.methodology { display: grid; grid-template-columns: 190px 1fr; gap: 9px 28px; margin-top: 60px; padding-top: 24px; border-top: 1px solid var(--border); }.methodology > div { align-items: start; padding-top: 3px; }.methodology p { max-width: 720px; margin: 0; color: var(--muted-foreground); font-size: 12px; line-height: 1.7; }.methodology .source-note { grid-column: 2; opacity: .7; font-size: 11px; }
  @media (max-width: 760px) { .milestone-page { padding: 45px 16px 65px; }.hero { margin-bottom: 38px; }.intro { font-size: 15px; }.hero-meta { flex-wrap: wrap; gap: 7px; font-size: 9px; }.control-panel { align-items: start; flex-direction: column; gap: 18px; }.scale-control { text-align: left; }.chart-grid { grid-template-columns: 1fr; }.inspector-content { align-items: stretch; flex-direction: column; gap: 18px; }.inspector-stats { flex: initial; }.methodology { display: block; }.methodology > div { margin-bottom: 13px; }.methodology p { margin-bottom: 10px; }.methodology .source-note { margin-left: 0; }.chart-footer span:last-child { display: block; margin-left: auto; }.chart-footer span:nth-child(2) { margin-left: 0; }.chart-footer { gap: 8px; } }
  @media (max-width: 460px) { .inspector-stats { grid-template-columns: repeat(2, 1fr); }.chart-footer { flex-wrap: wrap; }.chart-footer span:last-child { width: 100%; margin-left: 0; }.meta-divider { display: none; } }
</style>
