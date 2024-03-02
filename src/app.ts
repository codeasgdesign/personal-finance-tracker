import Fastify from 'fastify'
import authRoutes from './routes/authRoutes';
import  { connectToMongoDB } from './services/mongodb';
import categoryRoutes from './routes/categoryRoutes';
const app = Fastify({ logger: true }) 

async function main() {
  await app.listen({
    port: 3000,
    host: '0.0.0.0',
  })
}
app.register(authRoutes);
app.register(categoryRoutes)
connectToMongoDB()
app.get('/healthcheck', (_req, res) => {
    res.send({ message: 'Success' })
  })
main()