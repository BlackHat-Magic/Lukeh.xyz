<script lang="ts">
  import { HugeiconsIcon } from '@hugeicons/svelte';
  import {
    BlueskyIcon,
    GithubIcon,
    InstagramIcon,
    Linkedin01Icon,
    NewTwitterIcon,
    ThreadsIcon
  } from '@hugeicons/core-free-icons';

  let email = $state('');
  let subject = $state('');
  let body = $state('');
  let sending = $state(false);
  let message = $state('');
  let success = $state(false);

  async function submit() {
    sending = true;
    message = '';
    try {
      const data = new FormData();
      data.append('email', email);
      data.append('subject', subject);
      data.append('body', body);
      const response = await fetch('/api/contact', { method: 'POST', body: data });
      const result = await response.json() as { message?: string; success?: boolean };
      message = result.message || '';
      success = !!result.success;
      if (success) { email = ''; subject = ''; body = ''; }
    } catch {
      message = 'Failed to send email. Try again later.';
      success = false;
    } finally {
      sending = false;
    }
  }
</script>

<main class="contact-page mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6">
  <div class="w-full max-w-md">
    <h1 class="text-center">Contact Me</h1>
    <p class="contact-intro">You can send <a href="mailto:contact@lukeh.xyz">from your email client if you'd prefer</a></p>
    <div class="space-y-4 mb-32">
      {#if message}
        <div class="contact-message" class:success class:error={!success} role="status">
          <h5>{success ? 'Success' : 'Error'}</h5>
          <div>{message}</div>
        </div>
      {/if}
      <form onsubmit={(event) => { event.preventDefault(); submit(); }} method="POST" action="/api/contact">
        <div class="contact-form-fields">
          <div><label for="email">Email</label><input type="email" id="email" name="email" bind:value={email} required placeholder="So I can get back to you" /></div>
          <div><label for="subject">Subject</label><input type="text" id="subject" name="subject" bind:value={subject} required /></div>
          <div><label for="body">Message</label><textarea id="body" name="body" rows="5" bind:value={body} required placeholder="You are so cool, can I hire you?"></textarea></div>
          <button class="contact-submit" type="submit" disabled={sending}>{sending ? 'Sending...' : 'Send Message'}</button>
        </div>
      </form>
    </div>

    <h2 class="contact-social-heading">Or find me on these platforms</h2>
    <div class="social-links">
      <a href="https://github.com/BlackHat-Magic" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub"><HugeiconsIcon icon={GithubIcon} size={22} strokeWidth={1.8} /></a>
      <a href="https://x.com/Black_HatMagic/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" title="Twitter"><HugeiconsIcon icon={NewTwitterIcon} size={22} strokeWidth={1.8} /></a>
      <a href="https://bsky.app/profile/blackhatmagic.bsky.social" target="_blank" rel="noopener noreferrer" aria-label="Bluesky" title="Bluesky"><HugeiconsIcon icon={BlueskyIcon} size={22} strokeWidth={1.8} /></a>
      <a href="https://www.threads.com/@black_hat_magic" target="_blank" rel="noopener noreferrer" aria-label="Threads" title="Threads"><HugeiconsIcon icon={ThreadsIcon} size={22} strokeWidth={1.8} /></a>
      <a href="https://www.instagram.com/black_hat_magic/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram"><HugeiconsIcon icon={InstagramIcon} size={22} strokeWidth={1.8} /></a>
      <a href="https://www.linkedin.com/school/university-of-california-merced/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn"><HugeiconsIcon icon={Linkedin01Icon} size={22} strokeWidth={1.8} /></a>
    </div>
  </div>
</main>

<style>
  .contact-page h1 { margin: 0 0 18px; }
  .contact-intro { margin: 0 0 32px; color: var(--muted-foreground); font-size: .78rem; line-height: 1.6; text-align: center; }
  .contact-form-fields { display: grid; gap: 18px; }
  .contact-form-fields > div { display: grid; gap: 7px; }
  .contact-form-fields label { font-size: .75rem; }
  .contact-form-fields input, .contact-form-fields textarea { width: 100%; padding: 11px 12px; font-size: .9rem; }
  .contact-form-fields textarea { min-height: 140px; resize: vertical; }
  .contact-submit { min-height: 44px; border: 1px solid var(--accent); background: var(--accent); color: var(--accent-foreground) !important; cursor: pointer; font-family: var(--font-display); font-size: .78rem; font-weight: 700; transition: background-color 140ms ease, color 140ms ease; }
  .contact-submit:hover { background: var(--foreground); border-color: var(--foreground); color: var(--bg) !important; }
  .contact-submit:disabled { cursor: not-allowed; opacity: .5; }
  .contact-message { border: 1px solid var(--border); border-left: 4px solid var(--accent); padding: 13px; color: var(--foreground); font-size: .82rem; line-height: 1.5; }
  .contact-message.success { border-left-color: #40a02b; background: color-mix(in srgb, #40a02b 8%, var(--card)); }
  .contact-message.error { border-left-color: #d20f39; background: color-mix(in srgb, #d20f39 8%, var(--card)); }
  .contact-message h5 { margin: 0 0 4px; font-size: .76rem; text-transform: uppercase; }
  .contact-social-heading { margin: 0 0 20px; text-align: center; }
  .social-links { display: flex; justify-content: center; align-items: center; gap: 5px; margin-bottom: 32px; }
  .social-links a { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border: 1px solid transparent; color: var(--foreground); text-decoration: none; transition: background-color 140ms ease, border-color 140ms ease, transform 140ms ease; }
  .social-links a:hover { border-color: var(--border); background: var(--muted); transform: translateY(-2px); }
</style>
