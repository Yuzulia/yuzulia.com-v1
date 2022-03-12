<script lang="ts">
    import Router from 'svelte-spa-router';
    // import wrap from 'svelte-spa-router/wrap';

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

<main>
    <a href="#/a/test">test</a>
    <Router {routes} />
</main>

<style global lang="postcss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>
