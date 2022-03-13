export interface Articles {
  data: {
    yuzuliaArticles: {
      data: {
        attributes: {
          title: string;
          slug: string;
          publishedAt: string;
          updatedAt: string;
        }
      }[];
      meta: {
        pagination: {
          total: number;
          pageSize: number;
        }
      }
    }
  }
}
