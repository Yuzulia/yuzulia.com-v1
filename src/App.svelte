<script lang="ts">
    import Router from 'svelte-spa-router';

    import Index from './pages/index.svelte';
    import Article from './pages/article.svelte';
    // import Page from './pages/page.svelte';
    import NotFound from './pages/404.svelte';

    const routes = {
        '/': Index,
        '/article/:id': Article,
        // '/p/:id': Page,
        '*': NotFound,
    }
</script>

<main class="w-full min-h-screen bg-slate-100">
    <nav class="bg-white w-full fixed py-2 top-0 shadow-lg">
        <div class="container mx-auto">
            <div class="flex justify-center md:justify-start">
                <a href="#/"><img title="Yuzulia" alt="Yuzulia" src="/favicon.png" class="h-12 w-12 md:h-16 md:w-16 mx-4"></a>
            </div>
        </div>
    </nav>

    <div class="container mx-auto pt-20 md:pt-24">
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

    h1 {
        @apply text-4xl;
    }

    h2 {
        @apply text-3xl;
    }

    h3 {
        @apply text-2xl;
    }

    h4 {
        @apply text-xl;
    }

    h5 {
        @apply text-lg;
    }

    h6 {
        @apply font-bold;
    }
</style>
