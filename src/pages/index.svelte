<script lang="ts">
    import {onDestroy} from 'svelte';
    import {parse} from 'qs';
    import {push, querystring} from 'svelte-spa-router';
    import type {Articles} from "../interface/articles";
    import {library} from "@fortawesome/fontawesome-svg-core";
    import { faNewspaper, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
    // noinspection TypeScriptCheckImport
    import { FontAwesomeIcon } from 'fontawesome-svelte';

    library.add(faNewspaper, faPenToSquare);

    let endpoint = process.env.BACKEND_ENDPOINT;

    let query: {
        page: number
    } = {
        page: 1,
    };
    const pageSize = 12;
    let data: Promise<Articles>;

    async function getArticles() {
        const fetchDataResopnse = await fetch(`${endpoint}/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: `query($pageSize:Int!,$page:Int!){yuzuliaArticles(sort:["publishedAt:desc"],pagination:{pageSize:$pageSize,page:$page}){
                data {attributes {title slug publishedAt updatedAt}}meta{pagination{total pageSize}}}}`,
                variables: {
                    pageSize: pageSize,
                    page: query.page,
                }
            }),
        });

        if (!fetchDataResopnse.ok) throw new Error('Fetch error');

        return await fetchDataResopnse.json() as Articles;
    }

    const qsSub = querystring.subscribe(value => {
        let page = parseInt(<string>parse(value).page);
        if (!page) page = 1;
        query = {
            page: page,
        };
        data = getArticles();
    });

    onDestroy(qsSub);
</script>

<style>
    .section {
        @apply bg-white rounded-md shadow-md p-2 md:p-4 mb-4 mx-2;
    }

    .card {
        @apply bg-white rounded-md shadow-md p-2 text-black no-underline m-2;
    }

    .card:hover {
        @apply shadow-xl;
    }

    .card:active {
        @apply shadow-none;
    }

    .pagination-btn {
        @apply bg-white text-cyan-500 shadow-md px-4 py-2 mx-2 rounded-md;
    }

    .pagination-btn:hover {
        @apply shadow-xl;
    }

    .pagination-btn:active {
        @apply shadow-none;
    }

    .pagination-btn:disabled {
        @apply text-gray-400;
    }

    .pagination-btn:disabled:hover {
        @apply shadow-md;
    }
</style>

<svelte:head>
    <title>Yuzulia</title>
</svelte:head>

<div class="section">
    <div class="flex justify-center">
        <h1 class="font-extrabold">Yuzulia</h1>
    </div>
    <div class="flex justify-center"><b>Powered by YuzuRyo61.</b></div>
    <div class="my-2">
        <p>Yuzuliaへようこそ。</p>
        <p>YuzuliaはYuzuRyo61のこのブログやサービスの総称です。</p>
        <p>YuzuRyo61について詳しく知りたい、SNSを見てみたい、という方は以下のリンクへどうぞ。</p>
    </div>
    <div class="flex justify-center">
        <a class="mx-2" href="https://yuzuryo61.me/" target="_blank">YuzuRyo61.me</a>
        <a class="mx-2" href="https://misskey.io/@YuzuRyo61" target="_blank">SNS(misskey.io)</a>
    </div>
</div>

{#await data}
<div class="flex justify-center">
    <p>読み込んでいます...</p>
</div>
{:then data}
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {#each data.data.yuzuliaArticles.data as d}
    <a class="card" href="#/article/{d.attributes.slug}">
        <h3 class="text-2xl">{d.attributes.title}</h3>
        <div class="flex flex-wrap">
            <span class="mx-1" title="公開日"><FontAwesomeIcon icon={faNewspaper} /> {new Date(d.attributes.publishedAt).toLocaleString()}</span>
            <span class="mx-1" title="最終更新日"><FontAwesomeIcon icon={faPenToSquare} /> {new Date(d.attributes.updatedAt).toLocaleString()}</span>
        </div>
    </a>
    {/each}
</div>

<div class="flex justify-center my-2 lg:my-4">
    <button class="pagination-btn" on:click={push(`/?page=${query.page - 1}`)} disabled={(query.page <= 1) ? true : null}>Prev</button>
    <button class="pagination-btn" on:click={push(`/?page=${++query.page}`)} disabled={(data.data.yuzuliaArticles.meta.pagination.total - (pageSize * query.page) <= 0) ? true : null}>Next</button>
</div>
{:catch error}
<div class="section">
    <h1>List fetch error</h1>
    <p>記事の取得ができませんでした。</p>
    <p>サーバーに問題があるか、ネットワークの接続に問題があると思われます。</p>
    <p>再度時間をおいてお試しください。</p>
    <p><a href="#/" on:click={() => data = getArticles()}>再読み込み</a></p>
</div>
{/await}
