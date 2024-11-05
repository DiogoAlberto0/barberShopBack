import express, { Application } from 'express';
import { managerRoutes } from './routes/manager';
import { barberRoutes } from './routes/barber';
import { barberShopRoutes } from './routes/barberShops';
import { adminRoutes } from './routes/admin';
import { serviceRoutes } from './routes/servicesRoutes';
import { appointmentRoutes } from './routes/appointmentRoutes';

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
    }

    private middlewares(): void {
        this.app.use(express.json());

    }

    private routes(): void {
        this.app.use('/manager', managerRoutes);
        this.app.use('/barber', barberRoutes);
        this.app.use('/barberShop', barberShopRoutes);
        this.app.use('/admin', adminRoutes);
        this.app.use('/service', serviceRoutes);
        this.app.use('/appointment', appointmentRoutes);
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
}

export { App };
