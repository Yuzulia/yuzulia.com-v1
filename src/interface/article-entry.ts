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
              };
            };
          };
          tags: {
            data: {
              attributes: {
                name: string;
                slug: string;
              };
            }[];
          };
          seo?: {
            metaTitle: string;
            metaDescription: string;
            metaSocial: {
              socialNetwork: 'Twitter' | 'Facebook';
              title: string;
              description: string;
              image: {
                data?: {
                  attributes: {
                    url: string;
                  };
                };
              };
            }[];
            metaImage: {
              data: {
                attributes: {
                  url: string;
                };
              };
            };
            keywords: string;
            metaViewport?: string;
            canonicalURL?: string;
            metaRobots?: string;
            structuredData: any;
          };
        };
      }[];
    };
  };
}
