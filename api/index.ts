import { Router } from 'express';
import { healthHandler } from './health';
import { uraVacantSitesHandler } from './ura-vacant-sites';
import { uraLandedHousingHandler } from './ura-landed-housing';
import { uraSitesHandler } from './ura-sites';

export const apiRouter = Router();

apiRouter.get('/health', healthHandler);
apiRouter.get('/ura-vacant-sites', uraVacantSitesHandler);
apiRouter.get('/ura-landed-housing', uraLandedHousingHandler);
apiRouter.get('/ura-sites', uraSitesHandler);

export {
  healthHandler,
  uraVacantSitesHandler,
  uraLandedHousingHandler,
  uraSitesHandler,
};

export default apiRouter;
