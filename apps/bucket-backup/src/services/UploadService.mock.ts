export const mockUploadServiceFactory = () => {
  return {
    upload: jest.fn<Promise<void>, []>(),
  };
};
