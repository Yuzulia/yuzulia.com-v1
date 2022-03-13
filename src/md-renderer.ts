import {marked} from 'marked';

export const mdRenderer = new marked.Renderer({
  gfm: true,
  headerIds: false,
});

mdRenderer.link = ((href, title, text) => {
  let link = marked.Renderer.prototype.link.call(mdRenderer, href, title, text);
  if (href && href.match(/^(https?:\/\/|\/)/)) {
    return link.replace("<a", "<a target='_blank' ");
  } else {
    return link;
  }
});
