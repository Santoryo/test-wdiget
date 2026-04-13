<script lang="ts">
  import type { Attachment } from "svelte/attachments";
  import { animate } from "animejs";

  let { sender, message }: { sender: string; message: string } = $props();

  const enterAnimation: Attachment<HTMLDivElement> = (el) => {
    const animation = animate(el, {
      opacity: { from: 0, to: 1 },
      y: { from: 10, to: 0 },
      duration: 380,
      ease: "outCubic",
    });
    return () => animation.revert();
  };
</script>

<div class="message-root" {@attach enterAnimation}>
  <div class="sender">{sender}</div>
  <div class="body">{message}</div>
</div>

<style>
  .message-root {
    border-radius: 0.375rem;
    border: 1px solid rgb(229 231 235);
    background: rgb(249 250 251);
    padding: 0.5rem 0.75rem;
  }
  .sender {
    font-size: 0.75rem;
    font-weight: 600;
    color: rgb(75 85 99);
    margin-bottom: 0.25rem;
  }
  .body {
    font-size: 0.875rem;
    line-height: 1.4;
    color: rgb(17 24 39);
    white-space: pre-wrap;
    word-break: break-word;
  }
</style>
