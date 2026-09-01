<script lang="ts">
  import { onMount } from 'svelte';
  const titles = ['Luke Henderson', 'Undergraduate Student', 'Graphics and AI Developer'];
  let text = $state('\u2063');
  let cursorVisible = $state(true);
  onMount(() => {
    let textIndex = 0;
    let charIndex = 0;
    let direction: 'forward' | 'backward' = 'forward';
    let typing: ReturnType<typeof setInterval>;
    let pause: ReturnType<typeof setTimeout> | undefined;
    let stopped = false;

    const startTyping = () => {
      const current = titles[textIndex];
      if (charIndex > current.length) {
        direction = 'backward';
        clearInterval(typing);
        pause = setTimeout(() => {
          if (!stopped) typing = setInterval(startTyping, 110);
        }, 1500);
      }

      text = current.substring(0, charIndex) || '\u2063';
      if (direction === 'forward') {
        charIndex += 1;
      } else {
        if (charIndex === 0) {
          direction = 'forward';
          clearInterval(typing);
          pause = setTimeout(() => {
            textIndex = (textIndex + 1) % titles.length;
            if (!stopped) typing = setInterval(startTyping, 110);
          }, 20);
        }
        charIndex -= 1;
      }
    };

    typing = setInterval(startTyping, 110);
    const cursor = setInterval(() => cursorVisible = !cursorVisible, 550);
    return () => {
      stopped = true;
      clearInterval(typing);
      clearInterval(cursor);
      if (pause) clearTimeout(pause);
    };
  });
</script>
<main class="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
  <div class="mb-8"><img src="/images/me%20lon%20pc.webp" alt="A photo of Luke Henderson" class="h-40 w-40 rounded-full object-cover shadow-lg ring-2 ring-gray-200" /></div>
  <div class="flex items-center justify-center mx-auto text-center max-w-7xl"><div class="relative flex items-center justify-center h-auto"><h1 class="text-2xl font-black leading-tight">{text}</h1><span class:hidden={!cursorVisible} class="absolute right-0 w-2 -mr-2 bg-foreground h-3/4" aria-hidden="true"></span></div></div>
  <p class="max-w-prose text-lg leading-relaxed text-foreground sm:text-xl">I am a computer science and engineering student at the University of California, Merced with a professional interest in game engines, graphics programming, and machine learning and  a more casual interest in operating systems, compiler design, and backend development.</p>
</main>
