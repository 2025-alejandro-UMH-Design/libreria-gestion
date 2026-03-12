import express from 'express';
import cors from 'cors';
import productosRoutes from './routes/productos';
import proveedoresRoutes from './routes/proveedores';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/productos', productosRoutes);
app.use('/api/proveedores', proveedoresRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));