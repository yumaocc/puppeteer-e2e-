export const isShowExtra = (
  contractType: string | string[],
  config: string[],
) => {
  if (Array.isArray(contractType)) {
    return !!contractType?.find((item) => config.includes(item));
  }
  return config.includes(contractType);
};
