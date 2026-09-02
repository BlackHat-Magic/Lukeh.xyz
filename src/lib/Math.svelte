<script lang="ts">
  import { onMount } from 'svelte';
  import { HugeiconsIcon } from '@hugeicons/svelte';
  import { MinusIcon as MinusIconGlyph, PlusIcon as PlusIconGlyph } from '@hugeicons/core-free-icons';

  type MainTab = 'Vector Calculus' | 'Statistics';
  const tabs = ['Vector Addition', 'Scalar Multiplication', 'Vector Magnitude', 'Unit Vector', 'Dot Product', 'Cross Product', 'TSP', 'Vector Projection'] as const;
  type SubTab = typeof tabs[number];
  let main = $state<MainTab>('Vector Calculus');
  let tab = $state<SubTab>('Vector Addition');
  let addVectors = $state<number[][]>([[0, 0, 0], [0, 0, 0]]);
  let scalarValues = $state<number[]>([0, 0, 0]);
  let scalar = $state(1);
  let magnitudeValues = $state<number[]>([0, 0, 0]);
  let unitValues = $state<number[]>([0, 0, 0]);
  let dotA = $state<number[]>([0, 0, 0]);
  let dotB = $state<number[]>([0, 0, 0]);
  let crossA = $state<number[]>([0, 0, 0]);
  let crossB = $state<number[]>([0, 0, 0]);
  let triple = $state<number[][]>([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
  let projectionA = $state<number[]>([0, 0, 0]);
  let projectionB = $state<number[]>([0, 0, 0]);

  const number = (value: number | string | undefined) => Number(value) || 0;
  const fixed = (value: number) => Number(value.toFixed(5));
  const vectorText = (values: Array<number | string>) => values.map((value) => String(value)).join(', ');
  const dot = (a: number[], b: number[]) => a.reduce((sum, value, i) => sum + number(value) * number(b[i]), 0);
  const magnitude = (values: number[]) => Math.sqrt(values.reduce((sum, value) => sum + number(value) ** 2, 0));
  const addResult = $derived(addVectors[0].map((_, i) => addVectors.reduce((sum, vector) => sum + number(vector[i]), 0)));
  const scalarResult = $derived(scalarValues.map((value) => number(value) * number(scalar)));
  const magnitudeResult = $derived(magnitude(magnitudeValues).toFixed(5));
  const unitResult = $derived(unitValues.map((value) => (magnitude(unitValues) ? number(value) / magnitude(unitValues) : 0).toFixed(5)));
  const dotResult = $derived(dot(dotA, dotB));
  const crossResult = $derived([
    number(crossA[1]) * number(crossB[2]) - number(crossA[2]) * number(crossB[1]),
    number(crossA[2]) * number(crossB[0]) - number(crossA[0]) * number(crossB[2]),
    number(crossA[0]) * number(crossB[1]) - number(crossA[1]) * number(crossB[0]),
  ]);
  const tripleResult = $derived(dot(triple[0], [
    number(triple[1][1]) * number(triple[2][2]) - number(triple[1][2]) * number(triple[2][1]),
    number(triple[1][2]) * number(triple[2][0]) - number(triple[1][0]) * number(triple[2][2]),
    number(triple[1][0]) * number(triple[2][1]) - number(triple[1][1]) * number(triple[2][0]),
  ]));
  const projectionScalar = $derived(magnitude(projectionB) === 0 ? '0' : (dot(projectionA, projectionB) / magnitude(projectionB)).toFixed(5));
  const projectionResult = $derived(projectionB.map((value) => fixed(magnitude(projectionB) === 0 ? 0 : dot(projectionA, projectionB) / (magnitude(projectionB) ** 2) * number(value))));

  function changeDimension(values: number[], delta: number) {
    if (delta < 0 && values.length <= 1) { alert('Stop that.'); return; }
    if (delta < 0) values.pop(); else values.push(0);
  }
  function changeAddVectors(delta: number) {
    if (delta < 0 && addVectors.length <= 1) { alert('Stop that.'); return; }
    if (delta < 0) addVectors.pop(); else addVectors.push(new Array(addVectors[0].length).fill(0));
  }
  function changeAddDimensions(delta: number) {
    if (delta < 0 && addVectors[0].length <= 1) { alert('Stop that.'); return; }
    for (const vector of addVectors) delta < 0 ? vector.pop() : vector.push(0);
  }
  function changePair(first: number[], second: number[], delta: number) {
    if (delta < 0 && first.length <= 1) { alert('Stop that.'); return; }
    delta < 0 ? (first.pop(), second.pop()) : (first.push(0), second.push(0));
  }
  function setHash(value: string) {
    const hash = value === 'Statistics' ? '#Statistics' : `#${encodeURIComponent('Vector Calculus')}/${encodeURIComponent(value)}`;
    if (location.hash !== hash) history.replaceState(null, '', hash);
  }
  function setMain(value: MainTab) {
    main = value;
    if (value === 'Statistics') setHash(value);
    else {
      const raw = decodeURIComponent(location.hash.replace(/^#/, ''));
      const [mainPart, subPart] = raw.split('/');
      tab = mainPart === 'Vector Calculus' && (tabs as readonly string[]).includes(subPart || '') ? subPart as SubTab : 'Vector Addition';
      setHash(tab);
    }
  }
  function setTab(value: SubTab) { main = 'Vector Calculus'; tab = value; setHash(value); }
  function readHash() {
    const raw = decodeURIComponent(location.hash.replace(/^#/, ''));
    const [mainPart, subPart] = raw.split('/');
    main = mainPart === 'Statistics' ? 'Statistics' : 'Vector Calculus';
    if (main === 'Vector Calculus') {
      tab = subPart && (tabs as readonly string[]).includes(subPart) ? subPart as SubTab : 'Vector Addition';
    }
  }
  onMount(() => { readHash(); addEventListener('hashchange', readHash); return () => removeEventListener('hashchange', readHash); });
</script>

{#snippet MinusIcon()}
  <HugeiconsIcon icon={MinusIconGlyph} size={14} strokeWidth={2} aria-hidden="true" />
{/snippet}
{#snippet PlusIcon()}
  <HugeiconsIcon icon={PlusIconGlyph} size={14} strokeWidth={2} aria-hidden="true" />
{/snippet}
{#snippet ResizeButton(delta: number, label: string)}
  <button type="button" class="inline-flex items-center justify-center w-8 h-8 bg-card border border-border rounded-full shadow-sm cursor-pointer hover:bg-muted focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none active:bg-card" onclick={() => changeAddVectors(delta)} aria-label="{delta < 0 ? 'Decrease' : 'Increase'} {label.toLowerCase()}">{#if delta < 0}{@render MinusIcon()}{:else}{@render PlusIcon()}{/if}</button>
{/snippet}
{#snippet DimensionButtons(values: number[], label = 'Dimensions', change = changeDimension)}
  <h4 class="text-lg font-semibold leading-non tracking-tight mb-4"><span class="mx-2">{label}</span><button type="button" class="inline-flex items-center justify-center w-8 h-8 bg-card border border-border rounded-full shadow-sm cursor-pointer hover:bg-muted focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none active:bg-card" onclick={() => change(values, -1)} aria-label="Decrease {label.toLowerCase()}">{@render MinusIcon()}</button><span class="mx-2">{values.length}</span><button type="button" class="inline-flex items-center justify-center w-8 h-8 bg-card border border-border rounded-full shadow-sm cursor-pointer hover:bg-muted focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none active:bg-card" onclick={() => change(values, 1)} aria-label="Increase {label.toLowerCase()}">{@render PlusIcon()}</button></h4>
{/snippet}
{#snippet VectorEditor(values: Array<number | string>, prefix = '')}
  <h6 class="text-lg text-center mb-2"><span>{prefix}&lt;</span>{#each values as value, i}<span>{#if i !== 0}, {/if}<input type="number" bind:value={values[i]} class="inline-flex w-16 h-10 px-3 py-2 text-sm bg-card border rounded-md border-border ring-offset-background placeholder:text-muted-foreground focus:border-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50" /></span>{/each}<span>&gt;</span></h6>
{/snippet}
{#snippet VectorResult(values: number[])}
  <h6 class="text-lg text-center mb-2"><span>&lt;{vectorText(values)}&gt;</span></h6>
{/snippet}

<main class="math-page mx-auto flex min-h-screen max-w-full flex-col items-center justify-start px-6 text-left">
  <div class="flex items-center justify-center mx-auto text-center max-w-7xl mb-8 mt-8"><h1 class="text-2xl font-black leading-tight">Math Tools</h1></div>
  <div class="relative w-full max-w-3xl">
    <div class="relative inline-grid items-center justify-center w-full h-10 grid-cols-2 p-1 text-muted-foreground bg-muted rounded-lg select-none">
      <button type="button" onclick={() => setMain('Vector Calculus')} class="relative z-20 inline-flex items-center justify-center w-full h-8 px-3 text-sm font-medium transition-all rounded-md cursor-pointer whitespace-nowrap">Vector Calculus</button>
      <button type="button" onclick={() => setMain('Statistics')} class="relative z-20 inline-flex items-center justify-center w-full h-8 px-3 text-sm font-medium transition-all rounded-md cursor-pointer whitespace-nowrap">Probability and Statistics</button>
      <div class="absolute left-0 z-10 w-1/2 h-full duration-300 ease-out" class:translate-x-full={main === 'Statistics'}><div class="w-full h-full bg-card rounded-md shadow-sm"></div></div>
    </div>
    <div class="relative w-full mt-2">
      {#if main === 'Vector Calculus'}
        <div class="border border-border rounded-lg shadow-sm bg-card text-foreground p-4"><div class="flex flex-col space-y-1.5 p-2"><h3 class="text-xl font-semibold leading-none tracking-tight">Vector Calculus</h3></div>
          <div class="relative flex w-full">
            <div class="relative inline-grid items-start justify-start h-full p-1 text-muted-foreground bg-card border border-border rounded-lg select-none">{#each tabs as name, index}<button type="button" onclick={() => setTab(name)} class:text-foreground={tab === name} class="relative z-20 inline-flex items-center justify-start w-full h-8 px-3 text-sm transition-colors rounded-md cursor-pointer whitespace-nowrap">{name === 'TSP' ? 'Triple Scalar Product' : name}</button>{/each}<div class="absolute left-0 top-0 z-10 w-full h-8 transition-transform duration-300 ease-out" style={`transform: translateY(${tabs.indexOf(tab) * 2}rem);`}><div class="w-full h-full bg-muted rounded-md shadow-sm pointer-events-none"></div></div></div>
            <div class="relative flex items-start justify-start w-full p-5 ml-2 text-xs text-foreground border border-border rounded-md content bg-card">
              {#if tab === 'Vector Addition'}
                <div class="relative"><h3 class="text-xl font-semibold leading-none tracking-tight mb-4">Vector Addition</h3><p class="mb-4">Vector addition is very straightforward. For two vectors whose dimensions match, write them left-to-right, one over the other. For each component, the corresponding component in the sum vector is just the sum of those same components in the original vector.</p><p class="mb-4">To use the calculator, add vectors to the calculator until you reach the desired number. Then set the number of dimensions that each of the vectors should have.</p><p class="mb-4">The resultant vector is listed at the bottom.</p>
                  <h4 class="text-lg font-semibold leading-non tracking-tight mb-4"><span class="mx-2"># of Vectors</span>{@render ResizeButton(-1, 'vectors')}<span class="mx-2">{addVectors.length}</span>{@render ResizeButton(1, 'vectors')}</h4>
                  {@render DimensionButtons(addVectors[0], 'Dimensions', changeAddDimensions)}
                  <div class="items-center justify-center w-full">{#each addVectors as vector}{@render VectorEditor(vector)}{/each}</div><h4 class="text-lg font-semibold leading-non tracking-tight mb-4">Result</h4>{@render VectorResult(addResult)}
                </div>
              {:else if tab === 'Scalar Multiplication'}
                <div class="relative"><h3 class="text-xl font-semibold leading-none tracking-tight mb-4">Scalar Multiplication</h3><p class="mb-4">Multiplying a vector by a scalar is very straightforward. For any given component in the vector, the corresponding component in the output vector is that component multiplied by the scalar.</p><h4 class="text-lg font-semibold leading-non tracking-tight mb-4"><span class="mx-2">Scalar: </span><input type="number" placeholder="Scalar" bind:value={scalar} class="inline-flex w-16 h-10 px-3 py-2 text-sm bg-card border rounded-md border-border ring-offset-background placeholder:text-muted-foreground focus:border-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50" /></h4>{@render DimensionButtons(scalarValues)}{@render VectorEditor(scalarValues)}<h4 class="text-lg font-semibold leading-non tracking-tight mb-4">Result</h4>{@render VectorResult(scalarResult)}</div>
              {:else if tab === 'Vector Magnitude'}
                <div class="relative"><h3 class="text-xl font-semibold leading-none tracking-tight mb-4">Vector Magnitude</h3><p class="mb-4">Getting the magnitude of a vector involves extending the Pythagorean theorem into an arbitrary number of dimensions. Take all of the components, square each of them, add them together, then take the square root.</p>{@render DimensionButtons(magnitudeValues)}{@render VectorEditor(magnitudeValues)}<h4 class="text-lg font-semibold leading-non tracking-tight mb-4">Magnitude: {magnitudeResult}</h4></div>
              {:else if tab === 'Unit Vector'}
                <div class="relative"><h3 class="text-lg font-semibold leading-none tracking-tight mb-4">Unit Vector</h3><p class="mb-4">Finding the unit vector along a given vector's axis involves first getting that vector's magnitude. Then divide each component by that magnitude.</p>{@render DimensionButtons(unitValues)}{@render VectorEditor(unitValues)}<h4 class="text-lg font-semibold leading-non tracking-tight mb-4">Result</h4>{@render VectorResult(unitResult)}</div>
              {:else if tab === 'Dot Product'}
                <div class="relative"><h3 class="text-lg font-semibold leading-none tracking-tight mb-4">Dot Product</h3><p class="mb-4">To take the dot product of two vectors whose dimensions match, sum together the products of each corresponding component.</p>{@render DimensionButtons(dotA, 'Dimensions', (values, delta) => changePair(values, dotB, delta))}{@render VectorEditor(dotA)}{@render VectorEditor(dotB)}<h3 class="text-lg font-semibold leading-non tracking-tight mb-4"><span class="mx-2">Dot Product: </span>{dotResult}</h3></div>
              {:else if tab === 'Cross Product'}
                <div class="relative"><h3 class="text-lg font-semibold leading-none tracking-tight mb-4">Cross Product</h3><p class="mb-4">Defined for 3D vectors: a × b is perpendicular to both a and b.</p>{@render VectorEditor(crossA)}{@render VectorEditor(crossB)}<h4 class="text-lg font-semibold leading-non tracking-tight mb-4">Result</h4>{@render VectorResult(crossResult)}</div>
              {:else if tab === 'TSP'}
                <div class="relative"><h3 class="text-lg font-semibold leading-none tracking-tight mb-4">Triple Scalar Product</h3><p class="mb-4">a · (b × c). Signed volume of the parallelepiped spanned by a, b, c (3D).</p>{#each triple as vector}{@render VectorEditor(vector)}{/each}<h3 class="text-lg font-semibold leading-non tracking-tight mb-4"><span class="mx-2">a · (b × c): </span>{tripleResult}</h3></div>
              {:else}
                <div class="relative"><h3 class="text-lg font-semibold leading-none tracking-tight mb-4">Vector Projection</h3><p class="mb-4">proj<sub>b</sub>(a) = (a · b / ||b||²) b</p>{@render DimensionButtons(projectionA, 'Dimensions', (values, delta) => changePair(values, projectionB, delta))}{@render VectorEditor(projectionA, 'a = ')}{@render VectorEditor(projectionB, 'b = ')}<h4 class="text-lg font-semibold leading-non tracking-tight mb-2"><span class="mx-2">Scalar component (a · b / ||b||): </span>{projectionScalar}</h4><h4 class="text-lg font-semibold leading-non tracking-tight mb-4"><span class="mx-2">Projection vector</span></h4>{@render VectorResult(projectionResult)}</div>
              {/if}
            </div>
          </div>
        </div>
      {:else}
        <div class="border rounded-lg shadow-sm bg-card text-neutral-900"><div class="flex flex-col space-y-1.5 p-6"><h3 class="text-xl font-semibold leading-none tracking-tight">Probability and Statistics</h3><p class="text-sm text-neutral-500">(Under Construction)</p></div></div>
      {/if}
    </div>
  </div>
</main>
