// eslint-disable-next-line import/prefer-default-export
export const formatErr = (e, models) => {
  if (e instanceof models.sequelize.ValidateError) {
    return e.errors.map((x) => _.pick(x, ['path', 'message']));
  }
  return [{ path: 'name', message: 'something went wrong' }];
};
