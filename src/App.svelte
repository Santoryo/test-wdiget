<script lang="ts">
  import { onMount, tick } from 'svelte';
  import Message from './lib/Message.svelte';
  import Alert from './lib/Alert.svelte';
  import { ws } from './lib/ws';

  type FeedItem =
    | { id: string; kind: 'message'; sender: string; message: string }
    | { id: string; kind: 'alert'; sender: string; message: string };

  let feed = $state<FeedItem[]>([]);
  let scrollRoot: HTMLDivElement | null = null;

  function captureScrollRoot(node: HTMLDivElement) {
    scrollRoot = node;
    return () => {
      scrollRoot = null;
    };
  }

  function append(kind: 'message' | 'alert', sender: string, message: string) {
    feed = [...feed, { id: crypto.randomUUID(), kind, sender, message }];
    void tick().then(() => {
      scrollRoot?.scrollTo({ top: scrollRoot.scrollHeight, behavior: 'auto' });
    });
  }

  onMount(() => {
    function onMessage(e: Event) {
      const ce = e as CustomEvent<{ sender: string; message: string }>;
      const { sender, message } = ce.detail;
      append('message', sender, message);
    }

    function onAlert(e: Event) {
      const ce = e as CustomEvent<{ sender: string; message: string }>;
      const { sender, message } = ce.detail;
      append('alert', sender, message);
    }

    window.addEventListener('chatwidget:message', onMessage);
    window.addEventListener('chatwidget:alert', onAlert);

    return () => {
      window.removeEventListener('chatwidget:message', onMessage);
      window.removeEventListener('chatwidget:alert', onAlert);
    };
  });
</script>

<div
  class="flex h-[800px] w-[500px] flex-col overflow-hidden rounded-lg border border-neutral-200 bg-red-500 shadow-sm"
>
  <div
    {@attach captureScrollRoot}
    class="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
  >
    <div class="mt-auto flex flex-col gap-2 p-3">
      {#each feed as item (item.id)}
        {#if item.kind === 'message'}
          <Message sender={item.sender} message={item.message} />
        {:else}
          <Alert sender={item.sender} message={item.message} />
        {/if}
      {/each}
    </div>
  </div>
</div>
