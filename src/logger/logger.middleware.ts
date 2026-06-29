
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogService } from './logger.service';
import { Log } from './logger.decorator';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(@Log('REST') private readonly logger: LogService) { }

    use(req: Request, res: Response, next: NextFunction) {
        res.on('finish', () => {
            const { method, originalUrl } = req;
            const { statusCode, statusMessage } = res;
            const message = `${method} ${originalUrl} ${statusCode} ${statusMessage}`;

            if (statusCode >= 500) {
                return this.logger.error(message);
            }
            if (statusCode >= 400) {
                return this.logger.warn(message);
            }

            return this.logger.log(message);
        });
        next();
    }
}
