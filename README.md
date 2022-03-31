# Atelier Server
Handles requests for the Atelier Overview feature. This back end service was built from scratch to support the Atelier client.

## Basic installation

Run `npm install`, then `npm start`

### ETL

The ETL process was implemented using Mongoimport and MongoDB's aggregation pipeline to combine five datasets.

### Optimization

Performance bottlenecks were identified using K6, Loader.io, and New Relic.

### Scaling

By implementing Redis caching and vertical scaling with PM2’s node cluster mode, the microservice was scaled to handle 1750 RPS with 0% error rate.
