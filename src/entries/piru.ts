import { mount } from 'svelte';
import App from '../App.svelte';
import Page from '../lib/Piru.svelte';

mount(App, { target: document.getElementById('app')!, props: { Page } });
