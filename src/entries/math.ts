import { mount } from 'svelte';
import App from '../App.svelte';
import Page from '../lib/Math.svelte';

mount(App, { target: document.getElementById('app')!, props: { Page } });
