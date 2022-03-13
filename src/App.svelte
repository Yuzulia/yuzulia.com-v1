<script lang="ts">
    import Router from 'svelte-spa-router';

    import Index from './pages/index.svelte';
    import Article from './pages/article.svelte';
    import Page from './pages/page.svelte';
    import NotFound from './pages/404.svelte';

    const routes = {
        '/': Index,
        '/a/:id': Article,
        '/p/:id': Page,
        '*': NotFound,
    }
</script>

<main class="w-screen h-screen bg-slate-100">
    <a href="#/a/test">test</a>
    <div class="container mx-auto">
        <Router {routes} />
    </div>
    <footer class="w-full py-2 lg:py-6">
        <div class="flex justify-center">
            <p>&copy; 2022 YuzuRyo61.</p>
        </div>
    </footer>
</main>

<style global lang="postcss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    a {
        @apply text-cyan-500 underline;
    }

    a:visited {
        @apply text-purple-500 underline;
    }
</style>
