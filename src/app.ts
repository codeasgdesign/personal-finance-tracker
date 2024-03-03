import Fastify from 'fastify'
import authRoutes from './routes/authRoutes';
import  { connectToMongoDB } from './services/mongodb';
import categoryRoutes from './routes/categoryRoutes';
import transactionRoutes from './routes/transactionRoutes';
import financialRoutes from './routes/financialRoutes';
import fastifyRateLimit from '@fastify/rate-limit';
import dotenv from 'dotenv';


const app = Fastify({ logger: true }) 
dotenv.config();


async function main() {
  await app.listen({
    port: process.env.PORT as unknown as number,
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
main()
export default app;
