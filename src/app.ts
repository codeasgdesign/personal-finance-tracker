import Fastify from 'fastify'
import authRoutes from './routes/authRoutes';
import  { connectToMongoDB } from './services/mongodb';
import categoryRoutes from './routes/categoryRoutes';
import transactionRoutes from './routes/transactionRoutes';
import financialRoutes from './routes/financialRoutes';
import fastifyRateLimit from '@fastify/rate-limit';

const app = Fastify({ logger: true }) 


async function main() {
  await app.listen({
    port: 3000,
    host: '0.0.0.0',
  })
}

 app.register(fastifyRateLimit, {
  max: 100,
  timeWindow: '1 minute'
})
app.register(authRoutes);
app.register(categoryRoutes)
app.register(transactionRoutes);
app.register(financialRoutes)
connectToMongoDB()

app.get('/healthcheck', (_req, res) => {
    res.send({ message: 'Success' })
})
main()
export  default app;
