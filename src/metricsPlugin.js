export function createMetricsPlugin() {
  return {
    async requestDidStart() {
      return {
        async didResolveOperation(requestContext) {
          // Nama operasi baru tersedia secara pasti pada fase ini. Query tugas
          // NPlusOneAudit otomatis menonaktifkan batching tanpa HTTP header.
          if (requestContext.operationName === 'NPlusOneAudit') {
            requestContext.contextValue.useDataLoader = false;
          }
        },
        async willSendResponse(requestContext) {
          const metrics = requestContext.contextValue?.metrics;
          if (!metrics) return;
          const summary = {
            operation: requestContext.operationName ?? 'anonymous',
            totalDatabaseQueries: metrics.databaseQueryCount,
            relationResolverCalls: metrics.relationResolverCallCount,
            dataLoaderBatchQueries: metrics.loaderBatchQueryCount,
            dataLoaderEnabled: requestContext.contextValue.useDataLoader,
          };
          console.log(`[resolver-audit] ${JSON.stringify(summary)}`);
          const body = requestContext.response.body;
          if (body.kind === 'single') {
            body.singleResult.extensions = {
              ...body.singleResult.extensions,
              resolverAudit: summary,
            };
          }
        },
      };
    },
  };
}
