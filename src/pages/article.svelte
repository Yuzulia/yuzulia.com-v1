<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import type {ArticleEntry} from '../interface/article-entry';
    import {params as spaParam} from 'svelte-spa-router';
    import {marked} from 'marked';
    import { mdRenderer } from "../md-renderer";
    import {library} from "@fortawesome/fontawesome-svg-core";
    import { faNewspaper, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
    // noinspection TypeScriptCheckImport
    import { FontAwesomeIcon } from 'fontawesome-svelte';

    library.add(faNewspaper, faPenToSquare);

    let endpoint = process.env.BACKEND_ENDPOINT;

    marked.setOptions({
        baseUrl: endpoint,
        renderer: mdRenderer,
    });
    let data: Promise<ArticleEntry>;
    export let params = {
        id: ''
    };

    async function getArticle() {
        const fetchDataResponse = await fetch(`${endpoint}/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: `query($id:String!){yuzuliaArticles(filters:{slug:{eq:$id}}){data{attributes{
                title body slug publishedAt updatedAt category{data{attributes{name slug}}}tags{data{attributes{name slug}}}
                seo{metaTitle metaDescription metaSocial{socialNetwork title description image{data{attributes{url}}}}
                metaImage{data{attributes{url}}}keywords metaViewport canonicalURL metaRobots structuredData}}}}}`,
                variables: {
                    id: params.id,
                }
            }),
        });

        if (!fetchDataResponse.ok) throw new Error('Fetch error');

        const fetchData = await fetchDataResponse.json() as ArticleEntry;
        if (fetchData.data.yuzuliaArticles.data.length === 0) throw new Error('Not found');

        return fetchData;
    }

    const paramSub = spaParam.subscribe(value => {
        params = value as { id: string };
        data = getArticle();
    });

    onMount(() => {
        data = getArticle();
    });

    onDestroy(paramSub);
</script>

<style>
    .article-section {
        @apply mx-2 p-2 md:p-4 border rounded-lg shadow bg-white;
    }
</style>

<svelte:head>
    {#await data then data}
        <title>{data.data.yuzuliaArticles.data[0].attributes.title} | Yuzulia</title>
        {#if data.data.yuzuliaArticles.data[0].attributes.seo}
        <meta content="{data.data.yuzuliaArticles.data[0].attributes.seo.metaDescription}" name="description" />

        <meta property="og:title" content="{data.data.yuzuliaArticles.data[0].attributes.seo.metaTitle}" />
        <meta property="og:description" content="{data.data.yuzuliaArticles.data[0].attributes.seo.metaDescription}" />
        <meta property="og:url" content="https://yuzulia.com/#/article/{data.data.yuzuliaArticles.data[0].attributes.slug}" />
        <meta property="og:image" content="{endpoint}{data.data.yuzuliaArticles.data[0].attributes.seo.metaImage.data.attributes.url}" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Yuzulia" />
        {/if}
    {:catch error}
        <title>Yuzulia</title>
    {/await}
</svelte:head>

{#await data}
    <section class="article-section">
        <div class="animate-pulse">
            <div class="h-8 bg-slate-200 rounded-full my-2"></div>
            <div class="h-4 bg-slate-200 rounded-full my-2"></div>
        </div>
    </section>
{:then data}
    <section class="article-section">
        <h1 class="text-4xl">{data.data.yuzuliaArticles.data[0].attributes.title}</h1>
        <div class="flex flex-wrap">
            <span class="mx-1" title="公開日"><FontAwesomeIcon icon={faNewspaper} /> <time>{new Date(data.data.yuzuliaArticles.data[0].attributes.publishedAt).toLocaleString()}</time></span>
            <span class="mx-1" title="最終更新日"><FontAwesomeIcon icon={faPenToSquare} /> <time>{new Date(data.data.yuzuliaArticles.data[0].attributes.updatedAt).toLocaleString()}</time></span>
        </div>
        <article>
            {@html marked.parse(
                data.data.yuzuliaArticles.data[0].attributes.body
            )}
        </article>
        <hr class="my-2">
        <div class="mt-2">
            {#if data.data.yuzuliaArticles.data[0].attributes.category.data}
            <div class="flex flex-wrap">
                <span>カテゴリ: </span>
                <a href="#/c/{data.data.yuzuliaArticles.data[0].attributes.category.data.attributes.slug}">
                    {data.data.yuzuliaArticles.data[0].attributes.category.data.attributes.name}
                </a>
            </div>
            {/if}
            <div class="flex flex-wrap">
                <span>タグ: </span>
                {#each data.data.yuzuliaArticles.data[0].attributes.tags.data as t}
                <a href="#/t/{t.attributes.slug}" class="mx-1">{t.attributes.name}</a>
                {/each}
            </div>
        </div>
    </section>
{:catch error}
    <section class="article-section">
        <h1 class="text-4xl">Cannot fetch article</h1>
        <p>指定したURLの記事が見つからなかったか、サーバー接続に問題がありました。</p>
        <p>再度時間をおいてお試しください。</p>
        <a href="#/">ホームへ戻る</a>
    </section>
{/await}
