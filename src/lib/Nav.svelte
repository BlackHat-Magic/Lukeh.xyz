<script lang="ts">
  import { onMount } from 'svelte';
  import { HugeiconsIcon } from '@hugeicons/svelte';
  import {
    ArrowDown01Icon,
    CheckmarkCircle04Icon,
    Coffee02Icon,
    GithubIcon,
    Moon01Icon,
    Sun01Icon
  } from '@hugeicons/core-free-icons';

  type Mode = 'light' | 'dark';
  type Theme = { key: string; name: string };
  const lightThemes: Theme[] = [
    { key: 'catppuccin-latte', name: 'Catppuccin Latte' },
    { key: 'nord-light', name: 'Nord Light' },
    { key: 'strawberry-light', name: 'Strawberry Light' },
    { key: 'gruvbox-light', name: 'Gruvbox Light' },
    { key: 'rose-pine-dawn', name: 'Rosé Pine Dawn' }
  ];
  const darkThemes: Theme[] = [
    { key: 'catppuccin-mocha', name: 'Catppuccin Mocha' },
    { key: 'nord-dark', name: 'Nord Dark' },
    { key: 'strawberry-dark', name: 'Strawberry Dark' },
    { key: 'gruvbox-dark', name: 'Gruvbox Dark' },
    { key: 'dracula', name: 'Dracula' },
    { key: 'rose-pine', name: 'Rosé Pine' }
  ];

  let dropdownOpen = $state(false);
  let themeOpen = $state(false);
  let mode = $state<Mode>('light');
  let lightKey = $state('catppuccin-latte');
  let darkKey = $state('catppuccin-mocha');
  let activeTab = $state<Mode>('light');
  let closeTimer: ReturnType<typeof setTimeout> | undefined;

  function apply(animate = true) {
    const html = document.documentElement;
    html.dataset.mode = mode;
    html.dataset.theme = mode === 'light' ? lightKey : darkKey;
    html.style.colorScheme = mode;
    if (animate) {
      html.classList.add('theme-anim');
      setTimeout(() => html.classList.remove('theme-anim'), 370);
    }
    localStorage.setItem('theme.mode', mode);
    localStorage.setItem('theme.pref', JSON.stringify({ lightKey, darkKey }));
  }

  function toggleMode() {
    mode = mode === 'light' ? 'dark' : 'light';
    activeTab = mode;
    apply();
  }

  function selectTheme(theme: Theme) {
    if (mode === 'light') lightKey = theme.key;
    else darkKey = theme.key;
    apply();
  }

  function showDropdown() {
    clearTimeout(closeTimer);
    dropdownOpen = true;
  }

  function hideDropdown() {
    closeTimer = setTimeout(() => dropdownOpen = false, 200);
  }

  onMount(() => {
    let pref: { lightKey?: string; darkKey?: string } | null = null;
    try { pref = JSON.parse(localStorage.getItem('theme.pref') || 'null'); } catch { /* defaults */ }
    try {
      const saved = localStorage.getItem('theme.mode') as Mode | null;
      if (pref?.lightKey && lightThemes.some((theme) => theme.key === pref?.lightKey)) lightKey = pref.lightKey;
      if (pref?.darkKey && darkThemes.some((theme) => theme.key === pref?.darkKey)) darkKey = pref.darkKey;
      mode = saved === 'light' || saved === 'dark' ? saved : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      activeTab = mode;
      apply(false);
    } catch { /* private browsing can deny storage */ }
  });
</script>

<svelte:window onkeydown={(event) => event.key === 'Escape' && (themeOpen = false)} />
<nav class="site-nav" aria-label="Main navigation">
  <div class="relative">
    <ul class="site-nav__links">
      <li><a href="/">Home</a></li>
      <li onmouseenter={showDropdown} onmouseleave={hideDropdown}>
        <a href="/projects" class:is-open={dropdownOpen} onclick={(event) => event.preventDefault()} aria-haspopup="true" aria-expanded={dropdownOpen}>
          Portfolio Projects <HugeiconsIcon icon={ArrowDown01Icon} size={14} strokeWidth={1.8} class={dropdownOpen ? 'rotate-180' : ''} />
        </a>
      </li>
      <li><a href="/blog">Blog</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
    {#if dropdownOpen}
      <div class="site-nav__dropdown" role="presentation" onmouseenter={showDropdown} onmouseleave={hideDropdown}>
        <div class="site-nav__dropdown-inner">
          <div>
            <a class="site-nav__project" href="/projects/palladia-engine"><strong>Palladia Game Engine</strong><span>A simple ECS-based game engine written in C using SDL's GPU API</span></a>
            <a class="site-nav__project" href="/projects/piru"><strong>Piru Compiler</strong><span>A simple Rust-based compiler for a small, C-like language</span></a>
            <a class="site-nav__project" href="/projects/portfolio"><strong>Lukeh.xyz</strong><span>This portfolio website</span></a>
          </div>
          <div>
            <a class="site-nav__project" href="/projects/sd-runpod"><strong>SD-Runpod</strong><span>A project using Runpod's serverless platform to serve transformer and diffusion models</span></a>
            <a class="site-nav__project" href="/projects/math"><strong>Old Math Demos</strong><span>Some simple calculators I wrote to familiarize myself with Alpine</span></a>
            <a class="site-nav__project" href="/projects/other"><strong>View All</strong><span>Other portfolio projects that didn't make it above the fold</span></a>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <div class="site-nav__tools">
    <a class="site-nav__icon" href="https://ko-fi.com/lukethenderson" target="_blank" rel="noopener noreferrer" aria-label="Support on Ko-Fi" title="Ko-Fi">
      <HugeiconsIcon icon={Coffee02Icon} size={19} strokeWidth={1.8} />
    </a>
    <a class="site-nav__icon" href="https://github.com/BlackHat-Magic/Lukeh.xyz" target="_blank" rel="noopener noreferrer" aria-label="View GitHub repository" title="GitHub">
      <HugeiconsIcon icon={GithubIcon} size={19} strokeWidth={1.8} />
    </a>
    <div class="theme-picker" role="presentation" onmouseenter={() => themeOpen = true} onmouseleave={() => themeOpen = false}>
      <button class="site-nav__icon" type="button" onclick={toggleMode} aria-label="Toggle light/dark theme" title="Toggle theme" aria-expanded={themeOpen}>
        <HugeiconsIcon icon={mode === 'dark' ? Moon01Icon : Sun01Icon} size={18} strokeWidth={1.8} />
      </button>
      {#if themeOpen}
        <div class="theme-popover">
          <div class="theme-popover__tabs">
            <button class:is-active={activeTab === 'light'} type="button" onclick={() => { activeTab = 'light'; if (mode !== 'light') { mode = 'light'; apply(); } }}>Light</button>
            <button class:is-active={activeTab === 'dark'} type="button" onclick={() => { activeTab = 'dark'; if (mode !== 'dark') { mode = 'dark'; apply(); } }}>Dark</button>
          </div>
          <p class="theme-popover__label">Choose a {activeTab} theme</p>
          {#each activeTab === 'light' ? lightThemes : darkThemes as theme}
            <button class="theme-popover__option" class:is-current={(activeTab === 'light' ? lightKey : darkKey) === theme.key} type="button" onclick={() => selectTheme(theme)}>
              <span>{theme.name}</span>
              {#if (activeTab === 'light' ? lightKey : darkKey) === theme.key}<HugeiconsIcon icon={CheckmarkCircle04Icon} size={15} strokeWidth={2} aria-hidden="true" />{/if}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</nav>
