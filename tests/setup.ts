import { users, pivots, irrigations } from '../src/database';

export const clearDatabase = () => {
  users.length = 0;
  pivots.length = 0;
  irrigations.length = 0;
};

global.console = {
  ...console,
};
