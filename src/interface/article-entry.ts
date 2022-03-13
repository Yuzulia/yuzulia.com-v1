export interface ArticleEntry {
  data: {
    yuzuliaArticles: {
      data?: {
        attributes: {
          title: string;
          body: string;
          publishedAt: string;
          updatedAt: string;
          category: {
            data: {
              attributes: {
                name: string;
                slug: string;
              }
            }
          },
          tags: {
            data: {
              attributes: {
                name: string;
                slug: string;
              }
            }[]
          }
        }
      }[]
    }
  }
}
